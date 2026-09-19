package api

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/emailer"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/middleware"
	"github.com/iskcongoa/margao/internal/models"
	"github.com/iskcongoa/margao/internal/payments"
	"github.com/iskcongoa/margao/internal/slugify"
	"github.com/iskcongoa/margao/internal/storage"
	"github.com/iskcongoa/margao/internal/repository"
	"github.com/iskcongoa/margao/internal/service"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const cookieName = "ism_session"

type Server struct {
	cfg      config.Config
	db       *pgxpool.Pool
	repo     *repository.Repository
	svc      *service.Service
	store    storage.ObjectStorage
	mail     emailer.Service
	pay      payments.PaymentGateway
	localMed bool
}

func New(cfg config.Config, db *pgxpool.Pool, store storage.ObjectStorage, mail emailer.Service, pay payments.PaymentGateway) *Server {
	repo := repository.New(db)
	svc := service.New(repo, cfg, store, mail, pay)
	return &Server{cfg: cfg, db: db, repo: repo, svc: svc, store: store, mail: mail, pay: pay, localMed: cfg.R2.AccessKeyID == ""}
}

func (s *Server) Router() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.CORS(s.cfg.CORSOrigins))
	r.Use(middleware.BodyLimit(20 << 20))
	r.MaxMultipartMemory = 20 << 20

	r.GET("/health", s.health)
	if s.localMed {
		r.GET("/media/*key", s.serveLocalMedia)
	}

	v1 := r.Group("/api/v1")
	v1.GET("/health", s.health)
	v1.GET("/homepage", cacheMiddleware("homepage", 5*time.Second), s.homepage)
	v1.GET("/programs", cacheMiddleware("programs", 5*time.Second), s.listProgramsPublic)
	v1.GET("/programs/upcoming", cacheMiddleware("programs", 5*time.Second), s.listProgramsPublic)
	v1.GET("/programs/:slug", s.getProgramPublic)
	v1.GET("/festivals", cacheMiddleware("festivals", 5*time.Second), s.listFestivalsPublic)
	v1.GET("/festivals/:slug", s.getFestivalPublic)
	v1.GET("/articles", cacheMiddleware("articles", 5*time.Second), s.listArticlesPublic)
	v1.GET("/articles/:slug", s.getArticlePublic)
	v1.GET("/albums", cacheMiddleware("albums", 5*time.Second), s.listAlbumsPublic)
	v1.GET("/albums/:slug", s.getAlbumPublic)
	v1.GET("/videos", cacheMiddleware("videos", 5*time.Second), s.listVideosPublic)
	v1.GET("/announcements", cacheMiddleware("announcements", 5*time.Second), s.listAnnouncementsPublic)
	v1.GET("/settings/public", cacheMiddleware("settings", 5*time.Second), s.publicSettings)
	v1.GET("/donate/purposes", cacheMiddleware("purposes", 5*time.Second), s.listPurposesPublic)
	v1.GET("/donate/purposes/:slug", s.getPurposePublic)
	v1.GET("/sitemap", cacheMiddleware("sitemap", 30*time.Second), s.sitemapJSON)
	v1.POST("/contact", middleware.ContactRateLimit(s.cfg.ContactRatePerHour), s.createContact)
	v1.POST("/volunteer", middleware.ContactRateLimit(s.cfg.ContactRatePerHour), s.createVolunteer)
	v1.POST("/subscribers", middleware.ContactRateLimit(s.cfg.ContactRatePerHour), s.createSubscriber)
	v1.POST("/analytics/events", s.trackEvent)
	v1.POST("/donations/create", s.createDonation)
	v1.GET("/donations/:id", s.getDonationPublic)
	v1.POST("/webhooks/payment", s.paymentWebhook)

	admin := v1.Group("/admin")
	admin.POST("/auth/login", middleware.LoginRateLimit(s.cfg.LoginRatePer15m), s.login)
	admin.POST("/auth/logout", s.logout)

	authed := admin.Group("")
	authed.Use(s.requireAuth())
	authed.Use(middleware.OriginCheck(s.cfg.CORSOrigins))
	authed.GET("/me", s.me)
	authed.GET("/dashboard", s.dashboard)

	authed.GET("/programs", s.adminListPrograms)
	authed.POST("/programs", s.requireRole("admin", "editor"), s.adminCreateProgram)
	authed.PUT("/programs/:id", s.requireRole("admin", "editor"), s.adminUpdateProgram)
	authed.DELETE("/programs/:id", s.requireRole("admin", "editor"), s.adminDeleteProgram)

	authed.GET("/festivals", s.adminListFestivals)
	authed.POST("/festivals", s.requireRole("admin", "editor"), s.adminCreateFestival)
	authed.PUT("/festivals/:id", s.requireRole("admin", "editor"), s.adminUpdateFestival)
	authed.DELETE("/festivals/:id", s.requireRole("admin", "editor"), s.adminDeleteFestival)

	authed.GET("/articles", s.adminListArticles)
	authed.POST("/articles", s.adminCreateArticle)
	authed.PUT("/articles/:id", s.adminUpdateArticle)
	authed.DELETE("/articles/:id", s.requireRole("admin", "editor"), s.adminDeleteArticle)
	authed.POST("/articles/:id/publish", s.requireRole("admin", "editor"), s.adminPublishArticle)
	authed.POST("/articles/:id/unpublish", s.requireRole("admin", "editor"), s.adminUnpublishArticle)

	authed.GET("/albums", s.adminListAlbums)
	authed.POST("/albums", s.adminCreateAlbum)
	authed.PUT("/albums/:id", s.adminUpdateAlbum)
	authed.DELETE("/albums/:id", s.requireRole("admin", "editor"), s.adminDeleteAlbum)
	authed.PUT("/albums/:id/photos", s.adminReorderPhotos)
	authed.DELETE("/albums/:id/photos/:photoId", s.adminDeletePhoto)

	authed.POST("/media/upload", s.uploadMedia)
	authed.DELETE("/media/:id", s.requireRole("admin", "editor"), s.deleteMedia)

	authed.GET("/videos", s.adminListVideos)
	authed.POST("/videos", s.requireRole("admin", "editor"), s.adminCreateVideo)
	authed.PUT("/videos/:id", s.requireRole("admin", "editor"), s.adminUpdateVideo)
	authed.DELETE("/videos/:id", s.requireRole("admin", "editor"), s.adminDeleteVideo)

	authed.GET("/announcements", s.adminListAnnouncements)
	authed.POST("/announcements", s.requireRole("admin", "editor"), s.adminCreateAnnouncement)
	authed.PUT("/announcements/:id", s.requireRole("admin", "editor"), s.adminUpdateAnnouncement)
	authed.DELETE("/announcements/:id", s.requireRole("admin", "editor"), s.adminDeleteAnnouncement)

	authed.GET("/volunteers", s.requireRole("admin", "editor"), s.adminListVolunteers)
	authed.PUT("/volunteers/:id", s.requireRole("admin", "editor"), s.adminUpdateVolunteer)
	authed.GET("/contacts", s.requireRole("admin", "editor"), s.adminListContacts)
	authed.PUT("/contacts/:id", s.requireRole("admin", "editor"), s.adminUpdateContact)
	authed.GET("/subscribers", s.requireRole("admin", "editor"), s.adminListSubscribers)
	authed.PUT("/subscribers/:id", s.requireRole("admin"), s.adminUpdateSubscriber)
	authed.DELETE("/subscribers/:id", s.requireRole("admin"), s.adminDeleteSubscriber)

	authed.GET("/donations", s.requireRole("admin"), s.adminListDonations)
	authed.GET("/donations/export", s.requireRole("admin"), s.adminExportDonations)
	authed.GET("/donation-purposes", s.requireRole("admin", "editor"), s.adminListPurposes)
	authed.POST("/donation-purposes", s.requireRole("admin"), s.adminCreatePurpose)
	authed.PUT("/donation-purposes/:id", s.requireRole("admin"), s.adminUpdatePurpose)

	authed.GET("/settings", s.requireRole("admin", "editor"), s.adminGetSettings)
	authed.PUT("/settings", s.requireRole("admin"), s.adminPutSettings)

	authed.GET("/users", s.requireRole("admin"), s.adminListUsers)
	authed.POST("/users", s.requireRole("admin"), s.adminCreateUser)
	authed.PUT("/users/:id", s.requireRole("admin"), s.adminUpdateUser)
	authed.DELETE("/users/:id", s.requireRole("admin"), s.adminDeleteUser)

	authed.GET("/audit-logs", s.requireRole("admin"), s.adminAuditLogs)
	return r
}

func (s *Server) health(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()
	dbOK := s.db.Ping(ctx) == nil
	status := http.StatusOK
	if !dbOK {
		status = http.StatusServiceUnavailable
	}
	c.JSON(status, gin.H{
		"success": dbOK,
		"data": gin.H{
			"status":   map[bool]string{true: "ok", false: "degraded"}[dbOK],
			"database": dbOK,
			"time":     time.Now().In(time.FixedZone("IST", 19800)).Format(time.RFC3339),
		},
	})
}

func (s *Server) mediaURL(key string) string {
	if key == "" {
		return ""
	}
	cleanKey := strings.TrimPrefix(key, "/")
	u := s.store.GetURL(cleanKey)
	if u != "" {
		return u
	}
	return s.cfg.PublicAPIURL + "/" + cleanKey
}

func (s *Server) uniqueSlug(ctx context.Context, table, slug, excludeID string) (string, error) {
	base := slugify.Slug(slug)
	candidate := base
	for i := 0; i < 50; i++ {
		q := fmt.Sprintf(`SELECT COUNT(*) FROM %s WHERE slug=$1`, table)
		args := []any{candidate}
		if excludeID != "" {
			q += ` AND id <> $2`
			args = append(args, excludeID)
		}
		var n int
		if err := s.db.QueryRow(ctx, q, args...).Scan(&n); err != nil {
			return "", err
		}
		if n == 0 {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%d", base, i+2)
	}
	return base + "-" + uuid.NewString()[:8], nil
}

func (s *Server) audit(ctx context.Context, userID, action, entity, entityID string, meta any) {
	b, _ := json.Marshal(meta)
	_, _ = s.db.Exec(ctx, `INSERT INTO audit_logs (user_id, action, entity, entity_id, metadata) VALUES ($1,$2,$3,$4,$5)`,
		nullUUID(userID), action, entity, entityID, b)
}

func nullUUID(id string) any {
	if id == "" {
		return nil
	}
	return id
}

func (s *Server) currentUser(c *gin.Context) models.User {
	v, _ := c.Get("user")
	u, _ := v.(models.User)
	return u
}

func roleOK(have string, want ...string) bool {
	for _, w := range want {
		if have == w {
			return true
		}
	}
	return false
}

func (s *Server) requireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		u := s.currentUser(c)
		if u.Role == "admin" || roleOK(u.Role, roles...) {
			c.Next()
			return
		}
		httpx.Forbidden(c)
		c.Abort()
	}
}

func randomToken() (raw, hash string, err error) {
	b := make([]byte, 32)
	if _, err = rand.Read(b); err != nil {
		return "", "", err
	}
	raw = hex.EncodeToString(b)
	sum := sha256.Sum256([]byte(raw))
	return raw, hex.EncodeToString(sum[:]), nil
}

func hashToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}

func scanJSON[T any](src []byte, dest *T) {
	if len(src) == 0 {
		return
	}
	_ = json.Unmarshal(src, dest)
}

func bindJSON(c *gin.Context, dest any) bool {
	if err := c.ShouldBindJSON(dest); err != nil {
		httpx.BadRequest(c, "Please check the form and try again.")
		return false
	}
	return true
}

func isNoRows(err error) bool { return errors.Is(err, pgx.ErrNoRows) }

func publicCache(c *gin.Context) {
	c.Header("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
}

func strPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func trim(s string) string { return strings.TrimSpace(s) }
