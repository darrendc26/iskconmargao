package api

import (
	"bytes"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type cacheEntry struct {
	body      []byte
	expiresAt time.Time
}

var (
	cacheMu  sync.RWMutex
	cacheMap = make(map[string]cacheEntry)
)

func getCachedResponse(key string) ([]byte, bool) {
	cacheMu.RLock()
	defer cacheMu.RUnlock()
	item, found := cacheMap[key]
	if !found || time.Now().After(item.expiresAt) {
		return nil, false
	}
	return item.body, true
}

func setCachedResponse(key string, body []byte, ttl time.Duration) {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	cacheMap[key] = cacheEntry{
		body:      body,
		expiresAt: time.Now().Add(ttl),
	}
}

func invalidateCache() {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	cacheMap = make(map[string]cacheEntry)
}

type responseWriterRecorder struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w *responseWriterRecorder) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func cacheMiddleware(key string, ttl time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method != http.MethodGet {
			c.Next()
			return
		}
		if data, ok := getCachedResponse(key); ok {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.Header("Cache-Control", "public, max-age=5, stale-while-revalidate=30")
			c.Data(http.StatusOK, "application/json; charset=utf-8", data)
			c.Abort()
			return
		}
		rec := &responseWriterRecorder{ResponseWriter: c.Writer, body: bytes.NewBuffer(nil)}
		c.Writer = rec
		c.Next()
		if c.Writer.Status() == http.StatusOK && rec.body.Len() > 0 {
			setCachedResponse(key, rec.body.Bytes(), ttl)
		}
	}
}
