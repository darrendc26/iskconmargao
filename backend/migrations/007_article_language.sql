-- Add language column to articles table with default 'en'
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_language_check') THEN
        ALTER TABLE articles ADD CONSTRAINT articles_language_check CHECK (language IN ('en', 'hi', 'kok'));
    END IF;
END $$;
