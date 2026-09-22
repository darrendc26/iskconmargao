-- ISKCON Margao core schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'editor', 'contributor'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE article_status AS ENUM ('draft', 'pending_review', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE donation_status AS ENUM ('pending', 'success', 'failed', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE volunteer_status AS ENUM ('new', 'contacted', 'active', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'contributor',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    failed_logins INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent TEXT,
    ip INET
);

CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    day_of_week SMALLINT, -- 0=Sun .. 6=Sat, null for one-off
    start_time TIME,
    end_time TIME,
    location TEXT NOT NULL DEFAULT 'ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa',
    program_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_special BOOLEAN NOT NULL DEFAULT FALSE,
    occurs_on DATE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE festivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    description TEXT NOT NULL DEFAULT '',
    program TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT 'ISKCON Margao, Margao, Goa',
    cover_media_id UUID,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    registration_url TEXT,
    share_text TEXT,
    additional_info TEXT NOT NULL DEFAULT '',
    related_album_id UUID,
    related_donation_purpose_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX festivals_date_idx ON festivals(date);
CREATE INDEX festivals_published_idx ON festivals(published, date);

CREATE TABLE article_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_media_id UUID,
    category_id UUID REFERENCES article_categories(id),
    author_id UUID REFERENCES users(id),
    author_name TEXT NOT NULL DEFAULT '',
    status article_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    og_media_id UUID,
    related_festival_id UUID REFERENCES festivals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_idx ON articles(status, published_at DESC);

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind TEXT NOT NULL DEFAULT 'image', -- image, video
    original_key TEXT NOT NULL,
    webp_key TEXT,
    avif_key TEXT,
    thumb_key TEXT,
    medium_key TEXT,
    large_key TEXT,
    mime_type TEXT NOT NULL,
    bytes INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    folder TEXT NOT NULL DEFAULT 'general',
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE festivals
    ADD CONSTRAINT festivals_cover_media_fk FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL;
ALTER TABLE articles
    ADD CONSTRAINT articles_cover_media_fk FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL;

CREATE TABLE photo_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    album_date DATE,
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    related_festival_id UUID REFERENCES festivals(id) ON DELETE SET NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT ''
);
CREATE INDEX photos_album_idx ON photos(album_id, sort_order);

ALTER TABLE festivals
    ADD CONSTRAINT festivals_related_album_fk FOREIGN KEY (related_album_id) REFERENCES photo_albums(id) ON DELETE SET NULL;

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    youtube_url TEXT,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    related_festival_id UUID REFERENCES festivals(id) ON DELETE SET NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    cta_label TEXT,
    cta_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email CITEXT,
    areas_of_interest TEXT[] NOT NULL DEFAULT '{}',
    message TEXT NOT NULL DEFAULT '',
    status volunteer_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email CITEXT,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    status contact_status NOT NULL DEFAULT 'new',
    ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT,
    email CITEXT,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    email_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    program_updates BOOLEAN NOT NULL DEFAULT TRUE,
    festival_updates BOOLEAN NOT NULL DEFAULT TRUE,
    seva_updates BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ,
    CONSTRAINT subscribers_contact_chk CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

CREATE TABLE donation_purposes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    long_description TEXT NOT NULL DEFAULT '',
    suggested_amounts INTEGER[] NOT NULL DEFAULT '{501,1001,2501,5001}',
    image_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE festivals
    ADD CONSTRAINT festivals_related_purpose_fk FOREIGN KEY (related_donation_purpose_id) REFERENCES donation_purposes(id) ON DELETE SET NULL;

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    amount INTEGER NOT NULL, -- paise
    currency TEXT NOT NULL DEFAULT 'INR',
    purpose_id UUID REFERENCES donation_purposes(id),
    purpose_slug TEXT NOT NULL,
    donor_name TEXT NOT NULL,
    donor_email CITEXT,
    donor_phone TEXT,
    status donation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at TIMESTAMPTZ,
    idempotency_key TEXT UNIQUE,
    checkout_payload JSONB
);
CREATE UNIQUE INDEX donations_gateway_order_uidx ON donations(gateway, gateway_order_id) WHERE gateway_order_id IS NOT NULL;
CREATE INDEX donations_status_idx ON donations(status, created_at DESC);

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL,
    event_id TEXT,
    payload JSONB NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX webhook_events_event_uidx ON webhook_events(gateway, event_id) WHERE event_id IS NOT NULL;

CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON audit_logs(created_at DESC);

CREATE TABLE slug_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    old_slug TEXT NOT NULL,
    new_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (entity_type, old_slug)
);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    path TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX analytics_events_name_idx ON analytics_events(name, created_at DESC);

CREATE TABLE festival_articles (
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    PRIMARY KEY (festival_id, article_id)
);

CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT NOT NULL,
    ip INET,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX login_attempts_email_idx ON login_attempts(email, created_at DESC);

CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (filename) VALUES ('001_init.sql') ON CONFLICT DO NOTHING;
