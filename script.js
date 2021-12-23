const express = require('express');
const bodyParser = require('body-parser');
fs = require('fs');
const readline = require('readline');
//connect to supabase database
const supabase = require('@supabase/supabase-js');
const res = require('express/lib/response');

const supabaseClient = supabase.createClient('https://rlbquimdrbabjxsckgzy.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTM0MTU3MSwiZXhwIjoxOTU0OTE3NTcxfQ.g0tDGpW8nYAmAkUcIO-Pj9ielw_P4qu5DhqywhGI4Hc');
var jsonParser = bodyParser.json();
const app = express();
const PORT = process.env.PORT || 3000;



//Hosting index page
app.use(express.static("landing-page"));

//CORS Helping
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.get('/', (req,res) =>{
 res.sendFile('index.html', {root: __dirname + '/landing-pages'});
});


//Array that holds dicts that contain LAT and LONG cordinates for mapping later
var previousLocations = [];         //[{"lat":18.33333,"long":-21.22222},{"lat":19.5555,"long":-19.32323},{"lat":20.2,"long":19.6656}]



//Accepts json location object and saves it to supabase database
function saveLocationsToDatabase(locationObject){
  console.log("saving to DB");
  console.log(locationObject);
  supabaseClient
  .from('Locations')
  .insert(locationObject)
  .then(response => {
    console.log("Saved to DB");
    console.log(response);
  }).catch(err => {
    console.log("Error saving to DB");

  });

};

//Return locations from supabase database
function getLocationsFromDatabase(){
  console.log("getting from DB");
  supabaseClient
  .from('Locations')
  .select('*')
  .then(data => {
    //console.log("Got from DB");
    for(location in data.body){
      locationObject = {'Lat':data.body[location].Lat, 'Long':data.body[location].Long};
      previousLocations.push(locationObject);
    }
    return data.body;
  }).catch(err => {
    console.log("Error getting from DB");
  });
};
getLocationsFromDatabase();



//Listening for get requests
 app.post('/api/v1/location', jsonParser ,(req, res) => { 
    console.log("Body --> "+req.body);
    var cords = req.body.cords;
    console.log("typeof cords -->" + typeof cords);
    cords = cords.split(":");
    console.log("Cords after being split : : "+typeof cords);
    console.log(cords);

    //Setting lat and long variables
    var lat = cords[1].slice(1,-8);
    var long = cords[2].slice(1,-2);
    console.log("lat: " + lat);
    console.log("long: " + long);
     
    previousLocations.push({"Lat":lat,"Long":long,"Timestamp":((new Date()).toISOString()).toLocaleString('zh-TW')})
    saveLocationsToDatabase({"Lat":lat,"Long":long,"Timestamp": ((new Date()).toISOString()).toLocaleString('zh-TW')});
    
    res.send("200");
    }); 

app.get('/api/v1/locations', (req,res) => {
    console.log("Got GET Request");
    console.log("PREVIOUS LOCATIONS: "+ previousLocations);
    res.send(previousLocations);
});

app.listen(PORT, () => {
  console.log("Listending on port " + PORT);
});
