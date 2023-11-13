let axios = require("axios");
let express = require("express");
let app = express();
let apiFile = require("../env.json");
let apiKey1 = apiFile["api_key1"]; 
let carsUrl = apiFile["api_cars_url"]; 
let carImagesUrl = apiFile["api_car_images"];
let webscraperUrl = apiFile["api_webscrape_url"]; 
let safetyRatingsUrl = apiFile["api_nhtsa_ratings"];
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));




app.get("/cars", (req, res) => {
  
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;

  
  let modelUrl = `${carsUrl}?limit=2&year=${year}&make=${make}&model=${model}`;
  
  axios.get(modelUrl, {
    headers: {
      'X-Api-Key': `${apiKey1}`
    }
  })
  .then(response => {
    if (response.data){
      res.status(200).json(response.data);
      
    }
    
  })
  .catch(error => {
    if (error.response) {
      res.status(404).json({ "error": "car not found" });
    }else{
      res.status(500).json({ "error": "Internal Server Error" });
    }
  });
  
});




app.get("/webscraper", (req, res) => {

  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;
  
  let site = `https://google.com/search?q=${year}${make}${model}price`;
  
  let scrapeUrl = `${webscraperUrl}?url=${site}&text_only=true`
  

  axios.get(scrapeUrl, {
    headers: {
      'X-Api-Key': `${apiKey1}`
    }
  })
  .then(response => {
    if (response.data){
      res.status(200).json(response.data);
      console.log("Requesting:", scrapeUrl);
    }
    
  })
  .catch(error => {
    if (error.response) {
      res.status(404).json({ "error": "data not found" });
    }else{
      res.status(500).json({ "error": "Internal Server Error" });
      
    }
  });
  
});



app.get("/GetImageUrl", (req, res) => {
  
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;
  
  let imagesUrl = `${carImagesUrl}?searchTerm=${year}+${make}+${model}`;
  

  axios.get(imagesUrl)
  .then(response => {
    console.log("Status code:", response.status);
    console.log("Response:", response.data);
    
    console.log("Requesting:", imagesUrl);
      
    res.type('xml').send(response.data);
      
    
    
  })
  .catch(error => {
      console.error("Error during axios request:", error);
      res.status(500).send("Internal Server Error");
  });
  
});





// For vehicleId
app.get("/SafetyRatings", (req, res) => {
  
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;
  
  let ratingsUrl = `${safetyRatingsUrl}/modelyear/${year}/make/${make}/model/${model}`;
  
  console.log(ratingsUrl);

  axios.get(ratingsUrl)
  .then(response => {
    console.log("Status code:", response.status);
    console.log("Response:", response.data);
    
    console.log("Requesting:", ratingsUrl);
      
    res.status(200).json(response.data);
      
    
    
  })
  .catch(error => {
      console.error("Error during axios request:", error);
      res.status(500).send("Internal Server Error");
  });
  
});


// For detailed safety ratings
app.get("/SafetyRatings/VehicleId/:vehicleId", (req, res) => {
  let vehicleId = req.params.vehicleId;
  
  let detailedRatingsUrl = `${safetyRatingsUrl}/VehicleId/${vehicleId}`;
  
  console.log(detailedRatingsUrl);

  axios.get(detailedRatingsUrl)
  .then(response => {
    console.log("Status code:", response.status);
    console.log("Response:", response.data);
    
    console.log("Requesting:", detailedRatingsUrl);
      
    res.status(200).json(response.data);
      
    
    
  })
  .catch(error => {
      console.error("Error during axios request:", error);
      res.status(500).send("Internal Server Error");
  });
  
});



app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
