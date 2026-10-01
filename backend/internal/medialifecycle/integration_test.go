package medialifecycle_test

import (
	"context"
	"encoding/json"
	"io"
	"os"
	"testing"
	"time"

	"github.com/iskcongoa/margao/internal/db"
	"github.com/iskcongoa/margao/internal/medialifecycle"
)

type mockStorage struct {
	deletedKeys map[string]bool
}

func newMockStorage() *mockStorage {
	return &mockStorage{deletedKeys: make(map[string]bool)}
}

func (m *mockStorage) Upload(ctx context.Context, key string, body io.Reader, contentType string) error {
	return nil
}
func (m *mockStorage) Delete(ctx context.Context, key string) error {
	m.deletedKeys[key] = true
	return nil
}
func (m *mockStorage) GetURL(key string) string {
	return key
}
func (m *mockStorage) Exists(ctx context.Context, key string) (bool, error) {
	return true, nil
}
func (m *mockStorage) Get(ctx context.Context, key string) (io.ReadCloser, error) {
	return nil, nil
}
func (m *mockStorage) PresignPut(ctx context.Context, key, contentType string, expiry time.Duration) (string, error) {
	return "", nil
}

func TestMediaLifecycleEndToEnd(t *testing.T) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/iskconmargao?sslmode=disable"
	}

	ctx := context.Background()
	pool, err := db.Connect(ctx, dbURL)
	if err != nil {
		t.Skipf("skipping integration test: database not available (%v)", err)
	}
	defer pool.Close()

	store := newMockStorage()

	// 1. Create Photo 1 and Photo 2 media records in DB
	var photo1ID, photo2ID string
	err = pool.QueryRow(ctx, `INSERT INTO media (original_key, mime_type, bytes, folder) VALUES ('test/photo1.webp', 'image/webp', 100, 'test') RETURNING id`).Scan(&photo1ID)
	if err != nil {
		t.Fatalf("failed to insert photo 1: %v", err)
	}
	defer func() {
		_, _ = pool.Exec(ctx, `DELETE FROM media WHERE id IN ($1, $2)`, photo1ID, photo2ID)
	}()

	err = pool.QueryRow(ctx, `INSERT INTO media (original_key, mime_type, bytes, folder) VALUES ('test/photo2.webp', 'image/webp', 200, 'test') RETURNING id`).Scan(&photo2ID)
	if err != nil {
		t.Fatalf("failed to insert photo 2: %v", err)
	}

	// 2. Create Article A referencing Photo 1
	var articleAID, articleBID string
	contentA1, _ := json.Marshal([]map[string]any{
		{"type": "image", "mediaId": photo1ID},
	})

	slugA := "article-a-test-" + photo1ID[:8]
	slugB := "article-b-test-" + photo1ID[:8]

	err = pool.QueryRow(ctx, `INSERT INTO articles (title, slug, content) VALUES ('Article A', $1, $2::jsonb) RETURNING id`, slugA, contentA1).Scan(&articleAID)
	if err != nil {
		t.Fatalf("failed to create Article A: %v", err)
	}
	defer func() {
		_, _ = pool.Exec(ctx, `DELETE FROM articles WHERE id IN ($1, $2)`, articleAID, articleBID)
	}()

	// Verify Photo 1 is active (pending_delete_at IS NULL)
	var pending1 *time.Time
	_ = pool.QueryRow(ctx, `SELECT pending_delete_at FROM media WHERE id=$1`, photo1ID).Scan(&pending1)
	if pending1 != nil {
		t.Fatalf("expected photo 1 to be active, got pending_delete_at=%v", pending1)
	}

	// 3. Replace Photo 1 with Photo 2 in Article A
	contentA2, _ := json.Marshal([]map[string]any{
		{"type": "image", "mediaId": photo2ID},
	})
	_, err = pool.Exec(ctx, `UPDATE articles SET content=$1::jsonb WHERE id=$2`, contentA2, articleAID)
	if err != nil {
		t.Fatalf("failed to update Article A: %v", err)
	}

	// Reevaluate references for Photo 1 and Photo 2
	err = medialifecycle.ReevaluateMediaReferences(ctx, pool, []string{photo1ID, photo2ID})
	if err != nil {
		t.Fatalf("reevaluate failed: %v", err)
	}

	// Verify Photo 1 is marked pending_delete_at, Photo 2 is active
	_ = pool.QueryRow(ctx, `SELECT pending_delete_at FROM media WHERE id=$1`, photo1ID).Scan(&pending1)
	if pending1 == nil {
		t.Fatalf("expected Photo 1 to be marked pending_delete_at, got NULL")
	}

	var pending2 *time.Time
	_ = pool.QueryRow(ctx, `SELECT pending_delete_at FROM media WHERE id=$1`, photo2ID).Scan(&pending2)
	if pending2 != nil {
		t.Fatalf("expected Photo 2 to be active, got pending_delete_at=%v", pending2)
	}

	// 4. Use Photo 1 in Article B
	contentB1, _ := json.Marshal([]map[string]any{
		{"type": "image", "mediaId": photo1ID},
	})
	err = pool.QueryRow(ctx, `INSERT INTO articles (title, slug, content) VALUES ('Article B', $1, $2::jsonb) RETURNING id`, slugB, contentB1).Scan(&articleBID)
	if err != nil {
		t.Fatalf("failed to create Article B: %v", err)
	}

	// Reevaluate Photo 1
	err = medialifecycle.ReevaluateMediaReferences(ctx, pool, []string{photo1ID})
	if err != nil {
		t.Fatalf("reevaluate Photo 1 failed: %v", err)
	}

	// Verify Photo 1 pending deletion cancelled (pending_delete_at IS NULL again)
	_ = pool.QueryRow(ctx, `SELECT pending_delete_at FROM media WHERE id=$1`, photo1ID).Scan(&pending1)
	if pending1 != nil {
		t.Fatalf("expected Photo 1 pending deletion to be cancelled, got %v", pending1)
	}

	// 5. Remove Photo 1 from Article B
	contentB2 := json.RawMessage(`[]`)
	_, err = pool.Exec(ctx, `UPDATE articles SET content=$1::jsonb WHERE id=$2`, contentB2, articleBID)
	if err != nil {
		t.Fatalf("failed to update Article B: %v", err)
	}

	// Reevaluate Photo 1
	err = medialifecycle.ReevaluateMediaReferences(ctx, pool, []string{photo1ID})
	if err != nil {
		t.Fatalf("reevaluate Photo 1 failed: %v", err)
	}

	// Verify Photo 1 is pending deletion again
	_ = pool.QueryRow(ctx, `SELECT pending_delete_at FROM media WHERE id=$1`, photo1ID).Scan(&pending1)
	if pending1 == nil {
		t.Fatalf("expected Photo 1 to be pending deletion again, got NULL")
	}

	// Force pending_delete_at to past so cleanup job picks it up
	_, _ = pool.Exec(ctx, `UPDATE media SET pending_delete_at = NOW() - INTERVAL '1 minute' WHERE id=$1`, photo1ID)

	// Run cleanup job
	cleaned, err := medialifecycle.CleanupPendingMedia(ctx, pool, store)
	if err != nil {
		t.Fatalf("cleanup job failed: %v", err)
	}
	if cleaned != 1 {
		t.Fatalf("expected 1 cleaned record, got %d", cleaned)
	}

	// Verify Photo 1 is deleted from PostgreSQL
	var count int
	_ = pool.QueryRow(ctx, `SELECT COUNT(*) FROM media WHERE id=$1`, photo1ID).Scan(&count)
	if count != 0 {
		t.Fatalf("expected Photo 1 row to be deleted from media table, found count=%d", count)
	}
}
