package payments

import (
	"context"
	"time"
)

type CreateOrderInput struct {
	DonationID string
	Amount     int // paise
	Currency   string
	CustomerName  string
	CustomerEmail string
	CustomerPhone string
	ReturnURL  string
	Purpose    string
}

type CreateOrderResult struct {
	Gateway         string `json:"gateway"`
	GatewayOrderID  string `json:"gateway_order_id"`
	PaymentSession  string `json:"payment_session,omitempty"`
	CheckoutURL     string `json:"checkout_url,omitempty"`
	Mode            string `json:"mode"`
}

type WebhookResult struct {
	EventID          string
	GatewayOrderID   string
	GatewayPaymentID string
	Status           string // success, failed
	Amount           int
	Currency         string
}

type PaymentGateway interface {
	Name() string
	CreateOrder(ctx context.Context, in CreateOrderInput) (*CreateOrderResult, error)
	GetPaymentStatus(ctx context.Context, gatewayOrderID string) (*WebhookResult, error)
	VerifyWebhook(headers map[string]string, body []byte) (*WebhookResult, error)
	RefundPayment(ctx context.Context, gatewayPaymentID string, amount int) error
}

type RedirectGateway struct {
	URL string
}

func (r RedirectGateway) Name() string { return "external" }

func (r RedirectGateway) CreateOrder(_ context.Context, _ CreateOrderInput) (*CreateOrderResult, error) {
	return &CreateOrderResult{
		Gateway:     "external",
		CheckoutURL: r.URL,
		Mode:        "redirect",
	}, nil
}

func (r RedirectGateway) GetPaymentStatus(context.Context, string) (*WebhookResult, error) {
	return nil, errNotSupported
}

func (r RedirectGateway) VerifyWebhook(map[string]string, []byte) (*WebhookResult, error) {
	return nil, errNotSupported
}

func (r RedirectGateway) RefundPayment(context.Context, string, int) error {
	return errNotSupported
}

var errNotSupported = &gwError{"not supported for redirect gateway"}

type gwError struct{ s string }

func (e *gwError) Error() string { return e.s }

func Now() time.Time { return time.Now() }
