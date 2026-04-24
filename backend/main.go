package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	InitDB()

	r := gin.Default()
	r.Use(SetupCors())

	r.POST("/expenses", CreateExpense)
	r.GET("/expenses", GetExpenses)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
