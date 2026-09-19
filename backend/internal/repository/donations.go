package repository

import (
	"context"

	"github.com/iskcongoa/margao/internal/models"
)

func (r *Repository) GetPurposes(ctx context.Context, activeOnly bool) ([]models.DonationPurpose, error) {
	q := `SELECT id, title, slug, description, long_description, suggested_amounts, active, featured, sort_order, COALESCE(seo_title,''), COALESCE(seo_description,'') FROM donation_purposes`
	if activeOnly {
		q += ` WHERE active=true`
	}
	q += ` ORDER BY sort_order`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.DonationPurpose
	for rows.Next() {
		var p models.DonationPurpose
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Description, &p.LongDescription, &p.SuggestedAmounts, &p.Active, &p.Featured, &p.SortOrder, &p.SEOTitle, &p.SEODescription)
		if err != nil {
			continue
		}
		out = append(out, p)
	}
	if out == nil {
		out = []models.DonationPurpose{}
	}
	return out, nil
}

func (r *Repository) CreatePurpose(ctx context.Context, p *models.DonationPurpose) error {
	q := `INSERT INTO donation_purposes (title, slug, description, long_description, suggested_amounts, active, featured, sort_order, seo_title, seo_description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id`
	return r.pool.QueryRow(ctx, q,
		p.Title, p.Slug, p.Description, p.LongDescription, p.SuggestedAmounts,
		p.Active, p.Featured, p.SortOrder, p.SEOTitle, p.SEODescription,
	).Scan(&p.ID)
}

func (r *Repository) UpdatePurpose(ctx context.Context, p *models.DonationPurpose) error {
	q := `UPDATE donation_purposes SET title=$1, slug=$2, description=$3, long_description=$4, suggested_amounts=$5,
		active=$6, featured=$7, sort_order=$8, seo_title=$9, seo_description=$10, updated_at=now() WHERE id=$11`
	_, err := r.pool.Exec(ctx, q,
		p.Title, p.Slug, p.Description, p.LongDescription, p.SuggestedAmounts,
		p.Active, p.Featured, p.SortOrder, p.SEOTitle, p.SEODescription, p.ID,
	)
	return err
}
