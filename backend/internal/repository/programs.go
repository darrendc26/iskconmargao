package repository

import (
	"context"
	"encoding/json"

	"github.com/iskcongoa/margao/internal/models"
)

func (r *Repository) GetPrograms(ctx context.Context, activeOnly bool) ([]models.Program, error) {
	q := `SELECT p.id, p.title, p.slug, p.description, p.day_of_week, 
		to_char(p.start_time,'HH24:MI'), to_char(p.end_time,'HH24:MI'),
		p.location, p.program_items, p.active, p.featured, p.is_special, 
		to_char(p.occurs_on,'YYYY-MM-DD'), p.sort_order,
		p.invitation_media_id, m.medium_key, m.original_key
		FROM programs p
		LEFT JOIN media m ON m.id = p.invitation_media_id`
	if activeOnly {
		q += ` WHERE p.active=true`
	}
	q += ` ORDER BY p.occurs_on NULLS LAST, p.sort_order, p.day_of_week NULLS LAST`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Program
	for rows.Next() {
		var p models.Program
		var items []byte
		var start, end, occurs *string
		var invID, med, orig *string

		err := rows.Scan(
			&p.ID, &p.Title, &p.Slug, &p.Description, &p.DayOfWeek,
			&start, &end, &p.Location, &items, &p.Active, &p.Featured,
			&p.IsSpecial, &occurs, &p.SortOrder, &invID, &med, &orig,
		)
		if err != nil {
			continue
		}
		p.StartTime, p.EndTime, p.OccursOn = start, end, occurs
		p.InvitationMediaID = invID

		if med != nil && *med != "" {
			p.InvitationURL = *med
		} else if orig != nil {
			p.InvitationURL = *orig
		}

		p.ProgramItems = []any{}
		if len(items) > 0 {
			_ = json.Unmarshal(items, &p.ProgramItems)
		}
		out = append(out, p)
	}
	if out == nil {
		out = []models.Program{}
	}
	return out, nil
}

func (r *Repository) CreateProgram(ctx context.Context, p *models.Program) error {
	items, _ := json.Marshal(p.ProgramItems)
	q := `INSERT INTO programs (title, slug, description, day_of_week, start_time, end_time, location, program_items, active, featured, is_special, occurs_on, sort_order, invitation_media_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id`
	return r.pool.QueryRow(ctx, q,
		p.Title, p.Slug, p.Description, p.DayOfWeek, p.StartTime, p.EndTime,
		p.Location, items, p.Active, p.Featured, p.IsSpecial, p.OccursOn, p.SortOrder, p.InvitationMediaID,
	).Scan(&p.ID)
}

func (r *Repository) UpdateProgram(ctx context.Context, p *models.Program) error {
	items, _ := json.Marshal(p.ProgramItems)
	q := `UPDATE programs SET title=$1, slug=$2, description=$3, day_of_week=$4, start_time=$5, end_time=$6,
		location=$7, program_items=$8, active=$9, featured=$10, is_special=$11, occurs_on=$12, sort_order=$13,
		invitation_media_id=$14, updated_at=now() WHERE id=$15`
	_, err := r.pool.Exec(ctx, q,
		p.Title, p.Slug, p.Description, p.DayOfWeek, p.StartTime, p.EndTime,
		p.Location, items, p.Active, p.Featured, p.IsSpecial, p.OccursOn, p.SortOrder, p.InvitationMediaID, p.ID,
	)
	return err
}

func (r *Repository) DeleteProgram(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM programs WHERE id=$1`, id)
	return err
}
