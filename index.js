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
    const params = {
        q: cityName,
        appid: apiKey,
    }
    try {
        const result =  await axios.get(API_URL_CITY, {params: params})
        console.log(result.data[0].lat)
        console.log(result.data[0].lon)

    } catch(error){

    }
});


/* Server  */
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})
