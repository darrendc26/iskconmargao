package repository

import (
	"context"
)

type Volunteer struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Phone     string   `json:"phone"`
	Email     *string  `json:"email"`
	Interests []string `json:"areas_of_interest"`
	Message   string   `json:"message"`
	Status    string   `json:"status"`
	CreatedAt string   `json:"created_at"`
}

type ContactMessage struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Email     *string `json:"email"`
	Phone     string  `json:"phone"`
	Subject   string  `json:"subject"`
	Message   string  `json:"message"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"created_at"`
}

type Subscriber struct {
	ID        string  `json:"id"`
	Name      *string `json:"name"`
	Phone     *string `json:"phone"`
	Email     *string `json:"email"`
	WhatsApp  bool    `json:"whatsapp_opt_in"`
	EmailOpt  bool    `json:"email_opt_in"`
	Programs  bool    `json:"program_updates"`
	Festivals bool    `json:"festival_updates"`
	Seva      bool    `json:"seva_updates"`
	CreatedAt string  `json:"created_at"`
}

func (r *Repository) CreateVolunteer(ctx context.Context, v *Volunteer) error {
	q := `INSERT INTO volunteers (name, phone, email, areas_of_interest, message) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.pool.QueryRow(ctx, q, v.Name, v.Phone, v.Email, v.Interests, v.Message).Scan(&v.ID)
}

func (r *Repository) CreateContactMessage(ctx context.Context, c *ContactMessage, ip string) error {
	q := `INSERT INTO contact_messages (name, email, phone, subject, message, ip) VALUES ($1, $2, $3, $4, $5, $6::inet) RETURNING id`
	return r.pool.QueryRow(ctx, q, c.Name, c.Email, c.Phone, c.Subject, c.Message, nilIfEmpty(ip)).Scan(&c.ID)
}

func (r *Repository) CreateSubscriber(ctx context.Context, s *Subscriber) error {
	q := `INSERT INTO subscribers (name, phone, email, whatsapp_opt_in, email_opt_in, program_updates, festival_updates, seva_updates)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.pool.QueryRow(ctx, q, s.Name, s.Phone, s.Email, s.WhatsApp, s.EmailOpt, s.Programs, s.Festivals, s.Seva).Scan(&s.ID)
}

func nilIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}
