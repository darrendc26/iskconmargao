package seed

import (
	"context"
	"encoding/json"

	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/models"
	"github.com/iskcongoa/margao/internal/password"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Run(ctx context.Context, pool *pgxpool.Pool, cfg config.Config) error {
	if err := categories(ctx, pool); err != nil {
		return err
	}
	if err := purposes(ctx, pool); err != nil {
		return err
	}
	if err := programs(ctx, pool); err != nil {
		return err
	}
	if err := festivals(ctx, pool); err != nil {
		return err
	}
	if err := articles(ctx, pool); err != nil {
		return err
	}
	if err := settings(ctx, pool, cfg); err != nil {
		return err
	}
	if cfg.BootstrapEmail != "" && cfg.BootstrapPassword != "" {
		if err := adminUser(ctx, pool, cfg); err != nil {
			return err
		}
	}
	return nil
}

func adminUser(ctx context.Context, pool *pgxpool.Pool, cfg config.Config) error {
	hash, err := password.Hash(cfg.BootstrapPassword)
	if err != nil {
		return err
	}
	_, err = pool.Exec(ctx, `INSERT INTO users (email, name, password_hash, role, active, failed_logins, locked_until)
		VALUES ($1, $2, $3, 'admin', true, 0, NULL)
		ON CONFLICT (email) DO UPDATE SET
			password_hash = EXCLUDED.password_hash,
			name = EXCLUDED.name,
			role = 'admin',
			active = true,
			failed_logins = 0,
			locked_until = NULL`,
		cfg.BootstrapEmail, cfg.BootstrapName, hash)
	return err
}

func categories(ctx context.Context, pool *pgxpool.Pool) error {
	rows := [][3]any{
		{"Krishna Katha", "krishna-katha", 1},
		{"Bhagavad-gita", "bhagavad-gita", 2},
		{"Festivals", "festivals", 3},
		{"Devotee Stories", "devotee-stories", 4},
		{"News & Updates", "news-updates", 5},
	}
	for _, r := range rows {
		_, err := pool.Exec(ctx, `INSERT INTO article_categories (name, slug, sort_order) VALUES ($1,$2,$3)
			ON CONFLICT (slug) DO NOTHING`, r[0], r[1], r[2])
		if err != nil {
			return err
		}
	}
	return nil
}

func purposes(ctx context.Context, pool *pgxpool.Pool) error {
	type p struct {
		title, slug, desc, long string
		featured                bool
		order                   int
	}
	list := []p{
		{"General Support", "general-support", "Help support the regular activities and needs of ISKCON Margao.", "Your contribution helps the weekly kirtan, Krishna Katha, community gatherings, and the simple operational needs of the centre.", false, 1},
		{"Annaseva", "annaseva", "Support prasadam prepared and offered with devotion at programs and gatherings.", "Annaseva at ISKCON Margao means supporting prasadam — food cooked and offered with devotion, then shared with guests. We do not publish invented meal counts. Every contribution helps this seva continue honestly.", true, 2},
		{"Festival Seva", "festival-seva", "Help support festivals and special spiritual programs.", "Festivals such as Janmashtami bring the community together. Festival seva helps host these gatherings with kirtan, katha, and prasadam.", false, 3},
		{"Outreach", "outreach", "Support sharing Krishna consciousness, Bhagavad-gita, and kirtan with more people in South Goa.", "Outreach seva helps ISKCON Margao welcome newcomers and share the teachings of Srila Prabhupada in a warm, approachable way.", false, 4},
		{"Centre Activities", "centre-activities", "Support the basic operational needs of the centre.", "This helps the practical running of programs at Matchless Gifts, next to Borkar Hospital, Margao.", false, 5},
		{"Where Needed Most", "where-needed-most", "Allow the organisation to use the contribution where it is most needed.", "If you are unsure which purpose to choose, this option lets the Margao team apply your contribution to the most immediate need.", false, 6},
	}
	for _, x := range list {
		_, err := pool.Exec(ctx, `INSERT INTO donation_purposes (title, slug, description, long_description, featured, sort_order, seo_title, seo_description)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (slug) DO NOTHING`,
			x.title, x.slug, x.desc, x.long, x.featured, x.order, x.title+" | ISKCON Margao", x.desc)
		if err != nil {
			return err
		}
	}
	return nil
}

func programs(ctx context.Context, pool *pgxpool.Pool) error {
	fri, _ := json.Marshal([]map[string]string{
		{"title": "Kirtan", "description": "Congregational chanting of the Hare Krishna maha-mantra."},
		{"title": "Krishna Katha", "description": "Hearing about Krishna from Bhagavad-gita and related scriptures."},
		{"title": "Prasadam / community", "description": "Share prasadam and association."},
	})
	sat, _ := json.Marshal([]map[string]string{
		{"title": "Kirtan", "description": "Chant together."},
		{"title": "Katha / Discussion", "description": "Krishna Katha and open discussion."},
		{"title": "Sangha", "description": "Community association."},
	})
	_, err := pool.Exec(ctx, `INSERT INTO programs (title, slug, description, day_of_week, start_time, end_time, program_items, active, featured, sort_order)
		VALUES
		('Friday Kirtan & Krishna Katha', 'friday-kirtan-krishna-katha',
		 'Join us on Friday evening for kirtan, Krishna Katha, and community. Everyone is welcome — you do not need any prior experience.',
		 5, '18:30', '20:30', $1, true, true, 1),
		('Saturday Kirtan & Discussion', 'saturday-kirtan-discussion',
		 'Saturday evening kirtan, katha or discussion, and sangha. Come as you are.',
		 6, '18:30', '20:30', $2, true, true, 2)
		ON CONFLICT (slug) DO NOTHING`, fri, sat)
	return err
}

func festivals(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `INSERT INTO festivals (title, slug, date, start_time, description, program, location, featured, published, share_text)
		VALUES
		('Janmashtami', 'janmashtami-2026', '2026-09-04', '18:30',
		 'Celebrate the appearance of Sri Krishna with kirtan, katha, and community at ISKCON Margao. Everyone is welcome.',
		 'Kirtan, Krishna Katha, and prasadam as announced closer to the day.',
		 'ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa',
		 true, true,
		 E'🪷 Janmashtami at ISKCON Margao\n\nCelebrate the appearance of Sri Krishna.\n\n📅 4 September 2026\n🕕 7:30 PM onwards\n📍 Margao, Goa\n\nEveryone is welcome.'),
		('Gaura Purnima', 'gaura-purnima-2026', '2026-03-03', '18:30',
		 'Gaura Purnima — the appearance of Sri Caitanya Mahaprabhu — observed with kirtan and katha at ISKCON Margao.',
		 'Kirtan and katha. Details announced closer to the day.',
		 'ISKCON Margao, Margao, Goa', false, true, NULL),
		('Ratha Yatra', 'ratha-yatra', '2026-07-16', '16:00',
		 'Join the community for Ratha Yatra celebrations as announced. Details will be updated as the program is confirmed.',
		 'As announced.',
		 'Margao, Goa', false, true, NULL)
		ON CONFLICT (slug) DO NOTHING`)
	return err
}

func articles(ctx context.Context, pool *pgxpool.Pool) error {
	a1, _ := json.Marshal([]map[string]any{
		{"type": "heading", "level": 2, "text": "A simple introduction"},
		{"type": "paragraph", "text": "Bhakti-yoga is the yoga of devotion. At ISKCON Margao we practise it through kirtan (chanting), Krishna Katha (hearing), prasadam, and friendship."},
		{"type": "paragraph", "text": "You do not need to be a scholar. You can begin by sitting in kirtan and listening."},
	})
	_, err := pool.Exec(ctx, `INSERT INTO articles (title, slug, excerpt, content, category_id, author_name, status, published_at, seo_title, seo_description)
		SELECT 'What is Bhakti-yoga?', 'what-is-bhakti-yoga',
		 'Bhakti-yoga is the path of loving devotion to Krishna — approachable, practical, and open to everyone.',
		 $1::jsonb,
		 c.id, 'ISKCON Margao', 'published', now(),
		 'What is Bhakti-yoga? | ISKCON Margao',
		 'A gentle introduction to bhakti-yoga as practised at ISKCON Margao in South Goa.'
		FROM article_categories c WHERE c.slug='bhagavad-gita'
		ON CONFLICT (slug) DO NOTHING`, a1)
	if err != nil {
		return err
	}

	a2, _ := json.Marshal([]map[string]any{
		{"type": "heading", "level": 2, "text": "The maha-mantra"},
		{"type": "paragraph", "text": "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare,\nHare Rama Hare Rama, Rama Rama Hare Hare."},
		{"type": "paragraph", "text": "At Friday and Saturday programs in Margao, kirtan is the heart of our gathering. You can sing, or simply listen."},
	})
	_, err = pool.Exec(ctx, `INSERT INTO articles (title, slug, excerpt, content, category_id, author_name, status, published_at, seo_title, seo_description)
		SELECT 'Why do we chant Hare Krishna?', 'why-do-we-chant-hare-krishna',
		 'The Hare Krishna maha-mantra is a simple, joyful way to connect the heart with Krishna.',
		 $1::jsonb,
		 c.id, 'ISKCON Margao', 'published', now(),
		 'Why do we chant Hare Krishna? | ISKCON Margao',
		 'Learn why ISKCON Margao chants the Hare Krishna maha-mantra during kirtan.'
		FROM article_categories c WHERE c.slug='krishna-katha'
		ON CONFLICT (slug) DO NOTHING`, a2)
	if err != nil {
		return err
	}

	a3, _ := json.Marshal([]map[string]any{
		{"type": "heading", "level": 2, "text": "Who am I? What is real happiness?"},
		{"type": "paragraph", "text": "The Gita is not a book for a distant elite. At ISKCON Margao we explore it in Krishna Katha in a way that newcomers can follow."},
		{"type": "paragraph", "text": "Come, listen, and ask questions."},
	})
	_, err = pool.Exec(ctx, `INSERT INTO articles (title, slug, excerpt, content, category_id, author_name, status, published_at, seo_title, seo_description)
		SELECT 'Understanding Bhagavad-gita', 'understanding-bhagavad-gita',
		 'The Bhagavad-gita addresses life''s deepest questions with clarity and compassion.',
		 $1::jsonb,
		 c.id, 'ISKCON Margao', 'published', now(),
		 'Understanding Bhagavad-gita | ISKCON Margao',
		 'Explore the Bhagavad-gita with the community at ISKCON Margao, South Goa.'
		FROM article_categories c WHERE c.slug='bhagavad-gita'
		ON CONFLICT (slug) DO NOTHING`, a3)
	return err
}

func settings(ctx context.Context, pool *pgxpool.Pool, cfg config.Config) error {
	s := models.DefaultSettings()
	s.WhatsAppChannelURL = cfg.WhatsAppChannelURL
	s.WhatsAppContactURL = cfg.WhatsAppContactURL
	s.MapsURL = cfg.MapsURL
	s.DonationExternalURL = cfg.DonationExternalURL
	b, _ := json.Marshal(s)
	_, err := pool.Exec(ctx, `INSERT INTO site_settings (key, value) VALUES ('public', $1)
		ON CONFLICT (key) DO NOTHING`, b)
	return err
}
