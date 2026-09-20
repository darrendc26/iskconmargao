package api

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/models"
)

func (s *Server) publicSettings(c *gin.Context) {
	publicCache(c)
	httpx.OK(c, s.loadSettings(c))
}

func (s *Server) loadSettings(c *gin.Context) models.SiteSettings {
	st := models.DefaultSettings()
	var raw []byte
	err := s.db.QueryRow(c.Request.Context(), `SELECT value FROM site_settings WHERE key='public'`).Scan(&raw)
	if err == nil {
		_ = json.Unmarshal(raw, &st)
	}
	if st.WhatsAppChannelURL == "" {
		st.WhatsAppChannelURL = s.cfg.WhatsAppChannelURL
	}
	if st.WhatsAppContactURL == "" {
		st.WhatsAppContactURL = s.cfg.WhatsAppContactURL
	}
	canonicalMaps := s.cfg.MapsURL
	if canonicalMaps == "" {
		canonicalMaps = "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts"
	}
	if st.MapsURL == "" || (strings.Contains(st.MapsURL, "ISKCON+Margao+Goa") && !strings.Contains(st.MapsURL, "Matchless")) {
		st.MapsURL = canonicalMaps
	}
	if st.InstagramURL == "" {
		st.InstagramURL = "https://www.instagram.com/iskconmargao_goa/"
	}
	if st.YouTubeURL == "" {
		st.YouTubeURL = "https://www.youtube.com/@ISKCONMargao"
	}
	if st.FacebookURL == "" {
		st.FacebookURL = "https://www.facebook.com/servants.of.lord.krishna.backtogodhead/"
	}
	if st.TwitterURL == "" {
		st.TwitterURL = "https://x.com/ISKCON_Margao_"
	}
	return st
}

func (s *Server) homepage(c *gin.Context) {
	ctx := c.Request.Context()
	settings := s.loadSettings(c)

	programs := s.queryPrograms(c, true)
	festivals := s.queryFestivals(c, true, true)
	var featured *models.Festival
	if len(festivals) > 0 {
		featured = &festivals[0]
		for i := range festivals {
			if festivals[i].Featured {
				featured = &festivals[i]
				break
			}
		}
	}
	articles := s.queryArticles(c, true, 4)
	albums := s.queryAlbums(c, true, 6)
	anns := s.queryAnnouncements(c, true)
	purposes := s.queryPurposes(c, true)

	httpx.OK(c, gin.H{
		"hero": gin.H{
			"headline": settings.HeroHeadline,
			"subhead":  settings.HeroSubhead,
			"support":  settings.HeroSupport,
			"eyebrow":  "Weekly gatherings • Kirtan • Krishna Katha • Prasadam • Community",
		},
		"settings":          settings,
		"current_programs":  programs,
		"featured_festival": featured,
		"festivals":         festivals,
		"announcements":     anns,
		"recent_articles":   articles,
		"recent_albums":     albums,
		"seva_options": []gin.H{
			{"slug": "kirtan", "title": "Kirtan Seva"},
			{"slug": "prasadam", "title": "Prasadam Seva"},
			{"slug": "festival", "title": "Festival Seva"},
			{"slug": "photography", "title": "Photography"},
			{"slug": "videography", "title": "Videography"},
			{"slug": "social-media", "title": "Social Media"},
			{"slug": "digital", "title": "Digital Seva"},
			{"slug": "book-distribution", "title": "Book Distribution"},
			{"slug": "outreach", "title": "Outreach"},
		},
		"donation_purposes": purposes,
		"generated_at":      time.Now().UTC(),
	})
	_ = ctx
}

func (s *Server) dashboard(c *gin.Context) {
	ctx := c.Request.Context()
	var programs, festivals, articles, albums, pending, subs, donationsMonth int
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM programs WHERE active=true`).Scan(&programs)
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM festivals WHERE published AND date >= CURRENT_DATE`).Scan(&festivals)
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM articles WHERE status='published'`).Scan(&articles)
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM photo_albums WHERE published`).Scan(&albums)
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM articles WHERE status IN ('draft','pending_review')`).Scan(&pending)
	_ = s.db.QueryRow(ctx, `SELECT COUNT(*) FROM subscribers WHERE unsubscribed_at IS NULL`).Scan(&subs)
	_ = s.db.QueryRow(ctx, `SELECT COALESCE(SUM(amount),0) FROM donations WHERE status='success' AND paid_at >= date_trunc('month', now())`).Scan(&donationsMonth)

	httpx.OK(c, gin.H{
		"counts": gin.H{
			"active_programs":            programs,
			"upcoming_festivals":         festivals,
			"published_articles":         articles,
			"albums":                     albums,
			"pending_content":            pending,
			"subscribers":                subs,
			"donations_this_month_paise": donationsMonth,
		},
		"programs":  s.queryPrograms(c, false),
		"festivals": s.queryFestivals(c, false, false),
		"articles":  s.queryArticles(c, false, 50),
		"albums":    s.queryAlbums(c, false, 50),
	})
}
