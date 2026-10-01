-- Add pending_delete_at and deleted_at columns for safe media lifecycle management
ALTER TABLE media ADD COLUMN IF NOT EXISTS pending_delete_at TIMESTAMPTZ;
ALTER TABLE media ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS media_pending_delete_idx ON media (pending_delete_at) WHERE pending_delete_at IS NOT NULL;
