package main

import "github.com/gin-gonic/gin"

func main() {
	InitDB()

	r := gin.Default()
	r.Use(SetupCors())

	r.POST("/expenses", CreateExpense)
	r.GET("/expenses", GetExpenses)

	r.Run(":8080")
}
