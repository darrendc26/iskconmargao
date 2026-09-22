-- Migration 004: Convert article content from text to structured JSONB blocks
DO $$
DECLARE
    r RECORD;
    p TEXT;
    block_item JSONB;
    blocks JSONB;
BEGIN
    -- Rename existing content column
    ALTER TABLE articles RENAME COLUMN content TO content_text;
    ALTER TABLE articles ADD COLUMN content JSONB NOT NULL DEFAULT '[]'::jsonb;

    FOR r IN SELECT id, content_text FROM articles LOOP
        IF r.content_text IS NULL OR trim(r.content_text) = '' THEN
            UPDATE articles SET content = '[]'::jsonb WHERE id = r.id;
        ELSIF r.content_text LIKE '[%' THEN
            BEGIN
                UPDATE articles SET content = r.content_text::jsonb WHERE id = r.id;
            EXCEPTION WHEN OTHERS THEN
                UPDATE articles SET content = jsonb_build_array(jsonb_build_object('type', 'paragraph', 'text', r.content_text)) WHERE id = r.id;
            END;
        ELSE
            blocks := '[]'::jsonb;
            FOR p IN SELECT unnest(string_to_array(replace(r.content_text, E'\r\n', E'\n'), E'\n\n')) LOOP
                p := trim(p);
                IF p <> '' THEN
                    block_item := jsonb_build_object('type', 'paragraph', 'text', p);
                    blocks := blocks || jsonb_build_array(block_item);
                END IF;
            END LOOP;

            IF jsonb_array_length(blocks) > 0 THEN
                UPDATE articles SET content = blocks WHERE id = r.id;
            ELSE
                UPDATE articles SET content = jsonb_build_array(jsonb_build_object('type', 'paragraph', 'text', trim(r.content_text))) WHERE id = r.id;
            END IF;
        END IF;
    END LOOP;

    ALTER TABLE articles DROP COLUMN content_text;
END $$;
