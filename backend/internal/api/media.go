package api

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/imagingx"
	"github.com/iskcongoa/margao/internal/middleware"
)

func (s *Server) uploadMedia(c *gin.Context) {
	file, hdr, err := c.Request.FormFile("file")
	if err != nil {
		httpx.BadRequest(c, "Please choose a photo to upload.")
		return
	}
	defer file.Close()
	if hdr.Size > imagingx.MaxUploadBytes {
		httpx.BadRequest(c, "That photo is too large. Please use a file under 15 MB.")
		return
	}
	ct := hdr.Header.Get("Content-Type")
	folder := c.DefaultPostForm("folder", "general")
	folder = middleware.SanitizeFilename(folder)
	if folder == "" {
		folder = "general"
	}
	albumID := c.PostForm("album_id")
	alt := c.PostForm("alt_text")
	caption := c.PostForm("caption")

	res, err := imagingx.Process(file, ct)
	if err != nil {
		httpx.BadRequest(c, "We could not read that image. Please try a JPEG, PNG, or WebP.")
		return
	}
	id := uuid.NewString()
	base := fmt.Sprintf("media/%s/%s/%s", folder, time.Now().Format("2006/01"), id)

	origKey := base + "/" + res.OriginalKeySuffix
	thumbKey := base + "/" + res.ThumbKeySuffix

	ctx := c.Request.Context()
	uploads := []struct {
		key string
		b   []byte
	}{
		{origKey, res.OriginalBytes},
	}
	if len(res.ThumbBytes) > 0 {
		uploads = append(uploads, struct {
			key string
			b   []byte
		}{thumbKey, res.ThumbBytes})
	}

	for _, u := range uploads {
		if err := s.store.Upload(ctx, u.key, bytes.NewReader(u.b), res.MIME); err != nil {
			httpx.Server(c, "Could not store the image. Please try again.")
			return
		}
	}

	uid := s.currentUser(c).ID
	var mediaID string
	// medium_key and webp_key map to origKey for database query compatibility without extra file creation
	err = s.db.QueryRow(ctx, `INSERT INTO media (kind, original_key, webp_key, thumb_key, medium_key, large_key, mime_type, bytes, width, height, alt_text, caption, folder, uploaded_by)
		VALUES ('image',$1,$2,$3,$4,NULL,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
		origKey, origKey, thumbKey, origKey, res.MIME, len(res.OriginalBytes), res.Width, res.Height, alt, caption, folder, uid).Scan(&mediaID)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	if albumID != "" {
		_, _ = s.db.Exec(ctx, `INSERT INTO photos (album_id, media_id, alt_text, caption, sort_order)
			SELECT $1, $2, $3, $4, COALESCE(MAX(sort_order),0)+1 FROM photos WHERE album_id=$1`, albumID, mediaID, alt, caption)
		_, _ = s.db.Exec(ctx, `UPDATE photo_albums SET cover_media_id=COALESCE(cover_media_id,$2) WHERE id=$1`, albumID, mediaID)
	}
	httpx.Created(c, gin.H{
		"id":        mediaID,
		"url":       s.mediaURL(origKey),
		"thumb_url": s.mediaURL(thumbKey),
		"width":     res.Width,
		"height":    res.Height,
	})
}

func (s *Server) deleteMedia(c *gin.Context) {
	id := c.Param("id")
	var orig, webp, thumb, med, large *string
	err := s.db.QueryRow(c.Request.Context(), `SELECT original_key, webp_key, thumb_key, medium_key, large_key FROM media WHERE id=$1`, id).
		Scan(&orig, &webp, &thumb, &med, &large)
	if err != nil {
		httpx.NotFound(c, "Media not found.")
		return
	}

	// Collect unique non-empty keys to delete from R2 / local store
	deletedKeys := make(map[string]bool)
	for _, k := range []*string{orig, webp, thumb, med, large} {
		if k != nil && *k != "" && !deletedKeys[*k] {
			deletedKeys[*k] = true
			_ = s.store.Delete(c.Request.Context(), *k)
		}
	}
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM media WHERE id=$1`, id)
	s.audit(c.Request.Context(), s.currentUser(c).ID, "MEDIA_DELETED", "media", id, nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) serveLocalMedia(c *gin.Context) {
	key := strings.TrimPrefix(c.Param("key"), "/")
	key = strings.TrimPrefix(key, "media/")
	if strings.Contains(key, "..") {
		httpx.NotFound(c, "")
		return
	}
	rc, err := s.store.Get(c.Request.Context(), key)
	if err != nil {
		rc, err = s.store.Get(c.Request.Context(), "media/"+key)
	}
	if err != nil {
		httpx.NotFound(c, "")
		return
	}
	defer rc.Close()
	ext := strings.ToLower(path.Ext(key))
	ct := "image/jpeg"
	if ext == ".webp" {
		ct = "image/webp"
	} else if ext == ".png" {
		ct = "image/png"
	} else if ext == ".gif" {
		ct = "image/gif"
	}
	c.Header("Content-Type", ct)
	c.Header("Cache-Control", "public, max-age=86400")
	c.Status(http.StatusOK)
	_, _ = io.Copy(c.Writer, rc)
}
