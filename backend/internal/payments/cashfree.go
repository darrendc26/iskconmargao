package payments

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/iskcongoa/margao/internal/config"
)

type CashfreeGateway struct {
	appID     string
	secret    string
	webhook   string
	baseURL   string
	version   string
	http      *http.Client
}

func NewCashfree(cfg config.CashfreeConfig) *CashfreeGateway {
	base := "https://sandbox.cashfree.com/pg"
	if strings.EqualFold(cfg.Env, "production") {
		base = "https://api.cashfree.com/pg"
	}
	return &CashfreeGateway{
		appID:   cfg.AppID,
		secret:  cfg.SecretKey,
		webhook: cfg.WebhookSecret,
		baseURL: base,
		version: cfg.APIVersion,
		http:    &http.Client{Timeout: 20 * time.Second},
	}
}

func (c *CashfreeGateway) Name() string { return "cashfree" }

func (c *CashfreeGateway) configured() bool {
	return c.appID != "" && c.secret != ""
}

type cfOrderReq struct {
	OrderID       string         `json:"order_id"`
	OrderAmount   float64        `json:"order_amount"`
	OrderCurrency string         `json:"order_currency"`
	CustomerDetails map[string]string `json:"customer_details"`
	OrderMeta     map[string]string `json:"order_meta"`
}

func (c *CashfreeGateway) CreateOrder(ctx context.Context, in CreateOrderInput) (*CreateOrderResult, error) {
	if !c.configured() {
		return nil, fmt.Errorf("cashfree is not configured")
	}
	body := cfOrderReq{
		OrderID:       in.DonationID,
		OrderAmount:   float64(in.Amount) / 100.0,
		OrderCurrency: in.Currency,
		CustomerDetails: map[string]string{
			"customer_id":    in.DonationID,
			"customer_name":  in.CustomerName,
			"customer_email": in.CustomerEmail,
			"customer_phone": emptyPhone(in.CustomerPhone),
		},
		OrderMeta: map[string]string{
			"return_url": in.ReturnURL + "?donation_id=" + in.DonationID,
		},
	}
	raw, _ := json.Marshal(body)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/orders", bytes.NewReader(raw))
	if err != nil {
		return nil, err
	}
	c.auth(req)
	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("cashfree order failed")
	}
	var out struct {
		PaymentSessionID string `json:"payment_session_id"`
		CFOrderID        string `json:"cf_order_id"`
		OrderID          string `json:"order_id"`
		PaymentsURL      string `json:"payment_link,omitempty"`
	}
	if err := json.Unmarshal(b, &out); err != nil {
		return nil, err
	}
	return &CreateOrderResult{
		Gateway:        "cashfree",
		GatewayOrderID: first(out.OrderID, in.DonationID),
		PaymentSession: out.PaymentSessionID,
		Mode:           "checkout",
	}, nil
}

func (c *CashfreeGateway) GetPaymentStatus(ctx context.Context, gatewayOrderID string) (*WebhookResult, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+"/orders/"+gatewayOrderID, nil)
	if err != nil {
		return nil, err
	}
	c.auth(req)
	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	var out struct {
		OrderStatus   string  `json:"order_status"`
		OrderAmount   float64 `json:"order_amount"`
		OrderCurrency string  `json:"order_currency"`
		CFOrderID     json.RawMessage `json:"cf_order_id"`
	}
	if err := json.Unmarshal(b, &out); err != nil {
		return nil, err
	}
	status := "pending"
	switch strings.ToUpper(out.OrderStatus) {
	case "PAID":
		status = "success"
	case "EXPIRED", "TERMINATED":
		status = "failed"
	}
	return &WebhookResult{
		GatewayOrderID: gatewayOrderID,
		Status:         status,
		Amount:         int(out.OrderAmount * 100),
		Currency:       out.OrderCurrency,
	}, nil
}

func (c *CashfreeGateway) VerifyWebhook(headers map[string]string, body []byte) (*WebhookResult, error) {
	sig := header(headers, "x-webhook-signature")
	ts := header(headers, "x-webhook-timestamp")
	if c.webhook == "" || sig == "" {
		return nil, fmt.Errorf("missing webhook signature")
	}
	mac := hmac.New(sha256.New, []byte(c.webhook))
	mac.Write([]byte(ts + string(body)))
	sum := hex.EncodeToString(mac.Sum(nil))
	// Cashfree also uses base64 of hmac at times; accept hex or raw compare via computed b64
	wantB64 := hmacSHA256B64(c.webhook, ts+string(body))
	if !hmac.Equal([]byte(sig), []byte(sum)) && sig != wantB64 {
		return nil, fmt.Errorf("invalid webhook signature")
	}
	var payload struct {
		Type string `json:"type"`
		Data struct {
			Order struct {
				OrderID       string  `json:"order_id"`
				OrderAmount   float64 `json:"order_amount"`
				OrderCurrency string  `json:"order_currency"`
				OrderStatus   string  `json:"order_status"`
			} `json:"order"`
			Payment struct {
				CFPaymentID json.Number `json:"cf_payment_id"`
				PaymentStatus string `json:"payment_status"`
			} `json:"payment"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return nil, err
	}
	status := "pending"
	ps := strings.ToUpper(payload.Data.Payment.PaymentStatus)
	os := strings.ToUpper(payload.Data.Order.OrderStatus)
	if ps == "SUCCESS" || os == "PAID" {
		status = "success"
	} else if ps == "FAILED" || os == "EXPIRED" {
		status = "failed"
	}
	return &WebhookResult{
		EventID:          header(headers, "x-webhook-timestamp") + ":" + payload.Data.Order.OrderID,
		GatewayOrderID:   payload.Data.Order.OrderID,
		GatewayPaymentID: payload.Data.Payment.CFPaymentID.String(),
		Status:           status,
		Amount:           int(payload.Data.Order.OrderAmount * 100),
		Currency:         payload.Data.Order.OrderCurrency,
	}, nil
}

func (c *CashfreeGateway) RefundPayment(ctx context.Context, gatewayPaymentID string, amount int) error {
	raw, _ := json.Marshal(map[string]any{
		"refund_amount": float64(amount) / 100.0,
		"refund_id":     "rf_" + gatewayPaymentID,
	})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/orders/"+gatewayPaymentID+"/refunds", bytes.NewReader(raw))
	if err != nil {
		return err
	}
	c.auth(req)
	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("refund failed")
	}
	return nil
}

func (c *CashfreeGateway) auth(req *http.Request) {
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-client-id", c.appID)
	req.Header.Set("x-client-secret", c.secret)
	req.Header.Set("x-api-version", c.version)
}

func emptyPhone(p string) string {
	if p == "" {
		return "9999999999"
	}
	return p
}

func b64Std(b []byte) string { return base64.StdEncoding.EncodeToString(b) }

func first(a, b string) string {
	if a != "" {
		return a
	}
	return b
}

func header(h map[string]string, k string) string {
	if v, ok := h[k]; ok {
		return v
	}
	for kk, v := range h {
		if strings.EqualFold(kk, k) {
			return v
		}
	}
	return ""
}

func hmacSHA256B64(secret, msg string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(msg))
	return b64Std(mac.Sum(nil))
}
