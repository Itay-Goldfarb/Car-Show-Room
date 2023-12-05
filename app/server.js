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

//database stuff
let { Pool } = require("pg");
let argon2 = require("argon2")
let cookieParser = require("cookie-parser");
let crypto = require("crypto");
// let env = require("../env.json");
let databaseEnv = require("../databaseEnv.json");
 
app.use(express.static('public/homePage'));
app.use(express.static('app/public'));

let path = require('path');


const pool = new Pool(databaseEnv);

app.use(express.json());
app.use(cookieParser());
//////////

app.get("/cars", (req, res) => {
  
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;

  
  let modelUrl = `${carsUrl}?limit=4&year=${year}&make=${make}&model=${model}`;
  
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

/////DATABASE//
///////////////
pool.connect().then(() => {
  console.log("Connected to database");
});

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

let cookieOptions = {
  httpOnly: true, // JS can't access it
  secure: true, // only sent over HTTPS connections
  sameSite: "strict", // only sent to this domain
};



////SIGN UP/CREATE ACCOUNT
///////////////////
app.post("/create", async (req, res) => {
  let { username, password, email } = req.body;

  // Check if email already exists
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userExists.rows.length > 0) {
      return res.status(400).send("Email already in use");
  }

  let hash;
  try {
      hash = await argon2.hash(password);
  } catch (error) {
      console.error("HASH FAILED", error);
      return res.status(500).send("Error creating account");
  }

  try {
      // console.log("made it here")
      await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, hash]);
      // console.log("made it here123")
      return res.status(200).send("Account created successfully");

  } catch (error) {
      console.error("INSERT FAILED", error);
      return res.status(500).send("Error creating account");
  }
});



//SESSION FOR LOGGIN IN
let session = require('express-session');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // JS can't access it
      secure: true, // only sent over HTTPS connections
      sameSite: "strict",
    }
    // Add other session configuration as needed
}));


//LOGIN TO YOUR ACCOUNT
///////////////////////
app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
      // Retrieve user from the database
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

      if (result.rows.length > 0) {
          const user = result.rows[0];

          // Compare hashed password
          if (await argon2.verify(user.password, password)) {
              req.session.user = { username: username }; // Or other user details
              res.status(200).send("Login successful");
          } else {
              // Password does not match
              res.status(401).send("Invalid credentials");
          }
      } else {
          // User not found
          res.status(401).send("Invalid credentials");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
  }
});

//check status before accessning something
app.get('/check-login-status', (req, res) => {
  if (req.session && req.session.user) {
      // The user is logged in
      res.json({ loggedIn: true, user: req.session.user });
  } else {
      // The user is not logged in
      res.json({ loggedIn: false });
  }
});


///AUTHORIZATION MIDDLEWARE
let authorize = (req, res, next) => {
  if (req.session && req.session.user) {
      next(); // User is logged in, proceed to the next middleware or route handler
  } else {
      res.status(403).send("Unauthorized"); // User is not logged in
  }
};


app.get("/private", authorize, (req, res) => {
  // This route is now protected and only accessible to logged-in users
  res.send("A private message");
});






function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
      return next();
  } else {
      // Redirect to login page, or send an unauthorized response
      return res.redirect('/login'); // Or res.status(401).send("Unauthorized");
  }
}

//TEMPORARY WELCOME PAGE
app.get("/welcome", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage', 'welcome.html'));
});


// Server-side: New route to get current user's name
app.get("/current-user", (req, res) => {
  if (!req.session.user) {
      return res.status(401).send("Not logged in");
  }
  res.json({ username: req.session.user.username });
});




//LOGOUT
//////////
app.post("/logout", (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              console.error("Logout Error:", err);
              res.status(500).send("Internal Server Error");
          } else {
              res.clearCookie('connect.sid'); // Adjust if using a different session cookie name
              res.status(200).send("Logged out successfully");
          }
      });
  } else {
      res.status(200).send("No session to log out from");
  }
});



app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
