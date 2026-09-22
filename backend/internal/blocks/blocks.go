package blocks

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

var youtubeIDRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{11}$`)

type Block struct {
	Type          string   `json:"type"`
	Level         int      `json:"level,omitempty"`
	Text          string   `json:"text,omitempty"`
	MediaID       string   `json:"mediaId,omitempty"`
	MediaIDs      []string `json:"mediaIds,omitempty"`
	ImagePosition string   `json:"imagePosition,omitempty"`
	ImageSize     string   `json:"imageSize,omitempty"`
	Alt           string   `json:"alt,omitempty"`
	Caption       string   `json:"caption,omitempty"`
	Attribution   string   `json:"attribution,omitempty"`
	VideoID       string   `json:"videoId,omitempty"`

	// Resolved properties attached during API response hydration
	URL      string      `json:"url,omitempty"`
	ThumbURL string      `json:"thumb_url,omitempty"`
	Media    []MediaItem `json:"media,omitempty"`
}

type MediaItem struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	ThumbURL string `json:"thumb_url"`
	Alt      string `json:"alt,omitempty"`
	Caption  string `json:"caption,omitempty"`
}

// ConvertPlainTextToParagraphBlocks converts a legacy plain text article to paragraph blocks.
func ConvertPlainTextToParagraphBlocks(text string) json.RawMessage {
	text = strings.TrimSpace(text)
	if text == "" {
		b, _ := json.Marshal([]Block{})
		return json.RawMessage(b)
	}

	// If already a JSON array, return as is
	if strings.HasPrefix(text, "[") {
		var arr []map[string]any
		if err := json.Unmarshal([]byte(text), &arr); err == nil {
			return json.RawMessage(text)
		}
	}

	normalized := strings.ReplaceAll(text, "\r\n", "\n")
	paras := strings.Split(normalized, "\n\n")
	var res []Block
	for _, p := range paras {
		p = strings.TrimSpace(p)
		if p != "" {
			res = append(res, Block{
				Type: "paragraph",
				Text: p,
			})
		}
	}

	if len(res) == 0 && text != "" {
		res = append(res, Block{
			Type: "paragraph",
			Text: text,
		})
	}

	b, _ := json.Marshal(res)
	return json.RawMessage(b)
}

// ValidateArticleContent performs strict server-side validation on block content.
func ValidateArticleContent(ctx context.Context, db *pgxpool.Pool, raw json.RawMessage) error {
	if len(raw) == 0 || string(raw) == "null" {
		return nil
	}

	if len(raw) > 2<<20 { // 2MB max
		return errors.New("article content payload is too large")
	}

	var rawList []json.RawMessage
	if err := json.Unmarshal(raw, &rawList); err != nil {
		return errors.New("invalid content format: must be a JSON array of blocks")
	}

	var mediaIDsToCheck []string
	mediaIDMap := make(map[string]bool)

	for i, item := range rawList {
		var base struct {
			Type string `json:"type"`
		}
		if err := json.Unmarshal(item, &base); err != nil || base.Type == "" {
			return fmt.Errorf("block at position %d missing valid type", i)
		}

		switch base.Type {
		case "heading":
			var b struct {
				Level int    `json:"level"`
				Text  string `json:"text"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed heading block at position %d", i)
			}
			if b.Level != 2 && b.Level != 3 {
				return fmt.Errorf("invalid heading level %d at position %d: only levels 2 and 3 are allowed", b.Level, i)
			}
			if strings.TrimSpace(b.Text) == "" {
				return fmt.Errorf("heading block at position %d text cannot be empty", i)
			}
			if len(b.Text) > 500 {
				return fmt.Errorf("heading block at position %d exceeds maximum length of 500 characters", i)
			}

		case "paragraph":
			var b struct {
				Text string `json:"text"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed paragraph block at position %d", i)
			}
			if len(b.Text) > 50000 {
				return fmt.Errorf("paragraph block at position %d exceeds maximum length of 50,000 characters", i)
			}

		case "image":
			var b struct {
				MediaID string `json:"mediaId"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed image block at position %d", i)
			}
			if strings.TrimSpace(b.MediaID) == "" {
				return fmt.Errorf("image block at position %d requires a valid mediaId", i)
			}
			if _, err := uuid.Parse(b.MediaID); err != nil {
				return fmt.Errorf("invalid mediaId format at position %d", i)
			}
			if !mediaIDMap[b.MediaID] {
				mediaIDMap[b.MediaID] = true
				mediaIDsToCheck = append(mediaIDsToCheck, b.MediaID)
			}

		case "split":
			var b struct {
				ImagePosition string `json:"imagePosition"`
				MediaID       string `json:"mediaId"`
				Text          string `json:"text"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed split block at position %d", i)
			}
			if b.ImagePosition != "left" && b.ImagePosition != "right" {
				return fmt.Errorf("invalid imagePosition '%s' at position %d: must be 'left' or 'right'", b.ImagePosition, i)
			}
			if strings.TrimSpace(b.MediaID) == "" {
				return fmt.Errorf("split block at position %d requires a valid mediaId", i)
			}
			if _, err := uuid.Parse(b.MediaID); err != nil {
				return fmt.Errorf("invalid mediaId format at position %d", i)
			}
			if !mediaIDMap[b.MediaID] {
				mediaIDMap[b.MediaID] = true
				mediaIDsToCheck = append(mediaIDsToCheck, b.MediaID)
			}

		case "quote":
			var b struct {
				Text string `json:"text"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed quote block at position %d", i)
			}
			if strings.TrimSpace(b.Text) == "" {
				return fmt.Errorf("quote block at position %d text cannot be empty", i)
			}
			if len(b.Text) > 5000 {
				return fmt.Errorf("quote block at position %d exceeds maximum length of 5,000 characters", i)
			}

		case "youtube":
			var b struct {
				VideoID string `json:"videoId"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed youtube block at position %d", i)
			}
			if !youtubeIDRegex.MatchString(strings.TrimSpace(b.VideoID)) {
				return fmt.Errorf("invalid YouTube videoId format '%s' at position %d", b.VideoID, i)
			}

		case "gallery":
			var b struct {
				MediaIDs []string `json:"mediaIds"`
			}
			if err := json.Unmarshal(item, &b); err != nil {
				return fmt.Errorf("malformed gallery block at position %d", i)
			}
			if len(b.MediaIDs) == 0 {
				return fmt.Errorf("gallery block at position %d must contain at least one mediaId", i)
			}
			if len(b.MediaIDs) > 30 {
				return fmt.Errorf("gallery block at position %d exceeds maximum limit of 30 images", i)
			}
			for _, id := range b.MediaIDs {
				if _, err := uuid.Parse(id); err != nil {
					return fmt.Errorf("invalid mediaId '%s' in gallery block at position %d", id, i)
				}
				if !mediaIDMap[id] {
					mediaIDMap[id] = true
					mediaIDsToCheck = append(mediaIDsToCheck, id)
				}
			}

		default:
			return fmt.Errorf("unsupported block type '%s' at position %d", base.Type, i)
		}
	}

	// Verify all referenced media IDs exist in the database (if database pool is provided)
	if db != nil && len(mediaIDsToCheck) > 0 {
		var count int
		err := db.QueryRow(ctx, `SELECT COUNT(*) FROM media WHERE id = ANY($1)`, mediaIDsToCheck).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to verify media references: %w", err)
		}
		if count < len(mediaIDsToCheck) {
			return errors.New("one or more referenced media IDs do not exist in media library")
		}
	}

	return nil
}

// HydrateArticleMedia injects resolved image URLs into blocks referencing media IDs.
func HydrateArticleMedia(ctx context.Context, db *pgxpool.Pool, mediaURLFunc func(key string) string, raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 || string(raw) == "null" || string(raw) == "[]" {
		return raw
	}

	var blockList []map[string]any
	if err := json.Unmarshal(raw, &blockList); err != nil {
		return raw
	}

	// Collect media IDs
	mediaIDSet := make(map[string]bool)
	for _, b := range blockList {
		t, _ := b["type"].(string)
		if t == "image" || t == "split" {
			if mID, ok := b["mediaId"].(string); ok && mID != "" {
				mediaIDSet[mID] = true
			}
		} else if t == "gallery" {
			if mIDs, ok := b["mediaIds"].([]any); ok {
				for _, item := range mIDs {
					if mID, ok := item.(string); ok && mID != "" {
						mediaIDSet[mID] = true
					}
				}
			}
		}
	}

	if len(mediaIDSet) == 0 {
		return raw
	}

	var ids []string
	for id := range mediaIDSet {
		ids = append(ids, id)
	}

	type mediaRec struct {
		ID       string
		URL      string
		ThumbURL string
		Alt      string
		Caption  string
	}

	mediaMap := make(map[string]mediaRec)
	if db != nil {
		rows, err := db.Query(ctx, `SELECT id, COALESCE(medium_key, original_key), COALESCE(thumb_key, medium_key, original_key), alt_text, caption FROM media WHERE id = ANY($1)`, ids)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var id, mainKey, thumbKey, alt, cap string
				if scanErr := rows.Scan(&id, &mainKey, &thumbKey, &alt, &cap); scanErr == nil {
					mediaMap[id] = mediaRec{
						ID:       id,
						URL:      mediaURLFunc(mainKey),
						ThumbURL: mediaURLFunc(thumbKey),
						Alt:      alt,
						Caption:  cap,
					}
				}
			}
		}
	}

	// Hydrate block map
	for i, b := range blockList {
		t, _ := b["type"].(string)
		if t == "image" || t == "split" {
			if mID, ok := b["mediaId"].(string); ok {
				if rec, found := mediaMap[mID]; found {
					blockList[i]["url"] = rec.URL
					blockList[i]["thumb_url"] = rec.ThumbURL
					if _, hasAlt := b["alt"]; !hasAlt || b["alt"] == "" {
						blockList[i]["alt"] = rec.Alt
					}
					if _, hasCap := b["caption"]; !hasCap || b["caption"] == "" {
						blockList[i]["caption"] = rec.Caption
					}
				}
			}
		} else if t == "gallery" {
			if mIDs, ok := b["mediaIds"].([]any); ok {
				var items []map[string]any
				for _, item := range mIDs {
					if mID, ok := item.(string); ok {
						if rec, found := mediaMap[mID]; found {
							items = append(items, map[string]any{
								"id":        rec.ID,
								"url":       rec.URL,
								"thumb_url": rec.ThumbURL,
								"alt":       rec.Alt,
								"caption":   rec.Caption,
							})
						}
					}
				}
				blockList[i]["media"] = items
			}
		}
	}

	hydrated, err := json.Marshal(blockList)
	if err != nil {
		return raw
	}
	return json.RawMessage(hydrated)
}
