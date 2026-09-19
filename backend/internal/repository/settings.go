package repository

import (
	"context"
	"encoding/json"

	"github.com/iskcongoa/margao/internal/models"
)

func (r *Repository) GetSettings(ctx context.Context) (models.SiteSettings, error) {
	s := models.DefaultSettings()
	var b []byte
	err := r.pool.QueryRow(ctx, `SELECT value FROM site_settings WHERE key='public'`).Scan(&b)
	if err == nil && len(b) > 0 {
		_ = json.Unmarshal(b, &s)
	}
	return s, nil
}

func (r *Repository) SaveSettings(ctx context.Context, s models.SiteSettings) error {
	b, err := json.Marshal(s)
	if err != nil {
		return err
	}
	_, err = r.pool.Exec(ctx, `INSERT INTO site_settings (key, value, updated_at) VALUES ('public', $1, now())
		ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`, b)
	return err
}

func (r *Repository) LogAnalyticsEvent(ctx context.Context, name, path string, meta any) error {
	b, _ := json.Marshal(meta)
	_, err := r.pool.Exec(ctx, `INSERT INTO analytics_events (name, path, metadata) VALUES ($1, $2, $3)`, name, path, b)
	return err
}
