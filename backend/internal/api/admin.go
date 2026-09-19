package api

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/models"
	"github.com/iskcongoa/margao/internal/password"
	"github.com/iskcongoa/margao/internal/slugify"
)

func (s *Server) adminListPrograms(c *gin.Context) { httpx.OK(c, s.queryPrograms(c, false)) }

type programIn struct {
	Title        string `json:"title"`
	Slug         string `json:"slug"`
	Description  string `json:"description"`
	DayOfWeek    *int   `json:"day_of_week"`
	StartTime    *string `json:"start_time"`
	EndTime      *string `json:"end_time"`
	Location     string `json:"location"`
	ProgramItems []any  `json:"program_items"`
	Active       *bool  `json:"active"`
	Featured     *bool  `json:"featured"`
	IsSpecial    *bool  `json:"is_special"`
	OccursOn     *string `json:"occurs_on"`
	InvitationMediaID *string `json:"invitation_media_id"`
	SortOrder         *int    `json:"sort_order"`
}

func normalizeProgramDate(s *string) *string {
	if s == nil {
		return nil
	}
	v := strings.TrimSpace(*s)
	if v == "" {
		return nil
	}
	for _, layout := range []string{"2006-01-02", "02/01/2006", "2/1/2006", "02-01-2006"} {
		if t, err := time.Parse(layout, v); err == nil {
			out := t.Format("2006-01-02")
			return &out
		}
	}
	return s
}

func (s *Server) adminCreateProgram(c *gin.Context) {
	var in programIn
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Title) == "" {
		httpx.BadRequest(c, "Title is required.")
		return
	}
	slug, err := s.uniqueSlug(c.Request.Context(), "programs", firstNonEmpty(in.Slug, in.Title), "")
	if err != nil {
		httpx.Server(c, "")
		return
	}
	items, _ := json.Marshal(in.ProgramItems)
	if in.ProgramItems == nil {
		items = []byte("[]")
	}
	active, featured, special, order := true, false, false, 0
	if in.Active != nil {
		active = *in.Active
	}
	if in.Featured != nil {
		featured = *in.Featured
	}
	if in.IsSpecial != nil {
		special = *in.IsSpecial
	}
	if in.SortOrder != nil {
		order = *in.SortOrder
	}
	occurs := normalizeProgramDate(in.OccursOn)
	if occurs != nil {
		special = true
		in.DayOfWeek = nil
	}
	var id string
	err = s.db.QueryRow(c.Request.Context(), `INSERT INTO programs (title, slug, description, day_of_week, start_time, end_time, location, program_items, active, featured, is_special, occurs_on, invitation_media_id, sort_order)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
		in.Title, slug, in.Description, in.DayOfWeek, in.StartTime, in.EndTime, defaultLoc(in.Location), items, active, featured, special, occurs, in.InvitationMediaID, order).Scan(&id)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "PROGRAM_CREATED", "programs", id, in.Title)
	httpx.Created(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminUpdateProgram(c *gin.Context) {
	var in programIn
	if !bindJSON(c, &in) {
		return
	}
	id := c.Param("id")
	slug := slugify.Slug(firstNonEmpty(in.Slug, in.Title))
	slug, _ = s.uniqueSlug(c.Request.Context(), "programs", slug, id)
	items, _ := json.Marshal(in.ProgramItems)
	if in.ProgramItems == nil {
		items = []byte("[]")
	}
	occurs := normalizeProgramDate(in.OccursOn)
	if occurs != nil {
		special := true
		in.IsSpecial = &special
		in.DayOfWeek = nil
	}
	_, err := s.db.Exec(c.Request.Context(), `UPDATE programs SET title=$2, slug=$3, description=$4, day_of_week=$5, start_time=$6, end_time=$7, location=$8, program_items=$9,
		active=COALESCE($10,active), featured=COALESCE($11,featured), is_special=COALESCE($12,is_special), occurs_on=$13, invitation_media_id=$14, sort_order=COALESCE($15,sort_order), updated_at=now() WHERE id=$1`,
		id, in.Title, slug, in.Description, in.DayOfWeek, in.StartTime, in.EndTime, defaultLoc(in.Location), items, in.Active, in.Featured, in.IsSpecial, occurs, in.InvitationMediaID, in.SortOrder)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "PROGRAM_UPDATED", "programs", id, nil)
	httpx.OK(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminDeleteProgram(c *gin.Context) {
	tag, err := s.db.Exec(c.Request.Context(), `DELETE FROM programs WHERE id=$1`, c.Param("id"))
	if err != nil {
		httpx.Server(c, "")
		return
	}
	if tag.RowsAffected() == 0 {
		httpx.NotFound(c, "Program not found.")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "PROGRAM_DELETED", "programs", c.Param("id"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

type festivalIn struct {
	Title           string  `json:"title"`
	Slug            string  `json:"slug"`
	Date            string  `json:"date"`
	StartTime       *string `json:"start_time"`
	EndTime         *string `json:"end_time"`
	Description     string  `json:"description"`
	Program         string  `json:"program"`
	Location        string  `json:"location"`
	CoverMediaID    *string `json:"cover_media_id"`
	Featured        *bool   `json:"featured"`
	Published       *bool   `json:"published"`
	RegistrationURL *string `json:"registration_url"`
	ShareText       string  `json:"share_text"`
	AdditionalInfo  string  `json:"additional_info"`
}

func (s *Server) adminListFestivals(c *gin.Context) {
	httpx.OK(c, s.queryFestivals(c, false, false))
}

func (s *Server) adminCreateFestival(c *gin.Context) {
	var in festivalIn
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Title) == "" || trim(in.Date) == "" {
		httpx.BadRequest(c, "Title and date are required.")
		return
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "festivals", firstNonEmpty(in.Slug, in.Title+" "+in.Date[:4]), "")
	pub, feat := false, false
	if in.Published != nil {
		pub = *in.Published
	}
	if in.Featured != nil {
		feat = *in.Featured
	}
	var id string
	err := s.db.QueryRow(c.Request.Context(), `INSERT INTO festivals (title, slug, date, start_time, end_time, description, program, location, cover_media_id, featured, published, registration_url, share_text, additional_info)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
		in.Title, slug, in.Date, in.StartTime, in.EndTime, in.Description, in.Program, defaultLoc(in.Location), in.CoverMediaID, feat, pub, in.RegistrationURL, in.ShareText, in.AdditionalInfo).Scan(&id)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "FESTIVAL_CREATED", "festivals", id, in.Title)
	httpx.Created(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminUpdateFestival(c *gin.Context) {
	var in festivalIn
	if !bindJSON(c, &in) {
		return
	}
	id := c.Param("id")
	var old string
	_ = s.db.QueryRow(c.Request.Context(), `SELECT slug FROM festivals WHERE id=$1`, id).Scan(&old)
	slug, _ := s.uniqueSlug(c.Request.Context(), "festivals", firstNonEmpty(in.Slug, in.Title), id)
	if old != "" && old != slug {
		_, _ = s.db.Exec(c.Request.Context(), `INSERT INTO slug_redirects (entity_type, old_slug, new_slug) VALUES ('festival',$1,$2)
			ON CONFLICT (entity_type, old_slug) DO UPDATE SET new_slug=EXCLUDED.new_slug`, old, slug)
	}
	_, err := s.db.Exec(c.Request.Context(), `UPDATE festivals SET title=$2, slug=$3, date=$4, start_time=$5, end_time=$6, description=$7, program=$8, location=$9,
		cover_media_id=$10, featured=COALESCE($11,featured), published=COALESCE($12,published), registration_url=$13, share_text=$14, additional_info=$15, updated_at=now() WHERE id=$1`,
		id, in.Title, slug, in.Date, in.StartTime, in.EndTime, in.Description, in.Program, defaultLoc(in.Location), in.CoverMediaID, in.Featured, in.Published, in.RegistrationURL, in.ShareText, in.AdditionalInfo)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "FESTIVAL_UPDATED", "festivals", id, nil)
	httpx.OK(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminDeleteFestival(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM festivals WHERE id=$1`, c.Param("id"))
	s.audit(c.Request.Context(), s.currentUser(c).ID, "FESTIVAL_DELETED", "festivals", c.Param("id"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

type articleIn struct {
	Title             string  `json:"title"`
	Slug              string  `json:"slug"`
	Excerpt           string  `json:"excerpt"`
	Content           string  `json:"content"`
	CoverMediaID      *string `json:"cover_media_id"`
	CategorySlug      string  `json:"category"`
	AuthorName        string  `json:"author"`
	Status            string  `json:"status"`
	SEOTitle          string  `json:"seo_title"`
	SEODescription    string  `json:"seo_description"`
	RelatedFestivalID *string `json:"related_festival_id"`
}

func (s *Server) adminListArticles(c *gin.Context) { httpx.OK(c, s.queryArticles(c, false, 0)) }

func (s *Server) adminCreateArticle(c *gin.Context) {
	var in articleIn
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Title) == "" {
		httpx.BadRequest(c, "Title is required.")
		return
	}
	u := s.currentUser(c)
	status := "draft"
	if in.Status == "pending_review" {
		status = "pending_review"
	}
	if (u.Role == "admin" || u.Role == "editor") && in.Status == "published" {
		status = "published"
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "articles", firstNonEmpty(in.Slug, in.Title), "")
	var catID *string
	if trim(in.CategorySlug) != "" {
		catSlug := slugify.Slug(in.CategorySlug)
		var id string
		if err := s.db.QueryRow(c.Request.Context(), `SELECT id FROM article_categories WHERE slug=$1 OR name ILIKE $1`, catSlug).Scan(&id); err == nil {
			catID = &id
		} else {
			catName := strings.Title(strings.ReplaceAll(catSlug, "-", " "))
			if err := s.db.QueryRow(c.Request.Context(), `INSERT INTO article_categories (name, slug, sort_order) VALUES ($1, $2, 99) ON CONFLICT (slug) DO UPDATE SET slug=EXCLUDED.slug RETURNING id`, catName, catSlug).Scan(&id); err == nil {
				catID = &id
			}
		}
	}
	author := firstNonEmpty(in.AuthorName, u.Name)
	var id string
	q := `INSERT INTO articles (title, slug, excerpt, content, cover_media_id, category_id, author_id, author_name, status, published_at, seo_title, seo_description, related_festival_id)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::article_status, CASE WHEN $9='published' THEN now() ELSE NULL END, $10,$11,$12) RETURNING id`
	err := s.db.QueryRow(c.Request.Context(), q, in.Title, slug, in.Excerpt, in.Content, in.CoverMediaID, catID, u.ID, author, status, in.SEOTitle, in.SEODescription, in.RelatedFestivalID).Scan(&id)
	if err != nil {
		httpx.BadRequest(c, "Failed to save article: "+err.Error())
		return
	}
	s.audit(c.Request.Context(), u.ID, "ARTICLE_CREATED", "articles", id, in.Title)
	httpx.Created(c, gin.H{"id": id, "slug": slug, "status": status})
}

func (s *Server) adminUpdateArticle(c *gin.Context) {
	var in articleIn
	if !bindJSON(c, &in) {
		return
	}
	id := c.Param("id")
	u := s.currentUser(c)
	var oldSlug, curStatus string
	_ = s.db.QueryRow(c.Request.Context(), `SELECT slug, status::text FROM articles WHERE id=$1`, id).Scan(&oldSlug, &curStatus)
	if u.Role == "contributor" && curStatus == "published" {
		httpx.Forbidden(c)
		return
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "articles", firstNonEmpty(in.Slug, in.Title), id)
	if oldSlug != "" && oldSlug != slug {
		_, _ = s.db.Exec(c.Request.Context(), `INSERT INTO slug_redirects (entity_type, old_slug, new_slug) VALUES ('article',$1,$2)
			ON CONFLICT (entity_type, old_slug) DO UPDATE SET new_slug=EXCLUDED.new_slug`, oldSlug, slug)
	}
	status := curStatus
	if in.Status != "" && u.Role != "contributor" {
		status = in.Status
	}
	if u.Role == "contributor" {
		status = "draft"
		if in.Status == "pending_review" {
			status = "pending_review"
		}
	}
	var catID *string
	if trim(in.CategorySlug) != "" {
		catSlug := slugify.Slug(in.CategorySlug)
		var cid string
		if err := s.db.QueryRow(c.Request.Context(), `SELECT id FROM article_categories WHERE slug=$1 OR name ILIKE $1`, catSlug).Scan(&cid); err == nil {
			catID = &cid
		} else {
			catName := strings.Title(strings.ReplaceAll(catSlug, "-", " "))
			if err := s.db.QueryRow(c.Request.Context(), `INSERT INTO article_categories (name, slug, sort_order) VALUES ($1, $2, 99) ON CONFLICT (slug) DO UPDATE SET slug=EXCLUDED.slug RETURNING id`, catName, catSlug).Scan(&cid); err == nil {
				catID = &cid
			}
		}
	}
	_, err := s.db.Exec(c.Request.Context(), `UPDATE articles SET title=$2, slug=$3, excerpt=$4, content=$5, cover_media_id=$6, category_id=$7, author_name=$8, status=$9::article_status,
		seo_title=$10, seo_description=$11, related_festival_id=$12, updated_at=now() WHERE id=$1`,
		id, in.Title, slug, in.Excerpt, in.Content, in.CoverMediaID, catID, firstNonEmpty(in.AuthorName, u.Name), status, in.SEOTitle, in.SEODescription, in.RelatedFestivalID)
	if err != nil {
		httpx.BadRequest(c, "Failed to update article: "+err.Error())
		return
	}
	s.audit(c.Request.Context(), u.ID, "ARTICLE_UPDATED", "articles", id, nil)
	httpx.OK(c, gin.H{"id": id, "slug": slug, "status": status})
}

func (s *Server) adminDeleteArticle(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM articles WHERE id=$1`, c.Param("id"))
	s.audit(c.Request.Context(), s.currentUser(c).ID, "ARTICLE_DELETED", "articles", c.Param("id"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminPublishArticle(c *gin.Context) {
	id := c.Param("id")
	_, err := s.db.Exec(c.Request.Context(), `UPDATE articles SET status='published'::article_status, published_at=COALESCE(published_at, now()), updated_at=now() WHERE id=$1`, id)
	if err != nil {
		httpx.BadRequest(c, "Failed to publish article: "+err.Error())
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "ARTICLE_PUBLISHED", "articles", id, nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminUnpublishArticle(c *gin.Context) {
	id := c.Param("id")
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE articles SET status='draft'::article_status, updated_at=now() WHERE id=$1`, id)
	s.audit(c.Request.Context(), s.currentUser(c).ID, "ARTICLE_UNPUBLISHED", "articles", id, nil)
	httpx.OK(c, gin.H{"ok": true})
}

type albumIn struct {
	Title             string  `json:"title"`
	Slug              string  `json:"slug"`
	Description       string  `json:"description"`
	AlbumDate         *string `json:"date"`
	CoverMediaID      *string `json:"cover_media_id"`
	RelatedFestivalID *string `json:"related_festival_id"`
	Published         *bool   `json:"published"`
}

func (s *Server) adminListAlbums(c *gin.Context) { httpx.OK(c, s.queryAlbums(c, false, 0)) }

func (s *Server) adminCreateAlbum(c *gin.Context) {
	var in albumIn
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Title) == "" {
		httpx.BadRequest(c, "Title is required.")
		return
	}
	u := s.currentUser(c)
	pub := false
	if in.Published != nil && u.Role != "contributor" {
		pub = *in.Published
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "photo_albums", firstNonEmpty(in.Slug, in.Title), "")
	var id string
	err := s.db.QueryRow(c.Request.Context(), `INSERT INTO photo_albums (title, slug, description, album_date, cover_media_id, related_festival_id, published)
		VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, in.Title, slug, in.Description, in.AlbumDate, in.CoverMediaID, in.RelatedFestivalID, pub).Scan(&id)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	s.audit(c.Request.Context(), u.ID, "ALBUM_CREATED", "photo_albums", id, in.Title)
	httpx.Created(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminUpdateAlbum(c *gin.Context) {
	var in albumIn
	if !bindJSON(c, &in) {
		return
	}
	id := c.Param("id")
	slug, _ := s.uniqueSlug(c.Request.Context(), "photo_albums", firstNonEmpty(in.Slug, in.Title), id)
	_, err := s.db.Exec(c.Request.Context(), `UPDATE photo_albums SET title=$2, slug=$3, description=$4, album_date=$5, cover_media_id=$6, related_festival_id=$7, published=COALESCE($8,published), updated_at=now() WHERE id=$1`,
		id, in.Title, slug, in.Description, in.AlbumDate, in.CoverMediaID, in.RelatedFestivalID, in.Published)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	httpx.OK(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminDeleteAlbum(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM photo_albums WHERE id=$1`, c.Param("id"))
	s.audit(c.Request.Context(), s.currentUser(c).ID, "ALBUM_DELETED", "photo_albums", c.Param("id"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminReorderPhotos(c *gin.Context) {
	var in struct {
		Photos []struct {
			ID    string `json:"id"`
			Sort  int    `json:"sort_order"`
			Alt   string `json:"alt_text"`
			Cap   string `json:"caption"`
		} `json:"photos"`
	}
	if !bindJSON(c, &in) {
		return
	}
	for _, p := range in.Photos {
		_, _ = s.db.Exec(c.Request.Context(), `UPDATE photos SET sort_order=$2, alt_text=$3, caption=$4 WHERE id=$1 AND album_id=$5`, p.ID, p.Sort, p.Alt, p.Cap, c.Param("id"))
	}
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminDeletePhoto(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM photos WHERE id=$1 AND album_id=$2`, c.Param("photoId"), c.Param("id"))
	s.audit(c.Request.Context(), s.currentUser(c).ID, "PHOTO_DELETED", "photos", c.Param("photoId"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminListVideos(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id, title, slug, description, COALESCE(youtube_url,''), published FROM videos ORDER BY created_at DESC`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	var out []gin.H
	for rows.Next() {
		var id, title, slug, desc, yt string
		var pub bool
		_ = rows.Scan(&id, &title, &slug, &desc, &yt, &pub)
		out = append(out, gin.H{"id": id, "title": title, "slug": slug, "description": desc, "youtube_url": yt, "published": pub})
	}
	httpx.OK(c, out)
}

func (s *Server) adminCreateVideo(c *gin.Context) {
	var in struct {
		Title       string `json:"title"`
		Slug        string `json:"slug"`
		Description string `json:"description"`
		YoutubeURL  string `json:"youtube_url"`
		Published   bool   `json:"published"`
	}
	if !bindJSON(c, &in) {
		return
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "videos", firstNonEmpty(in.Slug, in.Title), "")
	var id string
	_ = s.db.QueryRow(c.Request.Context(), `INSERT INTO videos (title, slug, description, youtube_url, published) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
		in.Title, slug, in.Description, in.YoutubeURL, in.Published).Scan(&id)
	httpx.Created(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminUpdateVideo(c *gin.Context) {
	var in struct {
		Title, Slug, Description, YoutubeURL string
		Published                            *bool
	}
	if !bindJSON(c, &in) {
		return
	}
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE videos SET title=$2, slug=$3, description=$4, youtube_url=$5, published=COALESCE($6,published), updated_at=now() WHERE id=$1`,
		c.Param("id"), in.Title, slugify.Slug(firstNonEmpty(in.Slug, in.Title)), in.Description, in.YoutubeURL, in.Published)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminDeleteVideo(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM videos WHERE id=$1`, c.Param("id"))
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminListAnnouncements(c *gin.Context) {
	httpx.OK(c, s.queryAnnouncements(c, false))
}

func (s *Server) adminCreateAnnouncement(c *gin.Context) {
	var in struct {
		Title    string  `json:"title"`
		Message  string  `json:"message"`
		CTALabel string  `json:"cta_label"`
		CTAURL   string  `json:"cta_url"`
		Active   *bool   `json:"active"`
		StartAt  *string `json:"start_at"`
		EndAt    *string `json:"end_at"`
	}
	if !bindJSON(c, &in) {
		return
	}
	active := true
	if in.Active != nil {
		active = *in.Active
	}
	var id string
	_ = s.db.QueryRow(c.Request.Context(), `INSERT INTO announcements (title, message, cta_label, cta_url, active, start_at, end_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
		in.Title, in.Message, strPtr(in.CTALabel), strPtr(in.CTAURL), active, in.StartAt, in.EndAt).Scan(&id)
	s.audit(c.Request.Context(), s.currentUser(c).ID, "ANNOUNCEMENT_CREATED", "announcements", id, in.Title)
	httpx.Created(c, gin.H{"id": id})
}

func (s *Server) adminUpdateAnnouncement(c *gin.Context) {
	var in struct {
		Title    string  `json:"title"`
		Message  string  `json:"message"`
		CTALabel string  `json:"cta_label"`
		CTAURL   string  `json:"cta_url"`
		Active   *bool   `json:"active"`
		StartAt  *string `json:"start_at"`
		EndAt    *string `json:"end_at"`
	}
	if !bindJSON(c, &in) {
		return
	}
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE announcements SET title=$2, message=$3, cta_label=$4, cta_url=$5, active=COALESCE($6,active), start_at=$7, end_at=$8, updated_at=now() WHERE id=$1`,
		c.Param("id"), in.Title, in.Message, strPtr(in.CTALabel), strPtr(in.CTAURL), in.Active, in.StartAt, in.EndAt)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminDeleteAnnouncement(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM announcements WHERE id=$1`, c.Param("id"))
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminGetSettings(c *gin.Context) { httpx.OK(c, s.loadSettings(c)) }

func (s *Server) adminPutSettings(c *gin.Context) {
	var in models.SiteSettings
	if !bindJSON(c, &in) {
		return
	}
	b, _ := json.Marshal(in)
	_, _ = s.db.Exec(c.Request.Context(), `INSERT INTO site_settings (key, value) VALUES ('public',$1) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`, b)
	s.audit(c.Request.Context(), s.currentUser(c).ID, "SETTINGS_UPDATED", "site_settings", "public", nil)
	httpx.OK(c, in)
}

func (s *Server) adminListUsers(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id, email, name, role, active FROM users ORDER BY created_at`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	var out []models.User
	for rows.Next() {
		var u models.User
		_ = rows.Scan(&u.ID, &u.Email, &u.Name, &u.Role, &u.Active)
		out = append(out, u)
	}
	httpx.OK(c, out)
}

func (s *Server) adminCreateUser(c *gin.Context) {
	var in struct {
		Email, Name, Password, Role string
	}
	if !bindJSON(c, &in) {
		return
	}
	if in.Role != "admin" && in.Role != "editor" && in.Role != "contributor" {
		httpx.BadRequest(c, "Role must be admin, editor, or contributor.")
		return
	}
	hash, err := password.Hash(in.Password)
	if err != nil || len(in.Password) < 10 {
		httpx.BadRequest(c, "Choose a stronger password (at least 10 characters).")
		return
	}
	var id string
	err = s.db.QueryRow(c.Request.Context(), `INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id`, in.Email, in.Name, hash, in.Role).Scan(&id)
	if err != nil {
		httpx.Conflict(c, "That email is already in use.")
		return
	}
	s.audit(c.Request.Context(), s.currentUser(c).ID, "USER_CREATED", "users", id, in.Email)
	httpx.Created(c, gin.H{"id": id})
}

func (s *Server) adminUpdateUser(c *gin.Context) {
	var in struct {
		Name, Role string
		Active     *bool
		Password   string
	}
	if !bindJSON(c, &in) {
		return
	}
	if in.Password != "" {
		hash, err := password.Hash(in.Password)
		if err != nil {
			httpx.Server(c, "")
			return
		}
		_, _ = s.db.Exec(c.Request.Context(), `UPDATE users SET password_hash=$2 WHERE id=$1`, c.Param("id"), hash)
	}
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE users SET name=COALESCE(NULLIF($2,''),name), role=COALESCE(NULLIF($3,'')::user_role, role), active=COALESCE($4,active), updated_at=now() WHERE id=$1`,
		c.Param("id"), in.Name, in.Role, in.Active)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminDeleteUser(c *gin.Context) {
	if c.Param("id") == s.currentUser(c).ID {
		httpx.BadRequest(c, "You cannot delete your own account.")
		return
	}
	_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM users WHERE id=$1`, c.Param("id"))
	s.audit(c.Request.Context(), s.currentUser(c).ID, "USER_DELETED", "users", c.Param("id"), nil)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminAuditLogs(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id, action, entity, COALESCE(entity_id,''), created_at FROM audit_logs ORDER BY created_at DESC LIMIT 200`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	var out []models.Audit
	for rows.Next() {
		var a models.Audit
		_ = rows.Scan(&a.ID, &a.Action, &a.Entity, &a.EntityID, &a.CreatedAt)
		out = append(out, a)
	}
	httpx.OK(c, out)
}

func firstNonEmpty(a, b string) string {
	if trim(a) != "" {
		return a
	}
	return b
}

func defaultLoc(s string) string {
	if trim(s) == "" {
		return "ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa"
	}
	return s
}
