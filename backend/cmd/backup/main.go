package main

import (
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/storage"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()
	if !cfg.BackupEnabled {
		log.Println("backups disabled; sleeping")
		select {}
	}
	for {
		if err := runOnce(cfg); err != nil {
			log.Printf("backup error: %v", err)
		}
		time.Sleep(24 * time.Hour)
	}
}

func runOnce(cfg config.Config) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()
	out := "/tmp/iskconmargao-" + time.Now().UTC().Format("2006-01-02") + ".sql"
	cmd := exec.CommandContext(ctx, "pg_dump", cfg.DatabaseURL, "-f", out)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}
	raw, err := os.ReadFile(out)
	if err != nil {
		return err
	}
	payload := raw
	if cfg.BackupKey != "" {
		enc, err := encrypt(raw, cfg.BackupKey)
		if err != nil {
			return err
		}
		payload = enc
		out += ".enc"
	}
	store, err := storage.NewR2(cfg.R2)
	if err != nil {
		return fmt.Errorf("r2 required for off-site backups: %w", err)
	}
	key := cfg.BackupPrefix + "/" + time.Now().UTC().Format("2006/01") + "/" + time.Now().UTC().Format("2006-01-02") + ".sql"
	if cfg.BackupKey != "" {
		key += ".enc"
	}
	if err := store.Upload(ctx, key, bytes.NewReader(payload), "application/octet-stream"); err != nil {
		return err
	}
	log.Printf("uploaded backup %s (%d bytes)", key, len(payload))
	_ = os.Remove("/tmp/" + "iskconmargao-" + time.Now().UTC().Format("2006-01-02") + ".sql")
	return nil
}

func encrypt(plain []byte, key string) ([]byte, error) {
	sum := sha256.Sum256([]byte(key))
	block, err := aes.NewCipher(sum[:])
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}
	return gcm.Seal(nonce, nonce, plain, nil), nil
}
