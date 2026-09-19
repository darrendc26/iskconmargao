package service

import (
	"github.com/iskcongoa/margao/internal/config"
	"github.com/iskcongoa/margao/internal/emailer"
	"github.com/iskcongoa/margao/internal/payments"
	"github.com/iskcongoa/margao/internal/repository"
	"github.com/iskcongoa/margao/internal/storage"
)

// Service encapsulates application business logic
type Service struct {
	repo  *repository.Repository
	cfg   config.Config
	store storage.ObjectStorage
	mail  emailer.Service
	pay   payments.PaymentGateway
}

// New creates a new Service instance
func New(repo *repository.Repository, cfg config.Config, store storage.ObjectStorage, mail emailer.Service, pay payments.PaymentGateway) *Service {
	return &Service{
		repo:  repo,
		cfg:   cfg,
		store: store,
		mail:  mail,
		pay:   pay,
	}
}

// Repo returns the underlying repository
func (s *Service) Repo() *repository.Repository {
	return s.repo
}

// Config returns application config
func (s *Service) Config() config.Config {
	return s.cfg
}

// Storage returns object storage
func (s *Service) Storage() storage.ObjectStorage {
	return s.store
}

// Emailer returns email service
func (s *Service) Emailer() emailer.Service {
	return s.mail
}

// Payment returns payment gateway
func (s *Service) Payment() payments.PaymentGateway {
	return s.pay
}
