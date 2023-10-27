let axios = require("axios");
let express = require("express");
let app = express();
let apiFile = require("../env.json");
let apiKey = apiFile["api_key"]; 
let carsUrl = apiFile["api_cars_url"]; 
let webscraperUrl = apiFile["api_webscrape_url"]; 
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
      'X-Api-Key': `${apiKey}`
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
      'X-Api-Key': `${apiKey}`
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





app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
