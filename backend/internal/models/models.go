package models

import (
	"encoding/json"
	"time"
)

type User struct {
	ID     string `json:"id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	Active bool   `json:"active"`
}

type Program struct {
	ID                string  `json:"id"`
	Title             string  `json:"title"`
	Slug              string  `json:"slug"`
	Description       string  `json:"description"`
	DayOfWeek         *int    `json:"day_of_week,omitempty"`
	StartTime         *string `json:"start_time,omitempty"`
	EndTime           *string `json:"end_time,omitempty"`
	Location          string  `json:"location"`
	ProgramItems      []any   `json:"program_items,omitempty"`
	Active            bool    `json:"active"`
	Featured          bool    `json:"featured"`
	IsSpecial         bool    `json:"is_special"`
	OccursOn          *string `json:"occurs_on,omitempty"`
	InvitationMediaID *string `json:"invitation_media_id,omitempty"`
	InvitationURL     string  `json:"invitation_url,omitempty"`
	SortOrder         int     `json:"sort_order"`
}

type Festival struct {
	ID              string  `json:"id"`
	Title           string  `json:"title"`
	Slug            string  `json:"slug"`
	Date            string  `json:"date"`
	StartTime       *string `json:"start_time,omitempty"`
	EndTime         *string `json:"end_time,omitempty"`
	Description     string  `json:"description"`
	Program         string  `json:"program"`
	Location        string  `json:"location"`
	CoverURL        string  `json:"cover_url,omitempty"`
	CoverMediaID    *string `json:"cover_media_id,omitempty"`
	Featured        bool    `json:"featured"`
	Published       bool    `json:"published"`
	RegistrationURL *string `json:"registration_url,omitempty"`
	ShareText       string  `json:"share_text,omitempty"`
	AdditionalInfo  string  `json:"additional_info,omitempty"`
	Upcoming        bool    `json:"upcoming"`
}

type Article struct {
	ID                string          `json:"id"`
	Title             string          `json:"title"`
	Slug              string          `json:"slug"`
	Excerpt           string          `json:"excerpt"`
	Content           json.RawMessage `json:"content"`
	CoverURL          string          `json:"cover_url,omitempty"`
	CoverMediaID      *string         `json:"cover_media_id,omitempty"`
	Category          string          `json:"category"`
	CategorySlug      string          `json:"category_slug,omitempty"`
	AuthorName        string          `json:"author_name"`
	Status            string          `json:"status"`
	PublishedAt       *string         `json:"published_at,omitempty"`
	SEOTitle          string          `json:"seo_title,omitempty"`
	SEODescription    string          `json:"seo_description,omitempty"`
	RelatedFestivalID *string         `json:"related_festival_id,omitempty"`
	ShowCoverInBody   bool            `json:"show_cover_in_body"`
}

type Album struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Slug        string  `json:"slug"`
	Description string  `json:"description"`
	AlbumDate   *string `json:"date,omitempty"`
	CoverURL    string  `json:"cover_url,omitempty"`
	Published   bool    `json:"published"`
	Photos      []Photo `json:"photos,omitempty"`
}

type Photo struct {
	ID       string `json:"id"`
	MediaID  string `json:"media_id"`
	URL      string `json:"url"`
	ThumbURL string `json:"thumb_url"`
	Alt      string `json:"alt_text"`
	Caption  string `json:"caption,omitempty"`
	Sort     int    `json:"sort_order"`
}

type Media struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	ThumbURL string `json:"thumb_url"`
	Alt      string `json:"alt_text"`
	Caption  string `json:"caption,omitempty"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
}

type DonationPurpose struct {
	ID               string `json:"id"`
	Title            string `json:"title"`
	Slug             string `json:"slug"`
	Description      string `json:"description"`
	LongDescription  string `json:"long_description"`
	SuggestedAmounts []int  `json:"suggested_amounts"`
	ImageURL         string `json:"image_url,omitempty"`
	Active           bool   `json:"active"`
	Featured         bool   `json:"featured"`
	SortOrder        int    `json:"sort_order"`
	SEOTitle         string `json:"seo_title,omitempty"`
	SEODescription   string `json:"seo_description,omitempty"`
}

type SiteSettings struct {
	CentreName   string `json:"centre_name"`
	Tagline      string `json:"tagline"`
	AddressLine1 string `json:"address_line1"`
	AddressLine2 string `json:"address_line2"`
	City         string `json:"city"`

	WhatsAppChannelURL string `json:"whatsapp_channel_url"`
	WhatsAppContactURL string `json:"whatsapp_contact_url"`

	MapsURL      string `json:"maps_url"`
	InstagramURL string `json:"instagram_url"`
	FacebookURL  string `json:"facebook_url"`
	YouTubeURL   string `json:"youtube_url"`
	TwitterURL   string `json:"twitter_url"`
	ISKCONGoaURL string `json:"iskcon_goa_url"`

	HeroHeadline string `json:"hero_headline"`
	HeroSubhead  string `json:"hero_subhead"`
	HeroSupport  string `json:"hero_support"`

	OperatingNote string `json:"operating_note"`
	VisionSummary string `json:"vision_summary"`

	DonationExternalURL string `json:"donation_external_url"`
}

func DefaultSettings() SiteSettings {
	return SiteSettings{
		CentreName: "ISKCON Margao",
		Tagline:    "A place to chant, hear, learn and connect with Krishna consciousness in South Goa.",

		AddressLine1: "Matchless Gifts",
		AddressLine2: "Next to Borkar Hospital",
		City:         "Margao, Goa",

		HeroHeadline: "Hare Krishna",
		HeroSubhead:  "ISKCON Margao",
		HeroSupport:  "A place to chant, hear, learn and connect with Krishna consciousness in South Goa.",

		OperatingNote: "The centre welcomes you during scheduled Friday and Saturday programs, festivals, and announced gatherings.",

		VisionSummary: "ISKCON Margao is a growing community. We look forward to a larger spiritual home for South Goa, while serving warmly where we are today.",

		ISKCONGoaURL: "https://iskcongoa.com",
		MapsURL:      "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts",
		InstagramURL: "https://www.instagram.com/iskconmargao_goa/",
		YouTubeURL:   "https://www.youtube.com/@ISKCONMargao",
		FacebookURL:  "https://www.facebook.com/servants.of.lord.krishna.backtogodhead/",
		TwitterURL:   "https://x.com/ISKCON_Margao_",
	}
}

type Audit struct {
	ID        string    `json:"id"`
	Action    string    `json:"action"`
	Entity    string    `json:"entity"`
	EntityID  string    `json:"entity_id"`
	CreatedAt time.Time `json:"created_at"`
}
