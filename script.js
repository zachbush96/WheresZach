const express = require('express');
const bodyParser = require('body-parser');
//For parsing req.body()
var jsonParser = bodyParser.json();

const app = express();
const PORT = process.env.PORT || 3000;
 
//Hosting index page
app.use(express.static("landing-page"));
app.get('/', (req,res) =>{
 res.sendFile('index.html', {root: __dirname + '/landing-pages'});
});

//Array that holds dicts that contain LAT and LONG cordinates for mapping later
var previousLocations = [];         //[{"lat":18.33333,"long":-21.22222},{"lat":19.5555,"long":-19.32323},{"lat":20.2,"long":19.6656}]
        


//Listening for get requests
 app.post('/api/v1/location', jsonParser ,(req, res) => { 
     console.log(req.body);
     //var cords = req.body.cords;
     //console.log("Got Post. Cords: " + cords);
     res.send("200");
    }); 

app.listen(PORT, () => {
  console.log("Listending on port " + PORT);
});
