package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

// Joke contains information about a single Joke
type Country struct {
	ID          string `json:"id" binding:"required"`
	CountryCode string `json:"countryCode"`
	CapitalCity string `json:"capitalCity" binding:"required"`
	Population  int64  `json:"population"`
}

type CurrencyJSON struct {
	Symbol string `json:"symbol"`
	Price  string `json:"price_usd"`
}

type Currency struct {
	Code   string `json:"code"`
	Name   string `json:"name"`
	Symbol string `json:"symbol"`
}

type Coordinate struct {
}

type CountryJSON struct {
	Name         string     `json:"name"`
	Capital      string     `json:"capital"`
	Currencies   []Currency `json:"currencies"`
	Population   int64      `json:"population"`
	Region       string     `json:"region"`
	Subregion    string     `json:"subregion"`
	Latlng       []float64  `json:"latlng"`
	FlagPath     string     `json:"flag"`
	Alpha2Code   string     `json:"alpha2Code"`
	Alpha3Code   string     `json:"alpha3Code"`
	CallingCodes []string   `json:"callingCodes"`
}

type ResponseObject struct {
	Found             bool              `json:"found"`
	Message           string            `json:"message"`
	Results           []CountryJSON     `json:"results"`
	RequestParameters RequestParameters `json:"requestParameters"`
}
type RequestParameters struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

//var listTypes = ["country", "continent"]
var currentParameters RequestParameters
var countries []CountryJSON
var router *gin.Engine
var countriesAPIRoot = "https://restcountries.eu/rest/v2/"
var defaultContinent = "oceania"
var currenciesAPIPath = "https://api.coinmarketcap.com/v1/ticker/?limit=0"

func main() {
	loadCountries()

	// Set the router as the default one shipped with Gin
	router = gin.Default()
	router.Use(middleware)

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./views/public", true)))
	initializeRoutes()

	// Start and run the server
	router.Run(":8080")
}

func initializeRoutes() {
	// Setup route group for the API
	api := router.Group("/api")
	//api.POST("", handleVerification)
	//api.OPTIONS("", handleVerification)
	api.GET("", handleGet)

	api.GET("/countries", CountryHandler)
	api.GET("/countries/country/:countryCode", GetCountryFromCountryCode)
	api.GET("/countries/continent/:continentName", GetContinentFromContinentName)
	api.POST("/countries/addPeople/:countryCode", AddPeople)

}

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

func handleGet(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Ok",
	})
}

// Countries retrieves a list of available countries
func CountryHandler(c *gin.Context) {
	var response ResponseObject

	if len(countries) > 0 {
		response.Found = true
		response.Results = countries
	} else {
		response.Found = false
		response.Message = "No country found"
	}
	response.RequestParameters = currentParameters

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, response)
}

func GetCountry(countryCode string, countryArray *[]CountryJSON) *CountryJSON {
	var countryRequested *CountryJSON = &CountryJSON{}

	for i, country := range *countryArray {
		if country.Alpha2Code == countryCode {
			countryRequested = &(*countryArray)[i]
			break
		}
	}

	return countryRequested
}

func (country *CountryJSON) addPeopleToPop(additionalPeople *int64) {
	fmt.Print(country.Population, "\n")
	if additionalPeople != nil {
		country.Population = country.Population + *additionalPeople
	} else {
		country.Population++
	}
}

func AddPeople(c *gin.Context) {
	var countryCode = c.Param("countryCode")
	var additionalPeople int64 = 60
	countryRequested := GetCountry(countryCode, &countries)
	countryRequested.addPeopleToPop(&additionalPeople)

	c.JSON(http.StatusOK, &countries)
}

// GetCountryFromCountryCode
func GetCountryFromCountryCode(c *gin.Context) {
	countryCode := c.Param("countryCode")
	var countryRequested = *GetCountry(countryCode, (&countries))
	var response ResponseObject

	if countryRequested.Alpha2Code != "" {
		response.Found = true
		response.Results = []CountryJSON{countryRequested}
	} else {
		response.Found = false
		response.Message = "Country not found"
	}
	response.RequestParameters = RequestParameters{"country", countryCode}

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, response)
}

func GetContinentFromContinentName(c *gin.Context) {
	var continentName = c.Param("continentName")
	var url = countriesAPIRoot + "region/" + continentName
	var countriesRequested = sendExtRequest(url)
	var response ResponseObject

	if len(countriesRequested) > 0 {
		response.Found = true
		response.Results = countriesRequested
	} else {
		response.Found = false
		response.Message = "Continent not found"
	}
	response.RequestParameters = RequestParameters{"continent", continentName}

	c.JSON(http.StatusOK, response)
}

func sendExtRequest(url string) []CountryJSON {
	target := new([]CountryJSON)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	json.NewDecoder(resp.Body).Decode(target)
	return *target
}

func loadCountries() {
	url := countriesAPIRoot + "region/" + defaultContinent
	var countriesRequested = sendExtRequest(url)

	currentParameters = RequestParameters{"continent", defaultContinent}
	countries = countriesRequested
}
