package main

import (
	"context"
	"log"
	"os"

	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/db"
	"github.com/iskcongoa/margao/internal/password"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()
	email := os.Getenv("BOOTSTRAP_ADMIN_EMAIL")
	pass := os.Getenv("BOOTSTRAP_ADMIN_PASSWORD")
	name := os.Getenv("BOOTSTRAP_ADMIN_NAME")
	if email == "" || pass == "" {
		log.Fatal("BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD required")
	}
	if name == "" {
		name = "Site Admin"
	}
	ctx := context.Background()
	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	if err := db.Migrate(ctx, pool); err != nil {
		log.Fatal(err)
	}
	hash, err := password.Hash(pass)
	if err != nil {
		log.Fatal(err)
	}
	var id string
	err = pool.QueryRow(ctx, `INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,'admin')
		ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, name=EXCLUDED.name
		RETURNING id`, email, name, hash).Scan(&id)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("admin ready: %s (%s)", email, id)
}
