let axios = require("axios");
let express = require("express");
let app = express();
let apiFile = require("../env.json");
let apiKey = apiFile["api_key"]; 
let baseUrl = apiFile["api_url"]; 
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));


app.get("/cars", (req, res) => {
  
  let model = req.query.model;
  
  let modelUrl = `${baseUrl}?limit=2&model=${model}`;
  
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



app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
