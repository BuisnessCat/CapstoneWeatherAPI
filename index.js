import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import dotenv from "dotenv"

dotenv.config()
const apiKey = process.env.API_KEY

const app = express()
const port = 3000

// All required API URL for comfort
const API_URL_CITY = "http://api.openweathermap.org/geo/1.0/direct"
const API_URL_WEATHER = "https://api.openweathermap.org/data/2.5/weather"

// CSS/images Path
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// EJS Upload to server
app.get("/", (req, res) => {
    res.render("index.ejs")
})

// Post method for the search button
app.post("/", async(req, res) => {
    const cityName = req.body.cityName;
    
    // Params for GeoAPi
    const cityParams = {
        q: cityName,
        appid: apiKey,
    }
    try {
        // API request with axios.get method --> to get lat, lon and name of the city 
        const geoResult =  await axios.get(API_URL_CITY, {params: cityParams})
        const Latitude = geoResult.data[0].lat
        const Longitude = geoResult.data[0].lon
        const cityResult = geoResult.data[0].local_names.en

        // Params for WeatherAPI
        const weatherParams = {
            lat: Latitude,
            lon: Longitude,
            appid: apiKey,
        }

        // API request with axios.get method --> to get data for current weather
        const weatherResult = await axios.get(API_URL_WEATHER, {params: weatherParams})
        const tempResult = Math.floor((weatherResult.data.main.temp)-273,15)
        const humResult = weatherResult.data.main.humidity
        const windResult = weatherResult.data.wind.speed

        const weatherId = weatherResult.data.weather[0].id
        console.log(weatherId)

        // This part of the code is needed to find a certain picture by the weather code we get from the Axios Get method
        let imagePath

        switch (true) {
            case (weatherId > 299 && weatherId < 322):
                imagePath = "/images/drizzle.png"
                break;
            case (weatherId > 499 && weatherId < 532):
                imagePath = "/images/rain.png";
                break;
            case (weatherId > 599 && weatherId < 623):
                imagePath = "/image/snow.png"
                break;
            case (weatherId > 700 && weatherId < 782):
                imagePath = "/images/mist.png";
                break;
            case (weatherId > 800 && weatherId < 805):
                imagePath = "/images/clouds.png";
                break;
            case weatherId === 800:
                imagePath = "/images/clear.png";
                break
        }
        
        
        // Update EJS file with all data we got from API
        res.render("index.ejs", {
            image: imagePath,
            temp: tempResult,
            city: cityResult,
            hum_value: humResult,
            wind_value: windResult,
        })

    } catch(error){
        console.log(error.response.data)
    }
});


// Server launch
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})
