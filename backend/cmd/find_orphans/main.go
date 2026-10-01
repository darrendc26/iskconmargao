package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/db"
	"github.com/iskcongoa/margao/internal/medialifecycle"
	"github.com/iskcongoa/margao/internal/storage"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()
	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	var store storage.ObjectStorage
	if r2, err := storage.NewR2(cfg.R2); err == nil {
		store = r2
	} else {
		store = storage.NewLocal(cfg.MediaDir, cfg.PublicAPIURL+"/media")
	}
	_ = store

	rows, err := pool.Query(ctx, `SELECT id, original_key, pending_delete_at FROM media ORDER BY created_at DESC`)
	if err != nil {
		log.Fatalf("querying media failed: %v", err)
	}
	defer rows.Close()

	type item struct {
		id        string
		key       string
		pendingAt *string
	}
	var mediaList []item
	var ids []string
	for rows.Next() {
		var i item
		if err := rows.Scan(&i.id, &i.key, &i.pendingAt); err == nil {
			mediaList = append(mediaList, i)
			ids = append(ids, i.id)
		}
	}
	rows.Close()

	counts, err := medialifecycle.CountReferences(ctx, pool, ids)
	if err != nil {
		log.Fatalf("counting references failed: %v", err)
	}

	fmt.Printf("--- MEDIA ORPHAN DIAGNOSTIC REPORT ---\n")
	fmt.Printf("Total Media Records: %d\n\n", len(mediaList))

	orphans := 0
	inUse := 0
	pending := 0

	for _, m := range mediaList {
		refCount := counts[m.id]
		status := "IN_USE"
		if refCount == 0 {
			if m.pendingAt != nil {
				status = fmt.Sprintf("PENDING_DELETION (%s)", *m.pendingAt)
				pending++
			} else {
				status = "UNREFERENCED / UNMARKED"
				orphans++
			}
		} else {
			inUse++
		}
		fmt.Printf("Media ID: %s | Key: %s | References: %d | Status: %s\n", m.id, m.key, refCount, status)
	}

	fmt.Printf("\nSummary: %d In Use, %d Pending Deletion, %d Unreferenced Unmarked\n", inUse, pending, orphans)
	os.Exit(0)
}
