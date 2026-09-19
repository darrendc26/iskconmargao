package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	HTTPAddr            string
	DatabaseURL         string
	SiteURL             string
	AdminURL            string
	PublicAPIURL        string
	SessionSecret       string
	CookieSecure        bool
	CookieDomain        string
	CORSOrigins         []string
	R2                  R2Config
	Cashfree            CashfreeConfig
	PaymentGateway      string
	PaymentMode         string
	DonationExternalURL string
	Email               EmailConfig
	WhatsAppChannelURL  string
	WhatsAppContactURL  string
	MapsURL             string
	BootstrapEmail      string
	BootstrapPassword   string
	BootstrapName       string
	ContactRatePerHour  int
	LoginRatePer15m     int
	BackupEnabled       bool
	BackupPrefix        string
	BackupKey           string
	MediaDir            string
}

type R2Config struct {
	AccountID       string
	AccessKeyID     string
	SecretAccessKey string
	Bucket          string
	Endpoint        string
	PublicBaseURL   string
	Region          string
}

type CashfreeConfig struct {
	AppID         string
	SecretKey     string
	WebhookSecret string
	Env           string
	APIVersion    string
}

type EmailConfig struct {
	Provider         string
	From             string
	SMTPHost         string
	SMTPPort         int
	SMTPUser         string
	SMTPPassword     string
	AdminNotifyEmail string
}

func Load() Config {
	_ = godotenv.Load()
	_ = godotenv.Load("../.env")
	_ = os.Setenv("TZ", "Asia/Kolkata")
	httpAddr := env("HTTP_ADDR", "")
	if httpAddr == "" {
		if port := os.Getenv("PORT"); port != "" {
			httpAddr = ":" + port
		} else {
			httpAddr = ":8080"
		}
	}
	c := Config{
		HTTPAddr:            httpAddr,
		DatabaseURL:         env("DATABASE_URL", "postgres://iskcon:changeme@localhost:5432/iskconmargao?sslmode=disable"),
		SiteURL:             strings.TrimRight(env("SITE_URL", "http://localhost:3000"), "/"),
		AdminURL:            strings.TrimRight(env("ADMIN_URL", "http://localhost:3001"), "/"),
		PublicAPIURL:        strings.TrimRight(env("API_PUBLIC_URL", env("NEXT_PUBLIC_API_URL", "http://localhost:8080")), "/"),
		SessionSecret:       env("SESSION_SECRET", "dev-only-change-me"),
		CookieSecure:        envBool("COOKIE_SECURE", false),
		CookieDomain:        env("COOKIE_DOMAIN", ""),
		CORSOrigins:         split(env("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")),
		PaymentGateway:      env("PAYMENT_GATEWAY", "cashfree"),
		PaymentMode:         env("PAYMENT_MODE", "redirect"),
		DonationExternalURL: env("DONATION_EXTERNAL_URL", ""),
		WhatsAppChannelURL:  env("WHATSAPP_CHANNEL_URL", ""),
		WhatsAppContactURL:  env("WHATSAPP_CONTACT_URL", ""),
		MapsURL:             env("GOOGLE_MAPS_DIRECTIONS_URL", "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts"),
		BootstrapEmail:      env("BOOTSTRAP_ADMIN_EMAIL", ""),
		BootstrapPassword:   env("BOOTSTRAP_ADMIN_PASSWORD", ""),
		BootstrapName:       env("BOOTSTRAP_ADMIN_NAME", "Site Admin"),
		ContactRatePerHour:  envInt("RATE_LIMIT_CONTACT_PER_HOUR", 8),
		LoginRatePer15m:     envInt("RATE_LIMIT_LOGIN_PER_15M", 8),
		BackupEnabled:       envBool("BACKUP_ENABLED", false),
		BackupPrefix:        env("BACKUP_R2_PREFIX", "backups/postgres"),
		BackupKey:           env("BACKUP_ENCRYPTION_KEY", ""),
		MediaDir:            env("MEDIA_DIR", "./data/media"),
		R2: R2Config{
			AccountID:       env("R2_ACCOUNT_ID", ""),
			AccessKeyID:     env("R2_ACCESS_KEY_ID", ""),
			SecretAccessKey: env("R2_SECRET_ACCESS_KEY", ""),
			Bucket:          env("R2_BUCKET", "iskcon-margao-media"),
			Endpoint:        env("R2_ENDPOINT", ""),
			PublicBaseURL:   strings.TrimRight(env("R2_PUBLIC_BASE_URL", ""), "/"),
			Region:          env("R2_REGION", "auto"),
		},
		Cashfree: CashfreeConfig{
			AppID:         env("CASHFREE_APP_ID", ""),
			SecretKey:     env("CASHFREE_SECRET_KEY", ""),
			WebhookSecret: env("CASHFREE_WEBHOOK_SECRET", ""),
			Env:           env("CASHFREE_ENV", "sandbox"),
			APIVersion:    env("CASHFREE_API_VERSION", "2023-08-01"),
		},
		Email: EmailConfig{
			Provider:         env("EMAIL_PROVIDER", "log"),
			From:             env("EMAIL_FROM", "ISKCON Margao <noreply@localhost>"),
			SMTPHost:         env("SMTP_HOST", ""),
			SMTPPort:         envInt("SMTP_PORT", 587),
			SMTPUser:         env("SMTP_USER", ""),
			SMTPPassword:     env("SMTP_PASSWORD", ""),
			AdminNotifyEmail: env("ADMIN_NOTIFY_EMAIL", ""),
		},
	}
	if c.R2.Endpoint == "" && c.R2.AccountID != "" {
		c.R2.Endpoint = "https://" + c.R2.AccountID + ".r2.cloudflarestorage.com"
	}
	return c
}

func env(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}

func envBool(k string, d bool) bool {
	v := os.Getenv(k)
	if v == "" {
		return d
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return d
	}
	return b
}

func envInt(k string, d int) int {
	v := os.Getenv(k)
	if v == "" {
		return d
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return d
	}
	return n
}

func split(s string) []string {
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func SessionTTL() time.Duration { return 12 * time.Hour }
