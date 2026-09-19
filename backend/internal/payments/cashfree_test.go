package payments

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"testing"

	"github.com/iskcongoa/margao/internal/config"
)

func TestCashfreeVerifyWebhook(t *testing.T) {
	g := NewCashfree(config.CashfreeConfig{WebhookSecret: "whsec", Env: "sandbox", APIVersion: "2023-08-01"})
	body := []byte(`{"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"abc","order_amount":501.00,"order_currency":"INR","order_status":"PAID"},"payment":{"cf_payment_id":123,"payment_status":"SUCCESS"}}}`)
	ts := "1710000000"
	mac := hmac.New(sha256.New, []byte("whsec"))
	mac.Write([]byte(ts + string(body)))
	sig := base64.StdEncoding.EncodeToString(mac.Sum(nil))
	res, err := g.VerifyWebhook(map[string]string{
		"x-webhook-signature": sig,
		"x-webhook-timestamp": ts,
	}, body)
	if err != nil {
		t.Fatal(err)
	}
	if res.Status != "success" || res.GatewayOrderID != "abc" || res.Amount != 50100 {
		t.Fatalf("unexpected result: %+v", res)
	}
}

func TestCashfreeRejectsBadSignature(t *testing.T) {
	g := NewCashfree(config.CashfreeConfig{WebhookSecret: "whsec"})
	_, err := g.VerifyWebhook(map[string]string{
		"x-webhook-signature": "nope",
		"x-webhook-timestamp": "1",
	}, []byte(`{}`))
	if err == nil {
		t.Fatal("expected error")
	}
}
