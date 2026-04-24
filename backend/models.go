package main

import "time"

type Expense struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Amount      int       `json:"amount"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
}

type IdempotencyKey struct {
	Key      string `gorm:"primaryKey"`
	Response string
}
