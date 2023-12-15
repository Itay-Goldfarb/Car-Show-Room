let axios = require("axios");
let express = require("express");
let app = express();
let apiFile = require("../env.json");
let apiKey1 = apiFile["api_key1"]; 
let carsUrl = apiFile["api_cars_url"]; 
let carImagesUrl = apiFile["api_car_images"];
let webscraperUrl = apiFile["api_webscrape_url"]; 
let safetyRatingsUrl = apiFile["api_nhtsa_ratings"];
let recallsUrl = apiFile["api_nhtsa_recalls"];
let complaintsUrl = apiFile["api_nhtsa_complaints"];
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



//Recalls
app.get("/recallsByVehicle", (req, res) => {
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;
  
  let fullRecallsUrl = `${recallsUrl}?make=${make}&model=${model}&modelYear=${year}`;
  
  console.log(fullRecallsUrl);


  axios.get(fullRecallsUrl)
  .then(response => {
    console.log("Status code:", response.status);
    console.log("Response:", response.data);
    
    console.log("Requesting:", fullRecallsUrl);
      
    res.status(200).json(response.data);
      
    
    
  })
  .catch(error => {
      //console.error("Error during axios request:", error);
      //res.status(500).send("Internal Server Error");

      console.error("Error during axios request:", error.response || error.message || error);
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.Count === 0) {
          // Handle the case where a 400 status code is returned when there are no results
          res.status(200).json({ Count: 0, results: [], Message: 'No recalls found' });
      } else {
          res.status(500).send("Internal Server Error");
      }
  });
});




//Complaints
app.get("/complaintsByVehicle", (req, res) => {
  let year = req.query.year;
  let make = req.query.make;
  let model = req.query.model;
  
  let fullComplaintsUrl = `${complaintsUrl}?make=${make}&model=${model}&modelYear=${year}`;
  
  console.log(fullComplaintsUrl);


  axios.get(fullComplaintsUrl)
  .then(response => {
    console.log("Status code:", response.status);
    console.log("Response:", response.data);
    
    console.log("Requesting:", fullComplaintsUrl);
      
    res.status(200).json(response.data);
      
    
    
  })
  .catch(error => {

      console.error("Error during axios request:", error.response || error.message || error);
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.count === 0) {
          // Handle the case where a 400 status code is returned when there are no results
          res.status(200).json({ count: 0, results: [], message: 'No complaints found' });
      } else {
          res.status(500).send("Internal Server Error");
      }
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
      secure: false, // only sent over HTTPS connections
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
      return res.redirect('/index.html'); // Or res.status(401).send("Unauthorized");
  }
}

//TEMPORARY WELCOME PAGE
app.get("/welcome", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage', 'welcome.html'));
  // console.log(req.session.user.username); DEBUG
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




//FAVORITE A CAR
app.post('/add-favorite-car', async (req, res) => {
  let carData = req.body;
  let username = req.session.user.username; // Assuming the username is stored in the session

  pool.query('SELECT id FROM users WHERE username = $1', [username])
      .then(async result => {
          if (result.rows.length > 0) {
              let userId = result.rows[0].id;

              try {
                  await pool.query('INSERT INTO FavoriteCars (UserID, CarMake, CarModel, CarYear, CarClass, FuelType, Drivetrain, Cylinders, Transmission, CityMPG, HighwayMPG, CombinationMPG) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [userId, carData.make, carData.model, carData.year, carData.class, carData.fuel_type, carData.drive, carData.cylinders, carData.transmission, carData.city_mpg, carData.highway_mpg, carData.combination_mpg]);
                  return res.status(200).send("Car favorited successfully");
              } catch (error) {
                  console.error("INSERT FAILED", error);
                  return res.status(500).send("Error favoriting car");
              }

          } else {
              return res.status(404).send("User not found");
          }
      })
      .catch(error => {
          console.error('Error fetching user ID:', error);
          return res.status(500).send("Error fetching user ID");
      });
  
});



// GET the user's favorited cars
app.get('/get-favorite-cars', async (req, res) => {
  let username = req.session.user.username; // Assuming the username is stored in the session

  pool.query('SELECT id FROM users WHERE username = $1', [username])
      .then(async result => {
          if (result.rows.length > 0) {
              let userId = result.rows[0].id;

              try {
                  const favoriteCars = await pool.query('SELECT * FROM FavoriteCars WHERE UserID = $1', [userId]);
                  res.status(200).json(favoriteCars.rows);
              } catch (error) {
                  console.error("Error fetching favorite cars", error);
                  res.status(500).send("Error fetching favorite cars");
              }
          } else {
              res.status(404).send("User not found");
          }
      })
      .catch(error => {
          console.error('Error fetching user ID:', error);
          res.status(500).send("Error fetching user ID");
      });
});


//DELETE THE FAVORITE CAR
app.delete('/delete-favorite-car/:carId', async (req, res) => {
  let username = req.session.user.username; // Assuming the username is stored in the session
  let carId = req.params.carId; // Get the car ID from the request parameters

  pool.query('SELECT id FROM users WHERE username = $1', [username])
      .then(async result => {
          if (result.rows.length > 0) {
              let userId = result.rows[0].id;

              try {
                  // Delete the car from FavoriteCars where the UserID matches and the car ID matches
                  await pool.query('DELETE FROM FavoriteCars WHERE UserID = $1 AND FavoriteCarID = $2', [userId, carId]);
                  res.status(200).send("Favorite car deleted successfully");
              } catch (error) {
                  console.error("Error deleting favorite car", error);
                  res.status(500).send("Error deleting favorite car");
              }
          } else {
              res.status(404).send("User not found");
          }
      })
      .catch(error => {
          console.error('Error fetching user ID:', error);
          res.status(500).send("Error fetching user ID");
      });
});












app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
