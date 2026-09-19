package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/iskcongoa/margao/internal/api"
	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/db"
	"github.com/iskcongoa/margao/internal/emailer"
	"github.com/iskcongoa/margao/internal/payments"
	"github.com/iskcongoa/margao/internal/seed"
	"github.com/iskcongoa/margao/internal/storage"
)

func main() {
	healthcheck := flag.Bool("healthcheck", false, "ping local health and exit")
	flag.Parse()
	if *healthcheck {
		resp, err := http.Get("http://127.0.0.1:8080/health")
		if err != nil || resp.StatusCode >= 400 {
			os.Exit(1)
		}
		os.Exit(0)
	}

	cfg := config.Load()
	ctx := context.Background()
	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()
	if err := db.Migrate(ctx, pool); err != nil {
		log.Fatalf("migrate: %v", err)
	}
	if err := seed.Run(ctx, pool, cfg); err != nil {
		log.Fatalf("seed: %v", err)
	}

	var store storage.ObjectStorage
	if r2, err := storage.NewR2(cfg.R2); err == nil {
		store = r2
		log.Println("storage: Cloudflare R2")
	} else {
		store = storage.NewLocal(cfg.MediaDir, cfg.PublicAPIURL+"/media")
		log.Println("storage: local disk fallback")
	}

	var pay payments.PaymentGateway
	if cfg.DonationExternalURL != "" && cfg.PaymentMode == "redirect" {
		pay = payments.RedirectGateway{URL: cfg.DonationExternalURL}
	} else {
		pay = payments.NewCashfree(cfg.Cashfree)
	}

	srv := api.New(cfg, pool, store, emailer.New(cfg.Email), pay)
	httpSrv := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           srv.Router(),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       60 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}
	go func() {
		log.Printf("listening on %s", cfg.HTTPAddr)
		if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	shctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = httpSrv.Shutdown(shctx)
}
