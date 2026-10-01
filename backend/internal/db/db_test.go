package db

import (
	"io/fs"
	"strings"
	"testing"

	"github.com/iskcongoa/margao/migrations"
)

func TestMigrationFilesSyntax(t *testing.T) {
	err := fs.WalkDir(migrations.FS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !strings.HasSuffix(path, ".sql") || path == "001_init.sql" {
			return nil
		}
		b, err := fs.ReadFile(migrations.FS, path)
		if err != nil {
			t.Fatalf("Failed to read migration file %s: %v", path, err)
		}
		// Subsequent migration files executed by db.Migrate must not manually INSERT into schema_migrations
		// because db.Migrate records migrations automatically.
		if strings.Contains(string(b), "schema_migrations") {
			t.Errorf("Migration file %s should not contain 'schema_migrations' manually", path)
		}
		return nil
	})
	if err != nil {
		t.Fatalf("WalkDir failed: %v", err)
	}
}
