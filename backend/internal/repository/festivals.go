package repository

import (
	"context"

	"github.com/iskcongoa/margao/internal/models"
)

func (r *Repository) GetFestivals(ctx context.Context, publishedOnly, upcomingOnly bool) ([]models.Festival, error) {
	q := `SELECT f.id, f.title, f.slug, to_char(f.date,'YYYY-MM-DD'), 
		to_char(f.start_time,'HH24:MI'), to_char(f.end_time,'HH24:MI'),
		f.description, f.program, f.location, f.cover_media_id, m.medium_key, m.original_key, 
		f.featured, f.published, f.registration_url, COALESCE(f.share_text,''), COALESCE(f.additional_info,'')
		FROM festivals f
		LEFT JOIN media m ON m.id=f.cover_media_id
		WHERE 1=1`
	if publishedOnly {
		q += ` AND f.published=true`
	}
	if upcomingOnly {
		q += ` AND f.date >= CURRENT_DATE`
	}
	q += ` ORDER BY f.date`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Festival
	for rows.Next() {
		var f models.Festival
		var coverID, med, orig *string
		err := rows.Scan(
			&f.ID, &f.Title, &f.Slug, &f.Date, &f.StartTime, &f.EndTime,
			&f.Description, &f.Program, &f.Location, &coverID, &med, &orig,
			&f.Featured, &f.Published, &f.RegistrationURL, &f.ShareText, &f.AdditionalInfo,
		)
		if err != nil {
			continue
		}
		f.CoverMediaID = coverID
		if med != nil && *med != "" {
			f.CoverURL = *med
		} else if orig != nil {
			f.CoverURL = *orig
		}
		out = append(out, f)
	}
	if out == nil {
		out = []models.Festival{}
	}
	return out, nil
}

func (r *Repository) GetFestivalBySlug(ctx context.Context, slug string) (*models.Festival, error) {
	var f models.Festival
	var coverID, med, orig *string
	q := `SELECT f.id, f.title, f.slug, to_char(f.date,'YYYY-MM-DD'), 
		to_char(f.start_time,'HH24:MI'), to_char(f.end_time,'HH24:MI'),
		f.description, f.program, f.location, f.cover_media_id, m.medium_key, m.original_key, 
		f.featured, f.published, f.registration_url, COALESCE(f.share_text,''), COALESCE(f.additional_info,'')
		FROM festivals f LEFT JOIN media m ON m.id=f.cover_media_id
		WHERE f.slug=$1`
	err := r.pool.QueryRow(ctx, q, slug).Scan(
		&f.ID, &f.Title, &f.Slug, &f.Date, &f.StartTime, &f.EndTime,
		&f.Description, &f.Program, &f.Location, &coverID, &med, &orig,
		&f.Featured, &f.Published, &f.RegistrationURL, &f.ShareText, &f.AdditionalInfo,
	)
	if err != nil {
		return nil, err
	}
	f.CoverMediaID = coverID
	if med != nil && *med != "" {
		f.CoverURL = *med
	} else if orig != nil {
		f.CoverURL = *orig
	}
	return &f, nil
}

func (r *Repository) CreateFestival(ctx context.Context, f *models.Festival) error {
	q := `INSERT INTO festivals (title, slug, date, start_time, end_time, description, program, location, cover_media_id, featured, published, registration_url, share_text, additional_info)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id`
	return r.pool.QueryRow(ctx, q,
		f.Title, f.Slug, f.Date, f.StartTime, f.EndTime, f.Description, f.Program,
		f.Location, f.CoverMediaID, f.Featured, f.Published, f.RegistrationURL, f.ShareText, f.AdditionalInfo,
	).Scan(&f.ID)
}

func (r *Repository) UpdateFestival(ctx context.Context, f *models.Festival) error {
	q := `UPDATE festivals SET title=$1, slug=$2, date=$3, start_time=$4, end_time=$5, description=$6,
		program=$7, location=$8, cover_media_id=$9, featured=$10, published=$11, registration_url=$12,
		share_text=$13, additional_info=$14, updated_at=now() WHERE id=$15`
	_, err := r.pool.Exec(ctx, q,
		f.Title, f.Slug, f.Date, f.StartTime, f.EndTime, f.Description, f.Program,
		f.Location, f.CoverMediaID, f.Featured, f.Published, f.RegistrationURL, f.ShareText, f.AdditionalInfo, f.ID,
	)
	return err
}

func (r *Repository) DeleteFestival(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM festivals WHERE id=$1`, id)
	return err
}
