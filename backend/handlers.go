package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateExpense(c *gin.Context) {
	key := c.GetHeader("Idempotency-Key")

	if key != "" {
		var existing IdempotencyKey
		if err := DB.First(&existing, "key = ?", key).Error; err == nil {
			c.Data(http.StatusOK, "application/json", []byte(existing.Response))
			return
		}
	}

	var input struct {
		Amount      int    `json:"amount"`
		Category    string `json:"category"`
		Description string `json:"description"`
		Date        string `json:"date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if input.Amount <= 0 {
		c.JSON(400, gin.H{"error": "amount must be positive"})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", input.Date)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid date format"})
		return
	}

	expense := Expense{
		ID:          uuid.New().String(),
		Amount:      input.Amount,
		Category:    input.Category,
		Description: input.Description,
		Date:        parsedDate,
		CreatedAt:   time.Now(),
	}

	DB.Create(&expense)

	response, _ := json.Marshal(expense)

	if key != "" {
		DB.Create(&IdempotencyKey{
			Key:      key,
			Response: string(response),
		})
	}

	c.JSON(http.StatusCreated, expense)
}

func GetExpenses(c *gin.Context) {
	category := c.Query("category")

	var expenses []Expense
	query := DB.Order("date desc")

	if category != "" {
		query = query.Where("category = ?", category)
	}

	query.Find(&expenses)

	c.JSON(200, expenses)
}
