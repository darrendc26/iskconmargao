-- =============================================================================
-- ISKCON Margao Database Initialization Script
-- Consolidated Schema DDL and Seed Data
-- =============================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Define Custom Enum Types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'editor', 'contributor');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'article_status') THEN
        CREATE TYPE article_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donation_status') THEN
        CREATE TYPE donation_status AS ENUM ('pending', 'success', 'failed', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'volunteer_status') THEN
        CREATE TYPE volunteer_status AS ENUM ('new', 'contacted', 'active', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_status') THEN
        CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived');
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Users & Authentication
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent TEXT,
    ip INET
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT NOT NULL,
    ip INET,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_attempts_email_idx ON login_attempts(email, created_at DESC);

-- -----------------------------------------------------------------------------
-- Media Storage
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind TEXT NOT NULL DEFAULT 'image',
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

-- -----------------------------------------------------------------------------
-- Programs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    day_of_week SMALLINT,
    start_time TIME,
    end_time TIME,
    location TEXT NOT NULL DEFAULT 'ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa',
    program_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_special BOOLEAN NOT NULL DEFAULT FALSE,
    occurs_on DATE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    invitation_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Donation Purposes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donation_purposes (
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

-- -----------------------------------------------------------------------------
-- Festivals
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS festivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    description TEXT NOT NULL DEFAULT '',
    program TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT 'ISKCON Margao, Margao, Goa',
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    registration_url TEXT,
    share_text TEXT,
    additional_info TEXT NOT NULL DEFAULT '',
    related_album_id UUID,
    related_donation_purpose_id UUID REFERENCES donation_purposes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS festivals_date_idx ON festivals(date);
CREATE INDEX IF NOT EXISTS festivals_published_idx ON festivals(published, date);

-- -----------------------------------------------------------------------------
-- Articles & Categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS article_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    category_id UUID REFERENCES article_categories(id),
    author_id UUID REFERENCES users(id),
    author_name TEXT NOT NULL DEFAULT '',
    status article_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    og_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    related_festival_id UUID REFERENCES festivals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status, published_at DESC);

CREATE TABLE IF NOT EXISTS festival_articles (
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    PRIMARY KEY (festival_id, article_id)
);

-- -----------------------------------------------------------------------------
-- Gallery: Albums & Photos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS photo_albums (
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

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='festivals_related_album_fk') THEN
        ALTER TABLE festivals ADD CONSTRAINT festivals_related_album_fk FOREIGN KEY (related_album_id) REFERENCES photo_albums(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS photos_album_idx ON photos(album_id, sort_order);

-- -----------------------------------------------------------------------------
-- Videos & Announcements
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
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

CREATE TABLE IF NOT EXISTS announcements (
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

-- -----------------------------------------------------------------------------
-- Community: Volunteers, Contacts, Subscribers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email CITEXT,
    areas_of_interest TEXT[] NOT NULL DEFAULT '{}',
    message TEXT NOT NULL DEFAULT '',
    status volunteer_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
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

CREATE TABLE IF NOT EXISTS subscribers (
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

-- -----------------------------------------------------------------------------
-- Donations & Payments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    amount INTEGER NOT NULL,
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
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations(status, created_at DESC);

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL,
    event_id TEXT,
    payload JSONB NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Settings, Audit Logs & System Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS slug_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    old_slug TEXT NOT NULL,
    new_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (entity_type, old_slug)
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    path TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON analytics_events(name, created_at DESC);

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Default Superadmin User (Password: admin123456)
INSERT INTO users (email, name, password_hash, role)
VALUES (
    'admin@iskconmargao.org',
    'ISKCON Margao Admin',
    '$2a$10$7qN/z.gZ3g3B9S/9Jb3Q/.1Vqj1QWpGq1x.6G4Hq4J5G4Hq4J5G4H',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Article Categories
INSERT INTO article_categories (name, slug, sort_order) VALUES
('Krishna Katha', 'krishna-katha', 1),
('Bhagavad-gita', 'bhagavad-gita', 2),
('Festivals', 'festivals', 3),
('Devotee Stories', 'devotee-stories', 4),
('News & Updates', 'news-updates', 5)
ON CONFLICT (slug) DO NOTHING;

-- Donation Purposes
INSERT INTO donation_purposes (title, slug, description, long_description, featured, sort_order, seo_title, seo_description) VALUES
('General Support', 'general-support', 'Help support the regular activities and needs of ISKCON Margao.', 'Your contribution helps the weekly kirtan, Krishna Katha, community gatherings, and the simple operational needs of the centre.', false, 1, 'General Support | ISKCON Margao', 'Help support the regular activities and needs of ISKCON Margao.'),
('Annaseva', 'annaseva', 'Support prasadam prepared and offered with devotion at programs and gatherings.', 'Annaseva at ISKCON Margao means supporting prasadam — food cooked and offered with devotion, then shared with guests.', true, 2, 'Annaseva | ISKCON Margao', 'Support prasadam prepared and offered with devotion at programs and gatherings.'),
('Festival Seva', 'festival-seva', 'Help support festivals and special spiritual programs.', 'Festivals such as Janmashtami bring the community together. Festival seva helps host these gatherings with kirtan, katha, and prasadam.', false, 3, 'Festival Seva | ISKCON Margao', 'Help support festivals and special spiritual programs.'),
('Outreach', 'outreach', 'Support sharing Krishna consciousness, Bhagavad-gita, and kirtan in South Goa.', 'Outreach seva helps ISKCON Margao welcome newcomers and share the teachings of Srila Prabhupada.', false, 4, 'Outreach | ISKCON Margao', 'Support sharing Krishna consciousness in South Goa.'),
('Where Needed Most', 'where-needed-most', 'Allow the organisation to use the contribution where it is most needed.', 'If you are unsure which purpose to choose, this option lets the Margao team apply your contribution to the most immediate need.', false, 5, 'Where Needed Most | ISKCON Margao', 'Allow the organisation to use the contribution where it is most needed.')
ON CONFLICT (slug) DO NOTHING;

-- Core Programs
INSERT INTO programs (title, slug, description, day_of_week, start_time, end_time, program_items, active, featured, sort_order) VALUES
('Friday Kirtan & Krishna Katha', 'friday-kirtan-krishna-katha', 'Join us on Friday evening for kirtan, Krishna Katha, and community. Everyone is welcome.', 5, '18:30', '20:30', '[{"title": "Kirtan", "description": "Maha-mantra chanting"}, {"title": "Krishna Katha", "description": "Bhagavad-gita discussion"}, {"title": "Prasadam", "description": "Sanctified vegetarian meal"}]'::jsonb, true, true, 1),
('Saturday Kirtan & Discussion', 'saturday-kirtan-discussion', 'Saturday evening kirtan, katha or discussion, and sangha. Come as you are.', 6, '18:30', '20:30', '[{"title": "Kirtan", "description": "Chant together"}, {"title": "Discussion", "description": "Open spiritual QA"}]'::jsonb, true, true, 2)
ON CONFLICT (slug) DO NOTHING;

-- Default Site Settings
INSERT INTO site_settings (key, value) VALUES (
    'public',
    '{
        "contact_email": "contact@iskconmargao.org",
        "contact_phone": "+91 98765 43210",
        "temple_address": "ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa",
        "maps_url": "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts"
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;
