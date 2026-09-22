package api

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/blocks"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/models"
)

func (s *Server) queryPrograms(c *gin.Context, activeOnly bool) []models.Program {
	q := `SELECT p.id, p.title, p.slug, p.description, p.day_of_week, to_char(p.start_time,'HH24:MI'), to_char(p.end_time,'HH24:MI'),
		p.location, p.program_items, p.active, p.featured, p.is_special, to_char(p.occurs_on,'YYYY-MM-DD'), p.sort_order,
		p.invitation_media_id, m.medium_key, m.original_key
		FROM programs p
		LEFT JOIN media m ON m.id = p.invitation_media_id`
	if activeOnly {
		q += ` WHERE p.active=true AND (p.occurs_on IS NULL OR p.occurs_on >= CURRENT_DATE)`
	}
	q += ` ORDER BY p.occurs_on NULLS LAST, p.sort_order, p.day_of_week NULLS LAST`
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []models.Program{}
	}
	defer rows.Close()
	var out []models.Program
	for rows.Next() {
		var p models.Program
		var items []byte
		var start, end, occurs *string
		var invID, med, orig *string
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Description, &p.DayOfWeek, &start, &end, &p.Location, &items, &p.Active, &p.Featured, &p.IsSpecial, &occurs, &p.SortOrder, &invID, &med, &orig); err != nil {
			continue
		}
		p.StartTime, p.EndTime, p.OccursOn = start, end, occurs
		p.InvitationMediaID = invID
		if med != nil && *med != "" {
			p.InvitationURL = s.mediaURL(*med)
		} else if orig != nil && *orig != "" {
			p.InvitationURL = s.mediaURL(*orig)
		} else {
			p.InvitationURL = ""
		}
		p.ProgramItems = []any{}
		scanJSON(items, &p.ProgramItems)
		out = append(out, p)
	}
	if out == nil {
		out = []models.Program{}
	}
	return out
}

func (s *Server) listProgramsPublic(c *gin.Context) {
	httpx.OK(c, s.queryPrograms(c, true))
}

func (s *Server) getProgramPublic(c *gin.Context) {
	for _, p := range s.queryPrograms(c, true) {
		if p.Slug == c.Param("slug") {
			httpx.OK(c, p)
			return
		}
	}
	httpx.NotFound(c, "Program not found.")
}

func (s *Server) queryFestivals(c *gin.Context, published, upcoming bool) []models.Festival {
	q := `SELECT f.id, f.title, f.slug, to_char(f.date,'YYYY-MM-DD'), to_char(f.start_time,'HH24:MI'), to_char(f.end_time,'HH24:MI'),
		f.description, f.program, f.location, f.cover_media_id, m.medium_key, m.original_key, f.featured, f.published, f.registration_url, COALESCE(f.share_text,''), COALESCE(f.additional_info,''),
		(f.date >= CURRENT_DATE)
		FROM festivals f
		LEFT JOIN media m ON m.id=f.cover_media_id
		WHERE 1=1`
	if published {
		q += ` AND f.published=true`
	}
	if upcoming {
		q += ` AND f.date >= CURRENT_DATE`
	}
	q += ` ORDER BY f.date`
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []models.Festival{}
	}
	defer rows.Close()
	var out []models.Festival
	for rows.Next() {
		var f models.Festival
		var coverID, med, orig *string
		if err := rows.Scan(&f.ID, &f.Title, &f.Slug, &f.Date, &f.StartTime, &f.EndTime, &f.Description, &f.Program, &f.Location, &coverID, &med, &orig, &f.Featured, &f.Published, &f.RegistrationURL, &f.ShareText, &f.AdditionalInfo, &f.Upcoming); err != nil {
			continue
		}
		f.CoverMediaID = coverID
		key := ""
		if med != nil && *med != "" {
			key = *med
		} else if orig != nil && *orig != "" {
			key = *orig
		}
		if key != "" {
			f.CoverURL = s.mediaURL(key)
		} else {
			f.CoverURL = ""
		}
		if f.ShareText == "" {
			f.ShareText = defaultFestivalShare(f, s.cfg.SiteURL)
		}
		out = append(out, f)
	}
	if out == nil {
		out = []models.Festival{}
	}
	return out
}

func defaultFestivalShare(f models.Festival, site string) string {
	t := "🕕"
	tm := ""
	if f.StartTime != nil {
		tm = *f.StartTime + " onwards"
	}
	return "🪷 " + f.Title + " at ISKCON Margao\n\n" + f.Description + "\n\n📅 " + f.Date + "\n" + t + " " + tm + "\n📍 Margao, Goa\n\nEveryone is welcome.\n\n" + site + "/festivals/" + f.Slug
}

func (s *Server) listFestivalsPublic(c *gin.Context) {
	publicCache(c)
	upcoming := s.queryFestivals(c, true, true)
	q := `SELECT f.id, f.title, f.slug, to_char(f.date,'YYYY-MM-DD'), to_char(f.start_time,'HH24:MI'), to_char(f.end_time,'HH24:MI'),
		f.description, f.program, f.location, f.cover_media_id, m.medium_key, m.original_key, f.featured, f.published, f.registration_url, COALESCE(f.share_text,''), COALESCE(f.additional_info,''), false
		FROM festivals f LEFT JOIN media m ON m.id=f.cover_media_id
		WHERE f.published=true AND f.date < CURRENT_DATE ORDER BY f.date DESC`
	rows, err := s.db.Query(c.Request.Context(), q)
	past := []models.Festival{}
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var f models.Festival
			var coverID, med, orig *string
			_ = rows.Scan(&f.ID, &f.Title, &f.Slug, &f.Date, &f.StartTime, &f.EndTime, &f.Description, &f.Program, &f.Location, &coverID, &med, &orig, &f.Featured, &f.Published, &f.RegistrationURL, &f.ShareText, &f.AdditionalInfo, &f.Upcoming)
			key := ""
			if med != nil && *med != "" {
				key = *med
			} else if orig != nil && *orig != "" {
				key = *orig
			}
			if key != "" {
				f.CoverURL = s.mediaURL(key)
			} else {
				f.CoverURL = ""
			}
			past = append(past, f)
		}
	}
	httpx.OK(c, gin.H{"upcoming": upcoming, "past": past})
}

func (s *Server) getFestivalPublic(c *gin.Context) {
	publicCache(c)
	slug := c.Param("slug")
	var f models.Festival
	var coverID, med, orig *string
	err := s.db.QueryRow(c.Request.Context(), `SELECT f.id, f.title, f.slug, to_char(f.date,'YYYY-MM-DD'), to_char(f.start_time,'HH24:MI'), to_char(f.end_time,'HH24:MI'),
		f.description, f.program, f.location, f.cover_media_id, m.medium_key, m.original_key, f.featured, f.published, f.registration_url, COALESCE(f.share_text,''), COALESCE(f.additional_info,''), (f.date >= CURRENT_DATE)
		FROM festivals f LEFT JOIN media m ON m.id=f.cover_media_id
		WHERE f.slug=$1 AND f.published=true`, slug).
		Scan(&f.ID, &f.Title, &f.Slug, &f.Date, &f.StartTime, &f.EndTime, &f.Description, &f.Program, &f.Location, &coverID, &med, &orig, &f.Featured, &f.Published, &f.RegistrationURL, &f.ShareText, &f.AdditionalInfo, &f.Upcoming)
	if err != nil {
		var ns string
		if e2 := s.db.QueryRow(c.Request.Context(), `SELECT new_slug FROM slug_redirects WHERE entity_type='festival' AND old_slug=$1`, slug).Scan(&ns); e2 == nil {
			c.JSON(301, gin.H{"success": true, "data": gin.H{"redirect": "/festivals/" + ns}})
			return
		}
		httpx.NotFound(c, "Festival not found.")
		return
	}
	if med != nil && *med != "" {
		f.CoverURL = s.mediaURL(*med)
	} else if orig != nil && *orig != "" {
		f.CoverURL = s.mediaURL(*orig)
	} else {
		f.CoverURL = ""
	}
	if f.ShareText == "" {
		f.ShareText = defaultFestivalShare(f, s.cfg.SiteURL)
	}
	httpx.OK(c, f)
}

func (s *Server) queryArticles(c *gin.Context, publishedOnly bool, limit int) []models.Article {
	q := `SELECT a.id, a.title, a.slug, a.excerpt, a.content, COALESCE(cat.name,''), COALESCE(cat.slug,''), a.author_name, a.status::text,
		to_char(a.published_at,'YYYY-MM-DD"T"HH24:MI:SS"Z"'), COALESCE(a.seo_title,''), COALESCE(a.seo_description,''), a.related_festival_id,
		a.cover_media_id, m.medium_key, m.original_key
		FROM articles a
		LEFT JOIN article_categories cat ON cat.id=a.category_id
		LEFT JOIN media m ON m.id=a.cover_media_id`
	if publishedOnly {
		q += ` WHERE a.status='published'`
	}
	q += ` ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC`
	if limit > 0 {
		q += ` LIMIT ` + itoa(limit)
	}
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []models.Article{}
	}
	defer rows.Close()
	var out []models.Article
	for rows.Next() {
		var a models.Article
		var pub *string
		var med, orig *string
		if err := rows.Scan(&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.Category, &a.CategorySlug, &a.AuthorName, &a.Status, &pub, &a.SEOTitle, &a.SEODescription, &a.RelatedFestivalID, &a.CoverMediaID, &med, &orig); err != nil {
			continue
		}
		a.PublishedAt = pub
		if med != nil && *med != "" {
			a.CoverURL = s.mediaURL(*med)
		} else if orig != nil && *orig != "" {
			a.CoverURL = s.mediaURL(*orig)
		} else {
			a.CoverURL = ""
		}
		if len(a.Content) > 0 {
			a.Content = blocks.HydrateArticleMedia(c.Request.Context(), s.db, s.mediaURL, a.Content)
		}
		out = append(out, a)
	}
	if out == nil {
		out = []models.Article{}
	}
	return out
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune('0'+n%10)) + s
		n /= 10
	}
	return s
}

func (s *Server) listArticlesPublic(c *gin.Context) {
	publicCache(c)
	httpx.OK(c, s.queryArticles(c, true, 50))
}

func (s *Server) getArticlePublic(c *gin.Context) {
	publicCache(c)
	slug := c.Param("slug")
	for _, a := range s.queryArticles(c, true, 0) {
		if a.Slug == slug {
			httpx.OK(c, a)
			return
		}
	}
	var ns string
	if e2 := s.db.QueryRow(c.Request.Context(), `SELECT new_slug FROM slug_redirects WHERE entity_type='article' AND old_slug=$1`, slug).Scan(&ns); e2 == nil {
		c.JSON(301, gin.H{"success": true, "data": gin.H{"redirect": "/articles/" + ns}})
		return
	}
	httpx.NotFound(c, "Article not found.")
}

func (s *Server) queryAlbums(c *gin.Context, publishedOnly bool, limit int) []models.Album {
	q := `SELECT a.id, a.title, a.slug, a.description, to_char(a.album_date,'YYYY-MM-DD'), a.published, m.thumb_key, m.medium_key
		FROM photo_albums a LEFT JOIN media m ON m.id=a.cover_media_id`
	if publishedOnly {
		q += ` WHERE a.published=true`
	}
	q += ` ORDER BY a.album_date DESC NULLS LAST, a.created_at DESC`
	if limit > 0 {
		q += ` LIMIT ` + itoa(limit)
	}
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []models.Album{}
	}
	defer rows.Close()
	var out []models.Album
	for rows.Next() {
		var a models.Album
		var date, thumb, med *string
		_ = rows.Scan(&a.ID, &a.Title, &a.Slug, &a.Description, &date, &a.Published, &thumb, &med)
		a.AlbumDate = date
		if med != nil && *med != "" {
			a.CoverURL = s.mediaURL(*med)
		} else if thumb != nil {
			a.CoverURL = s.mediaURL(*thumb)
		}
		out = append(out, a)
	}
	if out == nil {
		out = []models.Album{}
	}
	return out
}

func (s *Server) listAlbumsPublic(c *gin.Context) {
	publicCache(c)
	httpx.OK(c, s.queryAlbums(c, true, 40))
}

func (s *Server) getAlbumPublic(c *gin.Context) {
	publicCache(c)
	slug := c.Param("slug")
	var a models.Album
	var date, thumb, med *string
	err := s.db.QueryRow(c.Request.Context(), `SELECT a.id, a.title, a.slug, a.description, to_char(a.album_date,'YYYY-MM-DD'), a.published, m.thumb_key, m.medium_key
		FROM photo_albums a LEFT JOIN media m ON m.id=a.cover_media_id WHERE a.slug=$1 AND a.published=true`, slug).
		Scan(&a.ID, &a.Title, &a.Slug, &a.Description, &date, &a.Published, &thumb, &med)
	if err != nil {
		httpx.NotFound(c, "Album not found.")
		return
	}
	a.AlbumDate = date
	if med != nil && *med != "" {
		a.CoverURL = s.mediaURL(*med)
	}
	rows, err := s.db.Query(c.Request.Context(), `SELECT p.id, p.media_id, p.sort_order, p.alt_text, p.caption, m.medium_key, m.thumb_key, m.original_key
		FROM photos p JOIN media m ON m.id=p.media_id WHERE p.album_id=$1 ORDER BY p.sort_order, p.id`, a.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var ph models.Photo
			var mk, tk, ok *string
			_ = rows.Scan(&ph.ID, &ph.MediaID, &ph.Sort, &ph.Alt, &ph.Caption, &mk, &tk, &ok)
			if mk != nil {
				ph.URL = s.mediaURL(*mk)
			} else if ok != nil {
				ph.URL = s.mediaURL(*ok)
			}
			if tk != nil {
				ph.ThumbURL = s.mediaURL(*tk)
			} else {
				ph.ThumbURL = ph.URL
			}
			a.Photos = append(a.Photos, ph)
		}
	}
	if a.Photos == nil {
		a.Photos = []models.Photo{}
	}
	httpx.OK(c, a)
}

func (s *Server) listVideosPublic(c *gin.Context) {
	publicCache(c)
	rows, err := s.db.Query(c.Request.Context(), `SELECT id, title, slug, description, COALESCE(youtube_url,''), published FROM videos WHERE published=true ORDER BY created_at DESC`)
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
		out = append(out, gin.H{"id": id, "title": title, "slug": slug, "description": desc, "youtube_url": yt})
	}
	if out == nil {
		out = []gin.H{}
	}
	httpx.OK(c, out)
}

func (s *Server) queryAnnouncements(c *gin.Context, active bool) []gin.H {
	q := `SELECT id, title, message, cta_label, cta_url, active, start_at, end_at FROM announcements WHERE 1=1`
	if active {
		q += ` AND active=true AND (start_at IS NULL OR start_at <= now()) AND (end_at IS NULL OR end_at >= now())`
	}
	q += ` ORDER BY created_at DESC`
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []gin.H{}
	}
	defer rows.Close()
	var out []gin.H
	for rows.Next() {
		var id, title, msg string
		var cta, url *string
		var act bool
		var start, end *time.Time
		_ = rows.Scan(&id, &title, &msg, &cta, &url, &act, &start, &end)
		out = append(out, gin.H{"id": id, "title": title, "message": msg, "cta_label": cta, "cta_url": url, "active": act})
	}
	if out == nil {
		out = []gin.H{}
	}
	return out
}

func (s *Server) listAnnouncementsPublic(c *gin.Context) {
	publicCache(c)
	httpx.OK(c, s.queryAnnouncements(c, true))
}

func (s *Server) queryPurposes(c *gin.Context, activeOnly bool) []models.DonationPurpose {
	q := `SELECT id, title, slug, description, long_description, suggested_amounts, active, featured, sort_order, COALESCE(seo_title,''), COALESCE(seo_description,'') FROM donation_purposes`
	if activeOnly {
		q += ` WHERE active=true`
	}
	q += ` ORDER BY sort_order`
	rows, err := s.db.Query(c.Request.Context(), q)
	if err != nil {
		return []models.DonationPurpose{}
	}
	defer rows.Close()
	var out []models.DonationPurpose
	for rows.Next() {
		var p models.DonationPurpose
		_ = rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Description, &p.LongDescription, &p.SuggestedAmounts, &p.Active, &p.Featured, &p.SortOrder, &p.SEOTitle, &p.SEODescription)
		out = append(out, p)
	}
	if out == nil {
		out = []models.DonationPurpose{}
	}
	return out
}

func (s *Server) listPurposesPublic(c *gin.Context) {
	publicCache(c)
	httpx.OK(c, s.queryPurposes(c, true))
}

func (s *Server) getPurposePublic(c *gin.Context) {
	publicCache(c)
	for _, p := range s.queryPurposes(c, true) {
		if p.Slug == c.Param("slug") {
			httpx.OK(c, p)
			return
		}
	}
	httpx.NotFound(c, "Donation purpose not found.")
}

func (s *Server) sitemapJSON(c *gin.Context) {
	publicCache(c)
	base := s.cfg.SiteURL
	urls := []string{
		base + "/", base + "/about", base + "/about/iskcon", base + "/about/srila-prabhupada", base + "/about/our-journey",
		base + "/programs", base + "/festivals", base + "/articles", base + "/gallery", base + "/videos",
		base + "/discover", base + "/discover/krishna", base + "/discover/bhagavad-gita", base + "/discover/bhakti-yoga",
		base + "/discover/chanting", base + "/discover/caitanya",
		base + "/seva", base + "/volunteer", base + "/donate", base + "/temple-nirman", base + "/visit", base + "/contact", base + "/privacy", base + "/terms",
	}
	for _, f := range s.queryFestivals(c, true, false) {
		urls = append(urls, base+"/festivals/"+f.Slug)
	}
	rows, _ := s.db.Query(c.Request.Context(), `SELECT slug FROM festivals WHERE published AND date < CURRENT_DATE`)
	if rows != nil {
		for rows.Next() {
			var sl string
			_ = rows.Scan(&sl)
			urls = append(urls, base+"/festivals/"+sl)
		}
		rows.Close()
	}
	for _, a := range s.queryArticles(c, true, 0) {
		urls = append(urls, base+"/articles/"+a.Slug)
	}
	for _, a := range s.queryAlbums(c, true, 0) {
		urls = append(urls, base+"/gallery/"+a.Slug)
	}
	for _, p := range s.queryPurposes(c, true) {
		urls = append(urls, base+"/donate/"+p.Slug)
	}
	httpx.OK(c, gin.H{"urls": urls})
}
