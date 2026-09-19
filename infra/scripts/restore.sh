#!/usr/bin/env bash
set -euo pipefail
# Restore: download backup from R2, decrypt if needed, then:
#   gunzip -c backup.sql.gz | docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
# Test restores on a copy database, never on production first.
echo "See docs/DEPLOYMENT.md for the full restore procedure."
