-- Add option to show or hide cover image at the top of article body
ALTER TABLE articles ADD COLUMN IF NOT EXISTS show_cover_in_body BOOLEAN NOT NULL DEFAULT TRUE;
