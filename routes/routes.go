package routes

import (
	"bytes"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var assignedIDs []string

func middleware(c *gin.Context) {
	if c.Request.Method == "OPTIONS" || c.Request.Method == "GET" || c.Request.Method == "POST" {
		c.Header("Allow", "POST, GET, OPTIONS")
		c.Header("Access-Control-Allow-Origin", "http://localhost:3006")
		c.Header("Access-Control-Allow-Headers", "origin, content-type, accept")
		c.Header("Content-Type", "application/json")
		c.Status(http.StatusOK)
	}

	c.Next()
}

func DefineUniqueID() string {
	var id string
	var unique = true
	var idLength int = 8
	var limit int = 0

	for ok := true; ok; ok = ((unique == false) || (limit > 10)) {
		id = GenerateRandomID(idLength)
		unique = true
		for _, idGenerated := range assignedIDs {
			if id == idGenerated {
				unique = false
			}
		}
		if unique == true {
			assignedIDs = append(assignedIDs, id)
		}
		limit = limit + 1
	}

	return id
}

func GenerateRandomID(l int) string {
	var length int = l
	var char string = "abcdefghijklmnopqrstuvwxyz0123456789-_!?"
	var id string = ""
	var buffer bytes.Buffer
	charRunes := []rune(char)

	for i := 0; i < length; i++ {
		source := rand.NewSource(time.Now().UnixNano() + int64(i))
		randomNumber := rand.New(source).Intn(len(charRunes))
		randomCase := rand.New(source).Intn(2)
		randomChar := string(charRunes[randomNumber])
		if randomCase%2 == 0 {
			randomChar = strings.ToUpper(randomChar)
		}
		buffer.WriteString(randomChar)
	}
	id = buffer.String()
	fmt.Println(id)

	return string(id)
}
