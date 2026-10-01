package medialifecycle

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/google/uuid"
	"github.com/iskcongoa/margao/internal/storage"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ExtractMediaIDsFromContent parses article block JSON and collects all referenced media IDs.
func ExtractMediaIDsFromContent(raw json.RawMessage) []string {
	if len(raw) == 0 || string(raw) == "null" || string(raw) == "[]" {
		return nil
	}
	var blockList []map[string]any
	if err := json.Unmarshal(raw, &blockList); err != nil {
		return nil
	}

	seen := make(map[string]bool)
	var result []string

	addID := func(id string) {
		id = strings.TrimSpace(id)
		if id != "" {
			if _, err := uuid.Parse(id); err == nil {
				if !seen[id] {
					seen[id] = true
					result = append(result, id)
				}
			}
		}
	}

	for _, b := range blockList {
		t, _ := b["type"].(string)
		switch t {
		case "image", "split":
			if id, ok := b["mediaId"].(string); ok {
				addID(id)
			}
		case "gallery":
			if ids, ok := b["mediaIds"].([]any); ok {
				for _, v := range ids {
					if idStr, ok := v.(string); ok {
						addID(idStr)
					}
				}
			}
			if imgs, ok := b["images"].([]any); ok {
				for _, img := range imgs {
					if imgObj, ok := img.(map[string]any); ok {
						if idStr, ok := imgObj["mediaId"].(string); ok {
							addID(idStr)
						}
					}
				}
			}
		}
	}
	return result
}

// CountReferences checks database references across all tables and article JSON content for given media IDs.
func CountReferences(ctx context.Context, db *pgxpool.Pool, mediaIDs []string) (map[string]int, error) {
	counts := make(map[string]int)
	if len(mediaIDs) == 0 {
		return counts, nil
	}

	for _, id := range mediaIDs {
		counts[id] = 0
	}

	// 1. Foreign keys: articles (cover_media_id, og_media_id), festivals (cover_media_id), programs (invitation_media_id), photo_albums (cover_media_id), photos (media_id)
	fkQueries := []string{
		`SELECT cover_media_id FROM articles WHERE cover_media_id = ANY($1)`,
		`SELECT og_media_id FROM articles WHERE og_media_id = ANY($1)`,
		`SELECT cover_media_id FROM festivals WHERE cover_media_id = ANY($1)`,
		`SELECT invitation_media_id FROM programs WHERE invitation_media_id = ANY($1)`,
		`SELECT cover_media_id FROM photo_albums WHERE cover_media_id = ANY($1)`,
		`SELECT media_id FROM photos WHERE media_id = ANY($1)`,
	}

	for _, q := range fkQueries {
		rows, err := db.Query(ctx, q, mediaIDs)
		if err != nil {
			return nil, fmt.Errorf("fk query error: %w", err)
		}
		for rows.Next() {
			var id *string
			if err := rows.Scan(&id); err == nil && id != nil {
				counts[*id]++
			}
		}
		rows.Close()
	}

	// 2. Article JSON blocks
	rows, err := db.Query(ctx, `SELECT content FROM articles WHERE content IS NOT NULL AND content::text != '[]'`)
	if err != nil {
		return nil, fmt.Errorf("article content query error: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var contentBytes []byte
		if err := rows.Scan(&contentBytes); err == nil {
			articleMediaIDs := ExtractMediaIDsFromContent(json.RawMessage(contentBytes))
			for _, id := range articleMediaIDs {
				if _, tracked := counts[id]; tracked {
					counts[id]++
				}
			}
		}
	}

	return counts, nil
}

// ReevaluateMediaReferences re-checks reference counts for given Media IDs and updates pending_delete_at.
func ReevaluateMediaReferences(ctx context.Context, db *pgxpool.Pool, mediaIDs []string) error {
	if len(mediaIDs) == 0 {
		return nil
	}

	// Deduplicate mediaIDs
	seen := make(map[string]bool)
	var cleanIDs []string
	for _, id := range mediaIDs {
		id = strings.TrimSpace(id)
		if id != "" && !seen[id] {
			seen[id] = true
			cleanIDs = append(cleanIDs, id)
		}
	}
	if len(cleanIDs) == 0 {
		return nil
	}

	counts, err := CountReferences(ctx, db, cleanIDs)
	if err != nil {
		return fmt.Errorf("failed to count media references: %w", err)
	}

	for id, count := range counts {
		if count > 0 {
			// Media is in use: cancel pending deletion if set
			_, err := db.Exec(ctx, `UPDATE media SET pending_delete_at = NULL WHERE id = $1 AND pending_delete_at IS NOT NULL`, id)
			if err != nil {
				log.Printf("medialifecycle: failed to clear pending_delete_at for %s: %v", id, err)
			}
		} else {
			// Media has 0 references: mark for deletion in 24 hours if not already pending
			tag, err := db.Exec(ctx, `UPDATE media SET pending_delete_at = NOW() + INTERVAL '24 hours' WHERE id = $1 AND pending_delete_at IS NULL AND deleted_at IS NULL`, id)
			if err != nil {
				log.Printf("medialifecycle: failed to set pending_delete_at for %s: %v", id, err)
			} else if tag.RowsAffected() == 0 {
				log.Printf("medialifecycle: 0 rows affected setting pending_delete_at for %s", id)
			}
		}
	}
	return nil
}

// CleanupPendingMedia scans media marked with pending_delete_at <= NOW() and zero references, deleting R2 objects and DB records.
func CleanupPendingMedia(ctx context.Context, db *pgxpool.Pool, store storage.ObjectStorage) (int, error) {
	rows, err := db.Query(ctx, `SELECT id, original_key, webp_key, thumb_key, medium_key, large_key 
		FROM media WHERE pending_delete_at IS NOT NULL AND pending_delete_at <= NOW() AND deleted_at IS NULL`)
	if err != nil {
		return 0, fmt.Errorf("failed to query pending media: %w", err)
	}
	defer rows.Close()

	type mediaItem struct {
		id   string
		keys []string
	}

	var toClean []mediaItem
	for rows.Next() {
		var id string
		var orig, webp, thumb, med, large *string
		if err := rows.Scan(&id, &orig, &webp, &thumb, &med, &large); err == nil {
			var keys []string
			seenKey := make(map[string]bool)
			for _, k := range []*string{orig, webp, thumb, med, large} {
				if k != nil && *k != "" && !seenKey[*k] {
					seenKey[*k] = true
					keys = append(keys, *k)
				}
			}
			toClean = append(toClean, mediaItem{id: id, keys: keys})
		}
	}
	rows.Close()

	if len(toClean) == 0 {
		return 0, nil
	}

	cleanedCount := 0
	for _, item := range toClean {
		// Double-check active references to avoid race conditions
		refCounts, err := CountReferences(ctx, db, []string{item.id})
		if err != nil {
			log.Printf("medialifecycle: failed to verify references for media %s: %v", item.id, err)
			continue
		}
		if refCounts[item.id] > 0 {
			// Restored reference in interval
			_, _ = db.Exec(ctx, `UPDATE media SET pending_delete_at = NULL WHERE id = $1`, item.id)
			continue
		}

		// Delete R2 objects
		deletionFailed := false
		for _, key := range item.keys {
			if err := store.Delete(ctx, key); err != nil {
				log.Printf("medialifecycle: failed to delete key %s from store for media %s: %v", key, item.id, err)
				deletionFailed = true
			}
		}

		if !deletionFailed {
			// Delete DB record
			if _, err := db.Exec(ctx, `DELETE FROM media WHERE id = $1`, item.id); err != nil {
				log.Printf("medialifecycle: failed to delete media row %s: %v", item.id, err)
			} else {
				cleanedCount++
			}
		}
	}

	return cleanedCount, nil
}
