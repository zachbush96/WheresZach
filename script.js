const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
 
//Hosting index page
app.use(express.static("landing-page"))
app.get('/', (req,res) =>{
 res.sendFile('index.html', {root: __dirname + '/landing-pages'});
});

//Array that holds dicts that contain LAT and LONG cordinates for mapping later
var previousLocations = []         //[{"lat":18.33333,"long":-21.22222},{"lat":19.5555,"long":-19.32323},{"lat":20.2,"long":19.6656}]
        


//Listening for get requests
 app.post('/api/v1/location', (req, res) => { 
    //Make sure request contains Dict
    if(!req.query.zip){res.send("NO DATA SUMBITTED")}
    
    **Stopped Here***
    //Getting setup to send get request
    const api_url = "https://api.openweathermap.org/data/2.5/weather?zip=";
    const appid = "&units=imperial&appid="+process.env.OpenWeatherAPIKey;
    fetch(api_url + req.query.zip + appid)
    //take the response and convert to json 
    .then(res => res.json())
    //Using that json console.log the result 
    .then(json => {
        console.log(json);
        //Send json object back as the response to the original get request
        res.send(json);
    })
});
 

app.listen(PORT, () => {
  console.log("Listending on port " + PORT)
});
