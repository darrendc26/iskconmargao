package api

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
	"github.com/iskcongoa/margao/internal/payments"
)

type donationCreate struct {
	AmountPaise int    `json:"amount"`
	PurposeSlug string `json:"purpose"`
	DonorName   string `json:"donor_name"`
	DonorEmail  string `json:"donor_email"`
	DonorPhone  string `json:"donor_phone"`
}

func (s *Server) createDonation(c *gin.Context) {
	var in donationCreate
	if !bindJSON(c, &in) {
		return
	}
	if trim(in.DonorName) == "" {
		httpx.BadRequest(c, "Please share your name.")
		return
	}
	if in.AmountPaise < 10000 { // ₹100
		httpx.BadRequest(c, "Please enter an amount of at least ₹100.")
		return
	}
	purposeSlug := trim(in.PurposeSlug)
	if purposeSlug == "" {
		purposeSlug = "where-needed-most"
	}
	var purposeID, purposeTitle string
	err := s.db.QueryRow(c.Request.Context(), `SELECT id, title FROM donation_purposes WHERE slug=$1 AND active=true`, purposeSlug).Scan(&purposeID, &purposeTitle)
	if err != nil {
		httpx.BadRequest(c, "Please choose a valid donation purpose.")
		return
	}
	var id string
	err = s.db.QueryRow(c.Request.Context(), `INSERT INTO donations (gateway, amount, currency, purpose_id, purpose_slug, donor_name, donor_email, donor_phone, status)
		VALUES ($1,$2,'INR',$3,$4,$5,$6,$7,'pending') RETURNING id`,
		s.pay.Name(), in.AmountPaise, purposeID, purposeSlug, in.DonorName, strPtr(in.DonorEmail), strPtr(in.DonorPhone)).Scan(&id)
	if err != nil {
		httpx.Server(c, "")
		return
	}

	if s.cfg.DonationExternalURL != "" && (s.cfg.PaymentMode == "redirect" || s.cfg.Cashfree.AppID == "") {
		httpx.OK(c, gin.H{
			"donation_id":  id,
			"status":       "pending",
			"mode":         "redirect",
			"checkout_url": s.cfg.DonationExternalURL,
			"message":      "You will be taken to the official donation page to complete your contribution.",
		})
		return
	}

	res, err := s.pay.CreateOrder(c.Request.Context(), payments.CreateOrderInput{
		DonationID:    id,
		Amount:        in.AmountPaise,
		Currency:      "INR",
		CustomerName:  in.DonorName,
		CustomerEmail: in.DonorEmail,
		CustomerPhone: in.DonorPhone,
		ReturnURL:     s.cfg.SiteURL + "/donate/thank-you",
		Purpose:       purposeTitle,
	})
	if err != nil {
		httpx.ServiceUnavailable(c, "PAYMENT_NOT_CONFIGURED", "Online donations are not available yet. Please contact ISKCON Margao on WhatsApp.")
		return
	}
	b, _ := json.Marshal(res)
	_, _ = s.db.Exec(c.Request.Context(), `UPDATE donations SET gateway_order_id=$2, checkout_payload=$3, updated_at=now() WHERE id=$1`, id, res.GatewayOrderID, b)
	httpx.OK(c, gin.H{
		"donation_id":      id,
		"status":           "pending",
		"mode":             res.Mode,
		"gateway":          res.Gateway,
		"gateway_order_id": res.GatewayOrderID,
		"payment_session":  res.PaymentSession,
		"checkout_url":     res.CheckoutURL,
	})
}

func (s *Server) getDonationPublic(c *gin.Context) {
	var status, purpose string
	var amount int
	err := s.db.QueryRow(c.Request.Context(), `SELECT status::text, amount, purpose_slug FROM donations WHERE id=$1`, c.Param("id")).Scan(&status, &amount, &purpose)
	if err != nil {
		httpx.NotFound(c, "Donation not found.")
		return
	}
	httpx.OK(c, gin.H{"id": c.Param("id"), "status": status, "amount": amount, "purpose": purpose})
}

func (s *Server) paymentWebhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		httpx.BadRequest(c, "empty")
		return
	}
	headers := map[string]string{}
	for k, v := range c.Request.Header {
		if len(v) > 0 {
			headers[k] = v[0]
		}
	}
	res, err := s.pay.VerifyWebhook(headers, body)
	verified := err == nil
	var eventID string
	if res != nil {
		eventID = res.EventID
	}
	_, _ = s.db.Exec(c.Request.Context(), `INSERT INTO webhook_events (gateway, event_id, payload, verified, processed, error)
		VALUES ($1,$2,$3,$4,false,$5)
		ON CONFLICT (gateway, event_id) DO NOTHING`, s.pay.Name(), strPtr(eventID), body, verified, errString(err))
	if !verified {
		httpx.Fail(c, http.StatusUnauthorized, "INVALID_SIGNATURE", "invalid signature")
		return
	}
	if res.GatewayOrderID == "" {
		httpx.OK(c, gin.H{"ok": true})
		return
	}
	var id string
	var amount int
	var currency, status string
	err = s.db.QueryRow(c.Request.Context(), `SELECT id, amount, currency, status::text FROM donations WHERE gateway_order_id=$1 OR id::text=$1`, res.GatewayOrderID).
		Scan(&id, &amount, &currency, &status)
	if err != nil {
		httpx.OK(c, gin.H{"ok": true, "ignored": true})
		return
	}
	if status == "success" {
		httpx.OK(c, gin.H{"ok": true, "idempotent": true})
		return
	}
	if res.Amount != 0 && res.Amount != amount {
		httpx.Fail(c, http.StatusConflict, "AMOUNT_MISMATCH", "amount mismatch")
		return
	}
	if res.Currency != "" && !strings.EqualFold(res.Currency, currency) {
		httpx.Fail(c, http.StatusConflict, "CURRENCY_MISMATCH", "currency mismatch")
		return
	}
	newStatus := "pending"
	var paid any
	if res.Status == "success" {
		newStatus = "success"
		paid = time.Now()
	} else if res.Status == "failed" {
		newStatus = "failed"
	}
	_, err = s.db.Exec(c.Request.Context(), `UPDATE donations SET status=$2, gateway_payment_id=$3, paid_at=$4, updated_at=now() WHERE id=$1 AND status='pending'`,
		id, newStatus, strPtr(res.GatewayPaymentID), paid)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	if newStatus == "success" {
		var email, name, purpose *string
		_ = s.db.QueryRow(c.Request.Context(), `SELECT donor_email, donor_name, purpose_slug FROM donations WHERE id=$1`, id).Scan(&email, &name, &purpose)
		if email != nil && *email != "" && name != nil && purpose != nil {
			_ = s.mail.SendDonationReceipt(c.Request.Context(), *email, *name, amount, *purpose)
		}
		s.audit(c.Request.Context(), "", "DONATION_SUCCESS", "donations", id, res.GatewayPaymentID)
	}
	httpx.OK(c, gin.H{"ok": true})
}

func errString(err error) any {
	if err == nil {
		return nil
	}
	return err.Error()
}

func (s *Server) adminListDonations(c *gin.Context) {
	status := c.Query("status")
	purpose := c.Query("purpose")
	q := `SELECT id, gateway, COALESCE(gateway_order_id,''), COALESCE(gateway_payment_id,''), amount, currency, purpose_slug, donor_name, donor_email, status::text, created_at, paid_at
		FROM donations WHERE 1=1`
	args := []any{}
	n := 1
	if status != "" {
		q += ` AND status=` + arg(n)
		args = append(args, status)
		n++
	}
	if purpose != "" {
		q += ` AND purpose_slug=` + arg(n)
		args = append(args, purpose)
		n++
	}
	q += ` ORDER BY created_at DESC LIMIT 500`
	rows, err := s.db.Query(c.Request.Context(), q, args...)
	if err != nil {
		httpx.OK(c, gin.H{"items": []any{}, "stats": gin.H{}})
		return
	}
	defer rows.Close()
	var items []gin.H
	for rows.Next() {
		var id, gw, oid, pid, cur, purpose, name string
		var email *string
		var amount int
		var st string
		var created time.Time
		var paid *time.Time
		_ = rows.Scan(&id, &gw, &oid, &pid, &amount, &cur, &purpose, &name, &email, &st, &created, &paid)
		items = append(items, gin.H{
			"id": id, "gateway": gw, "gateway_order_id": oid, "amount": amount, "currency": cur,
			"purpose": purpose, "donor_name": name, "donor_email": email, "status": st, "created_at": created, "paid_at": paid,
		})
	}
	var total, month, year, okN, failN, pendN int
	_ = s.db.QueryRow(c.Request.Context(), `SELECT COALESCE(SUM(amount),0) FILTER (WHERE status='success'),
		COALESCE(SUM(amount),0) FILTER (WHERE status='success' AND paid_at >= date_trunc('month', now())),
		COALESCE(SUM(amount),0) FILTER (WHERE status='success' AND paid_at >= date_trunc('year', now())),
		COUNT(*) FILTER (WHERE status='success'),
		COUNT(*) FILTER (WHERE status='failed'),
		COUNT(*) FILTER (WHERE status='pending')
		FROM donations`).Scan(&total, &month, &year, &okN, &failN, &pendN)
	if items == nil {
		items = []gin.H{}
	}
	httpx.OK(c, gin.H{
		"items": items,
		"stats": gin.H{
			"total_paise": total, "month_paise": month, "year_paise": year,
			"successful": okN, "failed": failN, "pending": pendN,
		},
	})
}

func arg(n int) string { return "$" + itoa(n) }

func (s *Server) adminExportDonations(c *gin.Context) {
	rows, err := s.db.Query(c.Request.Context(), `SELECT to_char(created_at,'YYYY-MM-DD HH24:MI'), status::text, purpose_slug, amount, currency, donor_name, COALESCE(donor_email,''), COALESCE(gateway,''), COALESCE(gateway_order_id,'')
		FROM donations ORDER BY created_at DESC`)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	defer rows.Close()
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=donations.csv")
	c.Status(http.StatusOK)
	_, _ = c.Writer.Write([]byte("created_at,status,purpose,amount_paise,currency,donor_name,donor_email,gateway,order_id\n"))
	for rows.Next() {
		var created, st, purpose, cur, name, email, gw, oid string
		var amount int
		_ = rows.Scan(&created, &st, &purpose, &amount, &cur, &name, &email, &gw, &oid)
		line := created + "," + st + "," + purpose + "," + itoa(amount) + "," + cur + "," + csv(name) + "," + csv(email) + "," + gw + "," + oid + "\n"
		_, _ = c.Writer.Write([]byte(line))
	}
}

func csv(s string) string {
	if strings.ContainsAny(s, ",\"\n") {
		return `"` + strings.ReplaceAll(s, `"`, `""`) + `"`
	}
	return s
}

func (s *Server) adminListPurposes(c *gin.Context) { httpx.OK(c, s.queryPurposes(c, false)) }

func (s *Server) adminCreatePurpose(c *gin.Context) {
	var in struct {
		Title, Slug, Description, LongDescription string
		SuggestedAmounts                          []int
		Active, Featured                          *bool
		SortOrder                                 *int
	}
	if !bindJSON(c, &in) {
		return
	}
	slug, _ := s.uniqueSlug(c.Request.Context(), "donation_purposes", firstNonEmpty(in.Slug, in.Title), "")
	var id string
	err := s.db.QueryRow(c.Request.Context(), `INSERT INTO donation_purposes (title, slug, description, long_description, suggested_amounts, active, featured, sort_order)
		VALUES ($1,$2,$3,$4,$5,COALESCE($6,true),COALESCE($7,false),COALESCE($8,0)) RETURNING id`,
		in.Title, slug, in.Description, in.LongDescription, in.SuggestedAmounts, in.Active, in.Featured, in.SortOrder).Scan(&id)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	httpx.Created(c, gin.H{"id": id, "slug": slug})
}

func (s *Server) adminUpdatePurpose(c *gin.Context) {
	var in struct {
		Title, Slug, Description, LongDescription, SEOTitle, SEODescription string
		SuggestedAmounts                                                    []int
		Active, Featured                                                    *bool
		SortOrder                                                           *int
	}
	if !bindJSON(c, &in) {
		return
	}
	_, err := s.db.Exec(c.Request.Context(), `UPDATE donation_purposes SET title=$2, slug=$3, description=$4, long_description=$5, suggested_amounts=COALESCE($6,suggested_amounts),
		active=COALESCE($7,active), featured=COALESCE($8,featured), sort_order=COALESCE($9,sort_order), seo_title=$10, seo_description=$11, updated_at=now() WHERE id=$1`,
		c.Param("id"), in.Title, firstNonEmpty(in.Slug, in.Title), in.Description, in.LongDescription, in.SuggestedAmounts, in.Active, in.Featured, in.SortOrder, in.SEOTitle, in.SEODescription)
	if err != nil {
		httpx.Server(c, "")
		return
	}
	httpx.OK(c, gin.H{"ok": true})
}
