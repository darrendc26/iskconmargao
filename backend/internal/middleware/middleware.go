package middleware

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
	"golang.org/x/time/rate"
)

func originAllowed(origin string, set map[string]bool) bool {
	if origin == "" {
		return false
	}
	if set[origin] {
		return true
	}
	return isDevBrowserOrigin(origin)
}

func isDevBrowserOrigin(origin string) bool {
	u := origin
	if strings.HasPrefix(u, "http://") {
		u = strings.TrimPrefix(u, "http://")
	} else if strings.HasPrefix(u, "https://") {
		u = strings.TrimPrefix(u, "https://")
	} else {
		return false
	}
	host, _, err := net.SplitHostPort(u)
	if err != nil {
		host = u
	}
	if host == "localhost" || host == "127.0.0.1" || host == "::1" {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && (ip.IsPrivate() || ip.IsLoopback())
}

func CORS(origins []string) gin.HandlerFunc {
	set := map[string]bool{}
	for _, o := range origins {
		set[o] = true
	}
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if originAllowed(origin, set) {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "SAMEORIGIN")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

func BodyLimit(n int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, n)
		c.Next()
	}
}

type limiter struct {
	mu   sync.Mutex
	book map[string]*rate.Limiter
	r    rate.Limit
	b    int
}

func newLimiter(r rate.Limit, b int) *limiter {
	return &limiter{book: map[string]*rate.Limiter{}, r: r, b: b}
}

func (l *limiter) allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	lim, ok := l.book[key]
	if !ok {
		lim = rate.NewLimiter(l.r, l.b)
		l.book[key] = lim
	}
	return lim.Allow()
}

func RateLimit(perMinute int) gin.HandlerFunc {
	lim := newLimiter(rate.Limit(float64(perMinute)/60.0), perMinute)
	return func(c *gin.Context) {
		ip := clientIP(c)
		if !lim.allow(ip) {
			httpx.TooMany(c)
			c.Abort()
			return
		}
		c.Next()
	}
}

func LoginRateLimit(per15m int) gin.HandlerFunc {
	lim := newLimiter(rate.Every(15*time.Minute/time.Duration(per15m)), per15m)
	return func(c *gin.Context) {
		if !lim.allow(clientIP(c) + c.ClientIP()) {
			httpx.TooMany(c)
			c.Abort()
			return
		}
		c.Next()
	}
}

func ContactRateLimit(perHour int) gin.HandlerFunc {
	lim := newLimiter(rate.Every(time.Hour/time.Duration(max(perHour, 1))), perHour)
	return func(c *gin.Context) {
		if !lim.allow("c:" + clientIP(c)) {
			httpx.TooMany(c)
			c.Abort()
			return
		}
		c.Next()
	}
}

func clientIP(c *gin.Context) string {
	xff := c.GetHeader("CF-Connecting-IP")
	if xff != "" {
		return xff
	}
	ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
	if err != nil {
		return c.ClientIP()
	}
	return ip
}

func OriginCheck(allowed []string) gin.HandlerFunc {
	set := map[string]bool{}
	for _, o := range allowed {
		set[o] = true
	}
	return func(c *gin.Context) {
		if c.Request.Method == http.MethodGet || c.Request.Method == http.MethodHead || c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}
		origin := c.GetHeader("Origin")
		if origin == "" {
			c.Next()
			return
		}
		if !originAllowed(origin, set) {
			httpx.Forbidden(c)
			c.Abort()
			return
		}
		c.Next()
	}
}

func SanitizeFilename(name string) string {
	name = strings.ToLower(name)
	name = strings.ReplaceAll(name, "..", "")
	var b strings.Builder
	for _, r := range name {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == '_' || r == '.' {
			b.WriteRune(r)
		}
	}
	s := b.String()
	if s == "" {
		return "upload.bin"
	}
	return s
}
