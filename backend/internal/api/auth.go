package api

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/models"
	"github.com/iskcongoa/margao/internal/password"
)

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) login(c *gin.Context) {
	var req loginReq
	if !bindJSON(c, &req) {
		return
	}
	req.Email = strings.ToLower(trim(req.Email))
	if req.Email == "" || req.Password == "" {
		httpx.BadRequest(c, "Email and password are required.")
		return
	}
	ctx := c.Request.Context()
	var id, hash, name, role string
	var active bool
	var failed int
	var locked *time.Time
	err := s.db.QueryRow(ctx, `SELECT id, password_hash, name, role, active, failed_logins, locked_until FROM users WHERE email=$1`, req.Email).
		Scan(&id, &hash, &name, &role, &active, &failed, &locked)
	if err != nil {
		_, _ = s.db.Exec(ctx, `INSERT INTO login_attempts (email, success) VALUES ($1,false)`, req.Email)
		httpx.Unauthorized(c)
		return
	}
	if locked != nil && locked.After(time.Now()) {
		httpx.Fail(c, http.StatusTooManyRequests, "LOCKED", "Too many attempts. Please try later.")
		return
	}
	if !active || !password.Verify(req.Password, hash) {
		failed++
		var lock any
		if failed >= 8 {
			t := time.Now().Add(15 * time.Minute)
			lock = t
		}
		_, _ = s.db.Exec(ctx, `UPDATE users SET failed_logins=$2, locked_until=$3 WHERE id=$1`, id, failed, lock)
		_, _ = s.db.Exec(ctx, `INSERT INTO login_attempts (email, success) VALUES ($1,false)`, req.Email)
		httpx.Unauthorized(c)
		return
	}
	raw, thash, err := randomToken()
	if err != nil {
		httpx.Server(c, "")
		return
	}
	exp := time.Now().Add(config.SessionTTL())
	if _, err := s.db.Exec(ctx, `INSERT INTO sessions (user_id, token_hash, expires_at, user_agent) VALUES ($1,$2,$3,$4)`,
		id, thash, exp, c.Request.UserAgent()); err != nil {
		httpx.Server(c, "")
		return
	}
	_, _ = s.db.Exec(ctx, `UPDATE users SET failed_logins=0, locked_until=NULL, last_login_at=now() WHERE id=$1`, id)
	_, _ = s.db.Exec(ctx, `INSERT INTO login_attempts (email, success) VALUES ($1,true)`, req.Email)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     cookieName,
		Value:    raw,
		Path:     "/",
		Expires:  exp,
		MaxAge:   int(config.SessionTTL().Seconds()),
		HttpOnly: true,
		Secure:   s.cfg.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Domain:   s.cfg.CookieDomain,
	})
	s.audit(ctx, id, "USER_LOGIN", "users", id, nil)
	httpx.OK(c, gin.H{"user": models.User{ID: id, Email: req.Email, Name: name, Role: role, Active: true}})
}

func (s *Server) logout(c *gin.Context) {
	if ck, err := c.Request.Cookie(cookieName); err == nil {
		_, _ = s.db.Exec(c.Request.Context(), `DELETE FROM sessions WHERE token_hash=$1`, hashToken(ck.Value))
	}
	http.SetCookie(c.Writer, &http.Cookie{
		Name: cookieName, Value: "", Path: "/", MaxAge: -1, HttpOnly: true, Secure: s.cfg.CookieSecure, SameSite: http.SameSiteLaxMode,
	})
	httpx.OK(c, gin.H{"ok": true})
}

func (s *Server) me(c *gin.Context) {
	httpx.OK(c, gin.H{"user": s.currentUser(c)})
}

func (s *Server) requireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ck, err := c.Request.Cookie(cookieName)
		if err != nil || ck.Value == "" {
			httpx.Unauthorized(c)
			c.Abort()
			return
		}
		var u models.User
		err = s.db.QueryRow(c.Request.Context(), `
			SELECT u.id, u.email, u.name, u.role, u.active
			FROM sessions s JOIN users u ON u.id=s.user_id
			WHERE s.token_hash=$1 AND s.expires_at > now() AND u.active=true`, hashToken(ck.Value)).
			Scan(&u.ID, &u.Email, &u.Name, &u.Role, &u.Active)
		if err != nil {
			httpx.Unauthorized(c)
			c.Abort()
			return
		}
		c.Set("user", u)
		c.Next()
	}
}
