import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import dotenv from "dotenv"

dotenv.config()
const apiKey = process.env.API_KEY

const app = express()
const port = 3000
const API_URL_CITY = "http://api.openweathermap.org/geo/1.0/direct"
const API_URL_WEATHER = "https://api.openweathermap.org/data/2.5/weather"

/* CSS Path */
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/", async(req, res) => {
    const cityName = req.body.cityName;
    const cityParams = {
        q: cityName,
        appid: apiKey,
    }
    try {
        const geoResult =  await axios.get(API_URL_CITY, {params: cityParams})
        const Latitude = geoResult.data[0].lat
        const Longitude = geoResult.data[0].lon
        const cityResult = geoResult.data[0].local_names.en

        const weatherParams = {
            lat: Latitude,
            lon: Longitude,
            appid: apiKey,
        }

        const weatherResult = await axios.get(API_URL_WEATHER, {params: weatherParams})
        const tempResult = Math.floor((weatherResult.data.main.temp)-273,15)
        const humResult = weatherResult.data.main.humidity
        const windResult = weatherResult.data.wind.speed

        res.render("index.ejs", {
            temp: tempResult,
            city: cityResult,
            hum_value: humResult,
            wind_value: windResult
        })

    } catch(error){
        res.send("404 nahuj poka")
    }
});


/* Server  */
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})
