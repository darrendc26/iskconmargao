# Deployment

## VPS

Use any cheap/free VPS (Oracle Always Free is optional; nothing here is Oracle-specific).

- Ubuntu 22.04+, open 80/443
- Install Docker Engine + Compose plugin
- Clone this repository
- `cp .env.example .env` and fill secrets (`SESSION_SECRET` ≥ 32 random bytes)

## Cloudflare

- DNS A record for `margao.iskcongoa.com` → VPS IP
- R2 bucket `iskcon-margao-media` with an API token (Object Read & Write)
- Set `R2_*` in `.env`. Prefer a public bucket custom domain for `R2_PUBLIC_BASE_URL`, or keep private and serve via signed/public URLs from the API
- SSL/TLS: Full (strict) after Caddy has a certificate

## First admin

Set `BOOTSTRAP_ADMIN_*` before first start, or run:

`docker compose exec backend /app/bootstrap`

## Updates

GitHub Actions on `main` builds images. On the VPS:

```bash
git pull
docker compose build
docker compose up -d
```

## Backups

The `backup` service (profile `backups`) dumps PostgreSQL daily and uploads to R2 under `BACKUP_R2_PREFIX`. Encrypt with `BACKUP_ENCRYPTION_KEY`. Media is already in R2; enable versioning on the bucket if possible.

Test restore on a throwaway database at least once per quarter.
