package repository

import (
	"context"
	"fmt"

	"github.com/iskcongoa/margao/internal/models"
)

func (r *Repository) GetArticles(ctx context.Context, publishedOnly bool, limit int) ([]models.Article, error) {
	q := `SELECT a.id, a.title, a.slug, a.excerpt, a.content, COALESCE(cat.name,''), COALESCE(cat.slug,''), a.author_name, a.status::text,
		to_char(a.published_at,'YYYY-MM-DD"T"HH24:MI:SS"Z"'), m.medium_key, m.original_key
		FROM articles a
		LEFT JOIN article_categories cat ON cat.id=a.category_id
		LEFT JOIN media m ON m.id=a.cover_media_id`
	if publishedOnly {
		q += ` WHERE a.status='published'`
	}
	q += ` ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC`
	if limit > 0 {
		q += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Article
	for rows.Next() {
		var a models.Article
		var pub *string
		var med, orig *string
		var catSlug string
		err := rows.Scan(&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.Category, &catSlug, &a.AuthorName, &a.Status, &pub, &med, &orig)
		if err != nil {
			continue
		}
		a.PublishedAt = pub
		if med != nil && *med != "" {
			a.CoverURL = *med
		} else if orig != nil {
			a.CoverURL = *orig
		}
		out = append(out, a)
	}
	if out == nil {
		out = []models.Article{}
	}
	return out, nil
}

func (r *Repository) CreateArticle(ctx context.Context, a *models.Article) error {
	q := `INSERT INTO articles (title, slug, excerpt, content, category_id, author_id, author_name, status, published_at, seo_title, seo_description, cover_media_id)
		VALUES ($1, $2, $3, $4::jsonb, (SELECT id FROM article_categories WHERE slug=$5 LIMIT 1), $6, $7, $8::article_status, $9, $10, $11, $12)
		RETURNING id`
	return r.pool.QueryRow(ctx, q,
		a.Title, a.Slug, a.Excerpt, a.Content, a.Category, nil, a.AuthorName, a.Status, nil, nil, nil, nil,
	).Scan(&a.ID)
}

func (r *Repository) DeleteArticle(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM articles WHERE id=$1`, id)
	return err
}

func (r *Repository) SetArticlePublishStatus(ctx context.Context, id string, publish bool) error {
	status := "draft"
	if publish {
		status = "published"
	}
	q := fmt.Sprintf(`UPDATE articles SET status=$1::article_status, published_at=%s, updated_at=now() WHERE id=$2`,
		map[bool]string{true: "now()", false: "NULL"}[publish])
	_, err := r.pool.Exec(ctx, q, status, id)
	return err
}
