const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var jsonParser = bodyParser.json();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
 
//Hosting index page
app.use(express.static("landing-page"));
app.get('/', (req,res) =>{
 res.sendFile('index.html', {root: __dirname + '/landing-pages'});
});

//Array that holds dicts that contain LAT and LONG cordinates for mapping later
var previousLocations = [{"lat":18.33333,"long":-21.22222},{"lat":19.5555,"long":-19.32323},{"lat":20.2,"long":19.6656}];         //[{"lat":18.33333,"long":-21.22222},{"lat":19.5555,"long":-19.32323},{"lat":20.2,"long":19.6656}]
        


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
     
     previousLocations.push({"lat":lat,"long":long})

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
