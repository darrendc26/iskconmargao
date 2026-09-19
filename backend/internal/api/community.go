package api

import (
	"encoding/json"
	"net"
	"regexp"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
)

var emailRe = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func (s *Server) createContact(c *gin.Context) {
	var in struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Phone   string `json:"phone"`
		Subject string `json:"subject"`
		Message string `json:"message"`
		Website string `json:"website"`
	}
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Website) != "" { // honeypot
		httpx.OK(c, gin.H{"ok": true})
		return
	}
	if trim(in.Name) == "" || trim(in.Message) == "" {
		httpx.BadRequest(c, "Please share your name and a message.")
		return
	}
	if len(in.Message) > 5000 {
		httpx.BadRequest(c, "Message is too long.")
		return
	}
	ip := net.ParseIP(c.ClientIP())
	_, err := s.db.Exec(c.Request.Context(), `INSERT INTO contact_messages (name, email, phone, subject, message, ip) VALUES ($1,$2,$3,$4,$5,$6)`,
		in.Name, strPtr(in.Email), in.Phone, in.Subject, in.Message, ip)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	_ = s.mail.SendContactNotification(c.Request.Context(), in.Name, in.Email, in.Message)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) createVolunteer(c *gin.Context) {
	var in struct {
		Name    string   `json:"name"`
		Phone   string   `json:"phone"`
		Email   string   `json:"email"`
		Message string   `json:"message"`
		Website string   `json:"website"`
		Areas   []string `json:"areas_of_interest"`
	}
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Website) != "" {
		httpx.OK(c, gin.H{"ok": true})
		return
	}
	if trim(in.Name) == "" {
		httpx.BadRequest(c, "Please share your name.")
		return
	}
	if in.Areas == nil {
		in.Areas = []string{}
	}
	phoneDigits := digitsOnly(in.Phone)
	if phoneDigits != "" {
		var existing string
		err := s.db.QueryRow(c.Request.Context(), `
			SELECT id::text FROM volunteers
			WHERE lower(trim(name)) = lower(trim($1))
			  AND regexp_replace(COALESCE(phone,''), '[^0-9]', '', 'g') = $2
			ORDER BY created_at ASC
			LIMIT 1`, trim(in.Name), phoneDigits).Scan(&existing)
		if err == nil && existing != "" {
			_, err = s.db.Exec(c.Request.Context(), `
				UPDATE volunteers SET
					email = COALESCE(NULLIF(trim($2), ''), email),
					phone = CASE WHEN length(regexp_replace(COALESCE(phone,''), '[^0-9]', '', 'g')) > 0 THEN phone ELSE $3 END,
					areas_of_interest = (
						SELECT ARRAY(
							SELECT DISTINCT x FROM unnest(COALESCE(areas_of_interest, ARRAY[]::text[]) || $4::text[]) AS t(x)
							WHERE x IS NOT NULL AND btrim(x) <> ''
						)
					),
					message = CASE
						WHEN btrim(COALESCE(message,'')) = '' THEN $5
						WHEN btrim($5) = '' THEN message
						ELSE message || E'\n\n---\n' || $5
					END
				WHERE id = $1::uuid`, existing, in.Email, in.Phone, in.Areas, in.Message)
			if err != nil {
				httpx.Server(c, "")
				return
			}
			httpx.OK(c, gin.H{"ok": true, "merged": true})
			return
		}
	}
	_, err := s.db.Exec(c.Request.Context(), `INSERT INTO volunteers (name, phone, email, areas_of_interest, message) VALUES ($1,$2,$3,$4,$5)`,
		in.Name, in.Phone, strPtr(in.Email), in.Areas, in.Message)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	if in.Email != "" && emailRe.MatchString(in.Email) {
		_ = s.mail.SendVolunteerConfirmation(c.Request.Context(), in.Email, in.Name)
	}
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) createSubscriber(c *gin.Context) {
	var in struct {
		Name      string `json:"name"`
		Phone     string `json:"phone"`
		Email     string `json:"email"`
		WhatsApp  bool   `json:"whatsapp"`
		EmailOpt  bool   `json:"email_opt"`
		Program   bool   `json:"program"`
		Festival  bool   `json:"festival"`
		Seva      bool   `json:"seva"`
		Website   string `json:"website"`
	}
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Website) != "" {
		httpx.OK(c, gin.H{"ok": true})
		return
	}
	if trim(in.Phone) == "" && trim(in.Email) == "" {
		httpx.BadRequest(c, "Please share a phone number or email.")
		return
	}
	_, err := s.db.Exec(c.Request.Context(), `INSERT INTO subscribers (name, phone, email, whatsapp_opt_in, email_opt_in, program_updates, festival_updates, seva_updates)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, in.Name, strPtr(in.Phone), strPtr(in.Email), in.WhatsApp, in.EmailOpt, in.Program, in.Festival, in.Seva)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) trackEvent(c *gin.Context) {
	var in struct {
		Name, Path string
		Metadata   map[string]any `json:"metadata"`
	}
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.Name) == "" {
		httpx.BadRequest(c, "missing event")
		return
	}
	allowed := map[string]bool{
		"page_view": true, "program_view": true, "directions_click": true, "whatsapp_click": true,
		"festival_view": true, "festival_share": true, "donate_click": true, "gallery_view": true,
		"volunteer_submit": true, "join_program_click": true, "donation_started": true, "donation_completed": true,
	}
	if !allowed[in.Name] {
		httpx.BadRequest(c, "unknown event")
		return
	}
	meta := in.Metadata
	if meta == nil {
		meta = map[string]any{}
	}
	b, _ := json.Marshal(meta)
	_, _ = s.db.Exec(c.Request.Context(), `INSERT INTO analytics_events (name, path, metadata) VALUES ($1,$2,$3)`, in.Name, in.Path, b)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminListVolunteers(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id::text, name, COALESCE(phone,''), email, COALESCE(areas_of_interest, ARRAY[]::text[]), COALESCE(message,''), status::text, to_char(created_at, 'YYYY-MM-DD HH24:MI')
		FROM volunteers ORDER BY created_at DESC`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	type row struct {
		id, name, phone, st, msg, created string
		email                             *string
		areas                             []string
	}
	var raw []row
	for rows.Next() {
		var r row
		if err := rows.Scan(&r.id, &r.name, &r.phone, &r.email, &r.areas, &r.msg, &r.st, &r.created); err != nil {
			continue
		}
		if r.areas == nil {
			r.areas = []string{}
		}
		raw = append(raw, r)
	}
	type merged struct {
		row
		submissions int
		areaSet     map[string]bool
	}
	order := []string{}
	by := map[string]*merged{}
	for _, r := range raw {
		key := strings.ToLower(strings.TrimSpace(r.name)) + "|" + digitsOnly(r.phone)
		m, ok := by[key]
		if !ok {
			base := r
			base.areas = []string{}
			m = &merged{row: base, submissions: 0, areaSet: map[string]bool{}}
			by[key] = m
			order = append(order, key)
		}
		m.submissions++
		if m.email == nil && r.email != nil {
			m.email = r.email
		}
		for _, a := range r.areas {
			a = strings.TrimSpace(a)
			if a != "" && !m.areaSet[a] {
				m.areaSet[a] = true
				m.areas = append(m.areas, a)
			}
		}
		if m.id != r.id && strings.TrimSpace(r.msg) != "" {
			if strings.TrimSpace(m.msg) == "" {
				m.msg = r.msg
			} else if !strings.Contains(m.msg, r.msg) {
				m.msg = m.msg + "\n\n---\n" + r.msg
			}
		}
	}
	out := make([]gin.H, 0, len(order))
	for _, key := range order {
		m := by[key]
		out = append(out, gin.H{
			"id": m.id, "name": m.name, "phone": m.phone, "email": m.email,
			"areas_of_interest": m.areas, "message": m.msg, "status": m.st,
			"created_at": m.created, "submissions": m.submissions,
		})
	}
	httpx.OK(c, out)
}

func (s *Server) adminUpdateVolunteer(c *gin.Context) {
	var in struct{ Status string `json:"status"` }
	if !bindJSON(c, &in) {
		return
	}
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE volunteers SET status=$2 WHERE id=$1`, c.Param("id"), in.Status)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminListContacts(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id::text, name, email, COALESCE(phone,''), COALESCE(subject,''), message, status::text, to_char(created_at, 'YYYY-MM-DD HH24:MI') FROM contact_messages ORDER BY created_at DESC LIMIT 300`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	out := make([]gin.H, 0)
	for rows.Next() {
		var id, name, phone, subject, msg, st, created string
		var email *string
		if err := rows.Scan(&id, &name, &email, &phone, &subject, &msg, &st, &created); err != nil {
			continue
		}
		out = append(out, gin.H{"id": id, "name": name, "email": email, "phone": phone, "subject": subject, "message": msg, "status": st, "created_at": created})
	}
	httpx.OK(c, out)
}

func (s *Server) adminUpdateContact(c *gin.Context) {
	var in struct{ Status string `json:"status"` }
	if !bindJSON(c, &in) {
		return
	}
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE contact_messages SET status=$2 WHERE id=$1`, c.Param("id"), in.Status)
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminListSubscribers(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT id::text, name, phone, email, whatsapp_opt_in, email_opt_in, to_char(created_at, 'YYYY-MM-DD HH24:MI'), to_char(unsubscribed_at, 'YYYY-MM-DD HH24:MI') FROM subscribers ORDER BY created_at DESC`)
	if err != nil {
		httpx.OK(c, []any{})
		return
	}
	defer rows.Close()
	out := make([]gin.H, 0)
	for rows.Next() {
		var id string
		var name, phone, email, created, unsub *string
		var w, e bool
		if err := rows.Scan(&id, &name, &phone, &email, &w, &e, &created, &unsub); err != nil {
			continue
		}
		out = append(out, gin.H{"id": id, "name": name, "phone": phone, "email": email, "whatsapp_opt_in": w, "email_opt_in": e, "created_at": created, "unsubscribed_at": unsub})
	}
	httpx.OK(c, out)
}

func (s *Server) adminUpdateSubscriber(c *gin.Context) {
	var in struct {
		Unsubscribed bool `json:"unsubscribed"`
	}
	if !bindJSON(c, &in) {
		return
	}
	if in.Unsubscribed {
		_, _ = s.db.Exec(c.Request.Context(), `UPDATE subscribers SET unsubscribed_at=now() WHERE id=$1`, c.Param("id"))
	} else {
		_, _ = s.db.Exec(c.Request.Context(), `UPDATE subscribers SET unsubscribed_at=NULL WHERE id=$1`, c.Param("id"))
	}
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) adminDeleteSubscriber(c *gin.Context) {
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE subscribers SET unsubscribed_at=now() WHERE id=$1`, c.Param("id"))
	httpx.OK(c, gin.H{"ok": true})
}

func digitsOnly(s string) string {
	var b strings.Builder
	for _, r := range s {
		if unicode.IsDigit(r) {
			b.WriteRune(r)
		}
	}
	return b.String()
}
