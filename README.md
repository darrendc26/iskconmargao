# ISKCON Margao

Production website and content studio for [ISKCON Margao](https://margao.iskcongoa.com) — a spiritual centre in South Goa (not a large temple campus).

The public site is built to welcome first-time visitors: Friday and Saturday kirtan and Krishna Katha, festivals, Annaseva, and a simple path to visit, join WhatsApp, and support the centre.

## Architecture

Cloudflare DNS/CDN → Caddy (TLS) → Next.js public site + Next.js admin (`/admin`) + Go API → PostgreSQL. Media lives in Cloudflare R2 (local disk in development).

## Local development

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
cd backend && go run ./cmd/server
# other terminals:
cd apps/web && npm install && npm run dev
cd apps/admin && npm install && npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3001/admin/login
- API: http://localhost:8080/health

First admin user is created from `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` on API startup if the users table is empty.

## Production (VPS)

1. Point Cloudflare DNS (orange cloud optional after first TLS) A/AAAA to the VPS.
2. Install Docker. Copy `.env.example` to `.env` and set secrets, `DOMAIN=margao.iskcongoa.com`, `COOKIE_SECURE=true`, R2, Cashfree (or `DONATION_EXTERNAL_URL` for an existing official page).
3. `docker compose up -d --build`
4. Caddy obtains certificates. Cloudflare SSL mode: Full (strict) once Caddy has certs, or Full while testing.
5. Enable backups: `BACKUP_ENABLED=true` plus R2 credentials, then `docker compose --profile backups up -d backup`.

### Restore

Download the daily SQL object from R2, decrypt with `BACKUP_ENCRYPTION_KEY` if used, and restore into a **copy** database first:

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < backup.sql
```

Periodically test this restore. Media is primary in R2 — do not treat VPS disk as the media backup.

## Payments

Orders are created server-side. Donation status becomes `success` only after a verified Cashfree webhook (`POST /api/v1/webhooks/payment`). The thank-you page is not proof of payment.

If Margao already uses an official donation page, set `DONATION_EXTERNAL_URL` and `PAYMENT_MODE=redirect`.

Do not claim 80G unless the organisation confirms eligibility.

## What volunteers can edit

Programs, festivals, articles, photo albums, announcements, videos, donation purposes, and site settings (WhatsApp, maps, social) — without touching code.

## Cost

Self-hosted Postgres, custom CMS, Cloudflare free DNS/CDN, R2 free tier, Caddy TLS, WhatsApp Channel. No paid CMS, Redis, or Kubernetes.
