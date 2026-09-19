package emailer

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"

	"github.com/iskcongoa/margao/internal/config"
)

type Service interface {
	SendContactNotification(ctx context.Context, name, from, message string) error
	SendVolunteerConfirmation(ctx context.Context, to, name string) error
	SendDonationReceipt(ctx context.Context, to, name string, amountPaise int, purpose string) error
	SendPasswordReset(ctx context.Context, to, resetURL string) error
}

func New(cfg config.EmailConfig) Service {
	switch cfg.Provider {
	case "smtp":
		return &smtpMail{cfg: cfg}
	default:
		return &logMail{cfg: cfg}
	}
}

type logMail struct{ cfg config.EmailConfig }

func (l *logMail) SendContactNotification(_ context.Context, name, from, message string) error {
	log.Printf("email[contact] to=%s from=%s name=%s msg=%s", l.cfg.AdminNotifyEmail, from, name, truncate(message))
	return nil
}
func (l *logMail) SendVolunteerConfirmation(_ context.Context, to, name string) error {
	log.Printf("email[volunteer-confirm] to=%s name=%s", to, name)
	return nil
}
func (l *logMail) SendDonationReceipt(_ context.Context, to, name string, amountPaise int, purpose string) error {
	log.Printf("email[donation] to=%s name=%s amount=%d purpose=%s", to, name, amountPaise, purpose)
	return nil
}
func (l *logMail) SendPasswordReset(_ context.Context, to, resetURL string) error {
	log.Printf("email[reset] to=%s url=%s", to, resetURL)
	return nil
}

type smtpMail struct{ cfg config.EmailConfig }

func (s *smtpMail) send(to, subject, body string) error {
	if s.cfg.SMTPHost == "" || to == "" {
		return nil
	}
	addr := fmt.Sprintf("%s:%d", s.cfg.SMTPHost, s.cfg.SMTPPort)
	msg := []byte("From: " + s.cfg.From + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n" +
		body)
	auth := smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPassword, s.cfg.SMTPHost)
	if s.cfg.SMTPPort == 465 {
		tlsCfg := &tls.Config{ServerName: s.cfg.SMTPHost}
		conn, err := tls.Dial("tcp", addr, tlsCfg)
		if err != nil {
			return err
		}
		c, err := smtp.NewClient(conn, s.cfg.SMTPHost)
		if err != nil {
			return err
		}
		defer c.Close()
		if err := c.Auth(auth); err != nil {
			return err
		}
		if err := c.Mail(s.cfg.SMTPUser); err != nil {
			return err
		}
		if err := c.Rcpt(to); err != nil {
			return err
		}
		w, err := c.Data()
		if err != nil {
			return err
		}
		if _, err := w.Write(msg); err != nil {
			return err
		}
		return w.Close()
	}
	return smtp.SendMail(addr, auth, s.cfg.SMTPUser, []string{to}, msg)
}

func (s *smtpMail) SendContactNotification(_ context.Context, name, from, message string) error {
	return s.send(s.cfg.AdminNotifyEmail, "New contact message — ISKCON Margao",
		fmt.Sprintf("From: %s <%s>\n\n%s", name, from, message))
}
func (s *smtpMail) SendVolunteerConfirmation(_ context.Context, to, name string) error {
	return s.send(to, "Thank you for offering seva",
		fmt.Sprintf("Hare Krishna %s,\n\nThank you for offering to serve at ISKCON Margao. Our team will be in touch.\n\nYour servants,\nISKCON Margao", name))
}
func (s *smtpMail) SendDonationReceipt(_ context.Context, to, name string, amountPaise int, purpose string) error {
	rupees := float64(amountPaise) / 100.0
	return s.send(to, "Thank you for your contribution",
		fmt.Sprintf("Hare Krishna %s,\n\nWe received your contribution of ₹%.2f towards %s.\n\nThis message is a simple acknowledgement, not a tax certificate.\n\nISKCON Margao", name, rupees, purpose))
}
func (s *smtpMail) SendPasswordReset(_ context.Context, to, resetURL string) error {
	return s.send(to, "Reset your ISKCON Margao admin password",
		"Open this link to reset your password:\n"+resetURL+"\n\nIf you did not request this, ignore this email.")
}

func truncate(s string) string {
	if len(s) > 200 {
		return s[:200]
	}
	return s
}
