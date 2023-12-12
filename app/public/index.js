let errorMessageElement = document.getElementById("error-message");
let errorMessageElement1 = document.getElementById("error-message1");
let errorMessageElement2 = document.getElementById("error-message2");
let carButton = document.getElementById("searchButton");
let compareButton = document.getElementById("compareButton");

let specsContainer = document.getElementById("car-specs-container");
let imageContainer = document.getElementById("image-container"); 
let priceContainer = document.getElementById("price-container");
let ratingsContainer = document.getElementById("ratings-container");
let recallsContainer = document.getElementById("recalls-container");
let complaintsContainer = document.getElementById("complaints-container");

let car1Header = document.createElement("h6");
let car2Header = document.createElement("h6");

let car1SpecsContainer = document.getElementById("car1Data");
let car2SpecsContainer = document.getElementById("car2Data");

let compareCarsButton = document.getElementById("compareCarsButton");
let formContainer = document.getElementById("form-container");
let comparisonForms = document.getElementById("comparisonForms");
let comparisonResults = document.getElementById("comparisonResults");
let isComparingTwoCars = false; // State flag

// User Clicks Comparison/Single Car Search Button Toggle
compareCarsButton.addEventListener("click", async () => {
    
    isComparingTwoCars = !isComparingTwoCars;

    if(isComparingTwoCars) {
        document.getElementById("car-specs-header").classList.add("hidden");
        document.getElementById("prices-header").classList.add("hidden");
        document.getElementById("car-images-header").classList.add("hidden");
        document.getElementById("car-ratings-header").classList.add("hidden");
        document.getElementById("car-recalls-header").classList.add("hidden");
        document.getElementById("car-complaints-header").classList.add("hidden");


        while(specsContainer.firstChild) {
            specsContainer.removeChild(specsContainer.firstChild);
        }
        
        
        while(priceContainer.firstChild) {
            priceContainer.removeChild(priceContainer.firstChild);
        }

        

        while(imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }

        while(ratingsContainer.firstChild) {
            ratingsContainer.removeChild(ratingsContainer.firstChild);
        }

        while(recallsContainer.firstChild) {
            recallsContainer.removeChild(recallsContainer.firstChild);
        }

        while(complaintsContainer.firstChild) {
            complaintsContainer.removeChild(complaintsContainer.firstChild);
        }

        
        // If currently searching for one car, switch to compare two cars
        compareCarsButton.textContent = "Search For One Car";
        formContainer.style.display = "none"; // Hide the single car search form
        comparisonForms.style.display = "flex"; // Show the comparison forms
        comparisonResults.style.display = "flex"; // Show the comparison results
        compareButton.classList.remove("hidden");
        
    } else {
        car1Header.classList.add("hidden");
        car2Header.classList.add("hidden");


        while(car1SpecsContainer.firstChild) {
            car1SpecsContainer.removeChild(car1SpecsContainer.firstChild);
        }

        while(car2SpecsContainer.firstChild) {
            car2SpecsContainer.removeChild(car2SpecsContainer.firstChild);
        }

        // If currently comparing two cars, switch to search for one car
        compareCarsButton.textContent = "Compare Two Cars";
        formContainer.style.display = "block"; // Show the single car search form
        comparisonForms.style.display = "none"; // Hide the comparison forms
        comparisonResults.style.display = "none"; // Hide the comparison results
        compareButton.classList.add("hidden");
        
    }

});








// Compare Button is Clicked for Two Cars
compareButton.addEventListener("click", async () => {
    
    
    
    car1Header.classList.add("hidden");
    car2Header.classList.add("hidden");


    document.getElementById("loadingMessage").classList.remove("hidden");
    
    yearInput1 = document.getElementById("year-input1").value;
    makeInput1 = document.getElementById("make-input1").value;
    modelInput1 = document.getElementById("model-input1").value;

    yearInput2 = document.getElementById("year-input2").value;
    makeInput2 = document.getElementById("make-input2").value;
    modelInput2 = document.getElementById("model-input2").value;

    let year1 = yearInput1.toUpperCase();
    let make1 = makeInput1.toUpperCase();
    let model1 = modelInput1.toUpperCase();

    let year2 = yearInput2.toUpperCase();
    let make2 = makeInput2.toUpperCase();
    let model2 = modelInput2.toUpperCase();

    


    

    while(car1SpecsContainer.firstChild) {
        car1SpecsContainer.removeChild(car1SpecsContainer.firstChild);
    }

    while(car2SpecsContainer.firstChild) {
        car2SpecsContainer.removeChild(car2SpecsContainer.firstChild);
    }




    if (!yearInput1 || !makeInput1 || !modelInput1 || !yearInput2 || !makeInput2 || !modelInput2){
        document.getElementById("loadingMessage").classList.add("hidden");
        errorMessageElement1.textContent = "Please enter Year, Make, and Model";
        errorMessageElement2.textContent = "Please enter Year, Make, and Model";
        return;
        
    }else if (!yearInput1 || !makeInput1 || !modelInput1){
        document.getElementById("loadingMessage").classList.add("hidden");
        errorMessageElement1.textContent = "Please enter Year, Make, and Model";
        return;
        
    }else if (!yearInput2 || !makeInput2 || !modelInput2){
        document.getElementById("loadingMessage").classList.add("hidden");
        errorMessageElement2.textContent = "Please enter Year, Make, and Model";
        return;
        
    }
    errorMessageElement1.textContent = "";
    errorMessageElement2.textContent = "";


    
    let invalidCar1 = false;
    try{ 
        // Car 1 Specs
        let carSpecResponse = await fetch(`/cars?year=${yearInput1}&make=${makeInput1}&model=${modelInput1}`);
            
            if(!carSpecResponse.ok) {
                if (carSpecResponse.status === 404){
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw new Error("Car not found");
                }
                let errorData = await carSpecResponse.json();
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error(errorData.message || 'An error occurred while fetching the car.');
                
            } 
            let carsData = await carSpecResponse.json();

            if (carsData.length === 0){
                invalidCar1 = true;
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car not found");
            }

            
            
            //Setting up the CAR 1 Header
            car1Header.innerText = `${year1} ${make1} ${model1}`
            car1SpecsContainer.appendChild(car1Header);
            

            
            
                    
            carsData.forEach(car => {
            
                let card = document.createElement("div");
                card.classList.add("spec-card-compare");

                //CAR 1 COMPARE FAVORITE BUTTON
                let favoriteButton = document.createElement("button");
                favoriteButton.textContent = "❤️ Favorite";
                favoriteButton.className = 'favorite-button';
                favoriteButton.onclick = () => handleFavorite(rating.VehicleId); // Adjust this based on where you get the car's unique identifier
                card.appendChild(favoriteButton);


                function handleFavorite(carId) {
                    console.log("Favoriting car with ID:", carId);
                    // Add logic to mark the car as favorite
                    // This could involve making a request to your server or updating local state
                }


                // Add make
                let makeDiv = document.createElement("div");
                makeDiv.innerHTML = `<span class="bold">Make:</span> ${car.make}`;
                card.appendChild(makeDiv);

                // Add model
                let modelDiv = document.createElement("div");
                modelDiv.innerHTML = `<span class="bold">Model:</span> ${car.model}`;
                card.appendChild(modelDiv);

                // Add year
                let yearDiv = document.createElement("div");
                yearDiv.innerHTML = `<span class="bold">Year:</span> ${car.year}`;
                card.appendChild(yearDiv);

                // Add class
                let classDiv = document.createElement("div");
                classDiv.innerHTML = `<span class="bold">Class:</span> ${car.class}`;
                card.appendChild(classDiv);

                // Add fuel type
                let fuelTypeDiv = document.createElement("div");
                fuelTypeDiv.innerHTML = `<span class="bold">Fuel Type:</span> ${car.fuel_type}`;
                card.appendChild(fuelTypeDiv);

                // Add drivetrain
                let driveDiv = document.createElement("div");
                driveDiv.innerHTML = `<span class="bold">Drivetrain:</span> ${car.drive}`;
                card.appendChild(driveDiv);

                // Add cylinders
                let cylinderDiv = document.createElement("div");
                cylinderDiv.innerHTML = `<span class="bold">Cylinders:</span> ${car.cylinders}`;
                card.appendChild(cylinderDiv);

                // Add transmission
                let transDiv = document.createElement("div");
                transDiv.innerHTML = `<span class="bold">Transmission:</span> ${car.transmission}`;
                card.appendChild(transDiv);

                // Add city MPG
                let cityMPGDiv = document.createElement("div");
                cityMPGDiv.innerHTML = `<span class="bold">City MPG:</span> ${car.city_mpg}`;
                card.appendChild(cityMPGDiv);

                // Add highway MPG
                let hwyMPGDiv = document.createElement("div");
                hwyMPGDiv.innerHTML = `<span class="bold">Highway MPG:</span> ${car.highway_mpg}`;
                card.appendChild(hwyMPGDiv);

                // Add combination MPG
                let combMPGDiv = document.createElement("div");
                combMPGDiv.innerHTML = `<span class="bold">Combination MPG:</span> ${car.combination_mpg}`;
                card.appendChild(combMPGDiv);

                // Append the card to the container
                car1SpecsContainer.appendChild(card);
            });   
    }catch(error) {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement1.textContent = error.message || 'An error occurred while fetching the car.';
    };



    
    
    
    let invalidCar2 = false;
    try{ 
        // Car 2 Specs
        let carSpecResponse2 = await fetch(`/cars?year=${yearInput2}&make=${makeInput2}&model=${modelInput2}`);
            
            if(!carSpecResponse2.ok) {
                if (carSpecResponse2.status === 404){
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw new Error("Car not found");
                }
                let errorData = await carSpecResponse2.json();
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error(errorData.message || 'An error occurred while fetching the car.');
                
            } 
            let carsData = await carSpecResponse2.json();

            if (carsData.length === 0){
                invalidCar2 = true;
                if (!invalidCar1){
                    while(car1SpecsContainer.firstChild) {
                        car1SpecsContainer.removeChild(car1SpecsContainer.firstChild);
                    }
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car not found");
            }

            if (invalidCar1){
                throw new Error("Car 1 not found");
            }

            //Setting up CAR 2 Header
            car2Header.innerText = `${year2} ${make2} ${model2}`
            car2SpecsContainer.appendChild(car2Header);

            
            
                    
            carsData.forEach(car => {
            
                let card = document.createElement("div");
                card.classList.add("spec-card-compare");

                //CAR 2 COMPARE FAVORITE BUTTON
                let favoriteButton = document.createElement("button");
                favoriteButton.textContent = "❤️ Favorite";
                favoriteButton.className = 'favorite-button';
                favoriteButton.onclick = () => handleFavorite(rating.VehicleId); // Adjust this based on where you get the car's unique identifier
                card.appendChild(favoriteButton);


                function handleFavorite(carId) {
                    console.log("Favoriting car with ID:", carId);
                    // Add logic to mark the car as favorite
                    // This could involve making a request to your server or updating local state
                }


                // Add make
                let makeDiv = document.createElement("div");
                makeDiv.innerHTML = `<span class="bold">Make:</span> ${car.make}`;
                card.appendChild(makeDiv);

                // Add model
                let modelDiv = document.createElement("div");
                modelDiv.innerHTML = `<span class="bold">Model:</span> ${car.model}`;
                card.appendChild(modelDiv);

                // Add year
                let yearDiv = document.createElement("div");
                yearDiv.innerHTML = `<span class="bold">Year:</span> ${car.year}`;
                card.appendChild(yearDiv);

                // Add class
                let classDiv = document.createElement("div");
                classDiv.innerHTML = `<span class="bold">Class:</span> ${car.class}`;
                card.appendChild(classDiv);

                // Add fuel type
                let fuelTypeDiv = document.createElement("div");
                fuelTypeDiv.innerHTML = `<span class="bold">Fuel Type:</span> ${car.fuel_type}`;
                card.appendChild(fuelTypeDiv);

                // Add drivetrain
                let driveDiv = document.createElement("div");
                driveDiv.innerHTML = `<span class="bold">Drivetrain:</span> ${car.drive}`;
                card.appendChild(driveDiv);

                // Add cylinders
                let cylinderDiv = document.createElement("div");
                cylinderDiv.innerHTML = `<span class="bold">Cylinders:</span> ${car.cylinders}`;
                card.appendChild(cylinderDiv);

                // Add transmission
                let transDiv = document.createElement("div");
                transDiv.innerHTML = `<span class="bold">Transmission:</span> ${car.transmission}`;
                card.appendChild(transDiv);

                // Add city MPG
                let cityMPGDiv = document.createElement("div");
                cityMPGDiv.innerHTML = `<span class="bold">City MPG:</span> ${car.city_mpg}`;
                card.appendChild(cityMPGDiv);

                // Add highway MPG
                let hwyMPGDiv = document.createElement("div");
                hwyMPGDiv.innerHTML = `<span class="bold">Highway MPG:</span> ${car.highway_mpg}`;
                card.appendChild(hwyMPGDiv);

                // Add combination MPG
                let combMPGDiv = document.createElement("div");
                combMPGDiv.innerHTML = `<span class="bold">Combination MPG:</span> ${car.combination_mpg}`;
                card.appendChild(combMPGDiv);

                // Append the card to the container
                car2SpecsContainer.appendChild(card);
            });   
    }catch(error) {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement2.textContent = error.message || 'An error occurred while fetching the car.';
    };


    
    

    

    function getPriceBounds(year) {
        let currentYear = new Date().getFullYear();
        let age = currentYear - year;

        if (age < 5) {
            return { lowerBound: 20000, upperBound: 5000000 }; // Newer used cars
        } else if (age < 10) {
            return { lowerBound: 7000, upperBound: 2000000 }; // Moderately old cars
        } else {
            return { lowerBound: 2000, upperBound: 150000 }; // Older used cars
        }
    }

    function extractPrices(text, year){
        let bounds = getPriceBounds(year);
        // Look for patterns like $XX,XXX.XX or $XX.XX or $XXXX
        let priceRegex = /\$\d{1,3}(,\d{3})*(\.\d{2})?/g;
        let matches = text.match(priceRegex);
        let prices = matches ? matches.map(match => match.replace(/[\$,]/g, '')) : [];
        let filteredPrices = [];
        let price;

        for (price of prices){
            let numericPrice = parseFloat(price);
            if (numericPrice >= bounds.lowerBound && numericPrice <= bounds.upperBound){
                filteredPrices.push(matches[prices.indexOf(price)]);
                if (filteredPrices.length >= 3) break;
            }
        }
        // Return first 3 prices
        return filteredPrices;
    }
    
    
    // If car 1 & car 2 specs were found
    if (!invalidCar1 && !invalidCar2){
        
        // Car 1 Prices
        await fetch(`/webscraper?year=${yearInput1}&make=${makeInput1}&model=${modelInput1}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Price data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
        })
        .then(data => {
            let textData = data.data;
            let prices = extractPrices(textData, yearInput1);
            console.log(prices);

            let numericPrices = prices.map(price => parseFloat(price.replace(/[\$,]/g, '')));
            let minValue = Math.min(...numericPrices);
            let maxValue = Math.max(...numericPrices);

            let formattedMinValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === minValue);
            let formattedMaxValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === maxValue);

            
            
            let priceCard = document.createElement("div");
            priceCard.classList.add("price-card-compare");
            priceCard.textContent = `${formattedMinValue} - ${formattedMaxValue}`;
            car1SpecsContainer.appendChild(priceCard);

            

            
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement1.textContent = error.message || 'An error occurred while fetching the price data.';
        });




        
        
        // Car 1 Image
        await fetch(`/GetImageUrl?searchTerm=&year=${yearInput1}&make=${makeInput1}&model=${modelInput1}`)
        .then(response => {
            if(response.ok) {
                return response.text();
            } else {

                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car image data not found");
            }
        })
        .then(str => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(str, "application/xml");
            let imageUrl = xml.getElementsByTagName("string")[0].textContent;
            console.log(imageUrl);

            let imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.className = 'compare-car-image';
            
            car1SpecsContainer.insertBefore(imageElement, car1SpecsContainer.firstChild);
                
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            console.error("Error:", error);
        });

        

        // Safety Ratings Car 1
        await fetch(`/SafetyRatings?year=${yearInput1}&make=${makeInput1}&model=${modelInput1}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Safety ratings data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
            
        })
        .then(data => {
            let vehicleIds = data.Results.map(result => result.VehicleId);
            return Promise.all(vehicleIds.map(vehicleId => {
                return fetch(`/SafetyRatings/VehicleId/${vehicleId}`)
                .then(response => {
                    if (!response.ok){
                        throw new Error('Vehicle safety rating data not found');
                    }
                    return response.json();
                });
            }));
        })
        .then(allRatings => {
            let imageAppended = false;
            let ratingsFound = false;

            allRatings.forEach(ratingData => {
                
                if (ratingData.Results.length !== 0){
                    ratingsFound = true;
                    
                    let rating = ratingData.Results[0];
                    let card = document.createElement("div");
                    
                    card.classList.add("rating-card-compare");


                    // description
                    let descriptionDiv = document.createElement("div");
                    descriptionDiv.innerHTML = `<span class="bold">Description:</span> ${rating.VehicleDescription}`;
                    card.appendChild(descriptionDiv);

                    // investigation count
                    let investigationDiv = document.createElement("div");
                    investigationDiv.innerHTML = `<span class="bold">Investigation Count:</span> ${rating.InvestigationCount}`;
                    card.appendChild(investigationDiv);
                    
                    // recalls count
                    let recallsDiv = document.createElement("div");
                    recallsDiv.innerHTML = `<span class="bold">Recalls Count:</span> ${rating.RecallsCount}`;
                    card.appendChild(recallsDiv);

                    // complaints count
                    let complaintsDiv = document.createElement("div");
                    complaintsDiv.innerHTML = `<span class="bold">Complaints Count:</span> ${rating.ComplaintsCount}`;
                    card.appendChild(complaintsDiv);

                    // lane departure warning
                    let laneDepDiv = document.createElement("div");
                    laneDepDiv.innerHTML = `<span class="bold">NHTSA Lane Departure Warning:</span> ${rating.NHTSALaneDepartureWarning}`;
                    card.appendChild(laneDepDiv);

                    // forward collision warning
                    let forwColDiv = document.createElement("div");
                    forwColDiv.innerHTML = `<span class="bold">NHTSA Forward Collision Warning</span> ${rating.NHTSAForwardCollisionWarning}`;
                    card.appendChild(forwColDiv);

                    // electronic stability control
                    let elecStabDiv = document.createElement("div");
                    elecStabDiv.innerHTML = `<span class="bold">NHTSA Electronic Stability Control:</span> ${rating.NHTSAElectronicStabilityControl}`;
                    card.appendChild(elecStabDiv);

                    // side pole crash rating
                    let spRatingDiv = document.createElement("div");
                    spRatingDiv.innerHTML = `<span class="bold">Side Pole Crash Rating:</span> ${rating.SidePoleCrashRating}`;
                    card.appendChild(spRatingDiv);

                    // rollover possibility
                    let rolloverPosDiv = document.createElement("div");
                    rolloverPosDiv.innerHTML = `<span class="bold">Rollover Possibility:</span> ${rating.RolloverPossibility}`;
                    card.appendChild(rolloverPosDiv);

                    // rollover rating
                    let rolloverRatingDiv = document.createElement("div");
                    rolloverRatingDiv.innerHTML = `<span class="bold">Rollover Rating:</span> ${rating.RolloverRating}`;
                    card.appendChild(rolloverRatingDiv);

                    // side crash passenger side rating
                    let sideCPSDiv = document.createElement("div");
                    sideCPSDiv.innerHTML = `<span class="bold">Side Crash Passenger Side Rating:</span> ${rating.SideCrashPassengersideRating}`;
                    card.appendChild(sideCPSDiv);

                    // side crash driver side rating
                    let sideCDSDiv = document.createElement("div");
                    sideCDSDiv.innerHTML = `<span class="bold">Side Crash Driver Side Rating:</span> ${rating.SideCrashDriversideRating}`;
                    card.appendChild(sideCDSDiv);

                    // overall side crash rating
                    let overallSCRDiv = document.createElement("div");
                    overallSCRDiv.innerHTML = `<span class="bold">Overall Side Crash Rating:</span> ${rating.OverallSideCrashRating}`;
                    card.appendChild(overallSCRDiv);

                    // front crash passenger side rating
                    let frontCPSDiv = document.createElement("div");
                    frontCPSDiv.innerHTML = `<span class="bold">Front Crash Passenger Side Rating:</span> ${rating.FrontCrashPassengersideRating}`;
                    card.appendChild(frontCPSDiv);

                    // front crash driver side rating
                    let frontCDSDiv = document.createElement("div");
                    frontCDSDiv.innerHTML = `<span class="bold">Front Crash Driver Side Rating:</span> ${rating.FrontCrashDriversideRating}`;
                    card.appendChild(frontCDSDiv);

                    // overall front crash rating
                    let overallFCRDiv = document.createElement("div");
                    overallFCRDiv.innerHTML = `<span class="bold">Overall Front Crash Rating:</span> ${rating.OverallFrontCrashRating}`;
                    card.appendChild(overallFCRDiv);

                    // overall rating
                    let overallRDiv = document.createElement("div");
                    overallRDiv.innerHTML = `<span class="bold">Overall Rating:</span> ${rating.OverallRating}`;
                    card.appendChild(overallRDiv);

                    // Side Pole Picture
                    if (rating.SidePolePicture){
                        let imgSP = document.createElement("img");
                        imgSP.src = rating.SidePolePicture;
                        //imgSP.className = '';
                        imgSP.alt = "Side Pole Picture";
                        card.appendChild(imgSP);
                    }

                    // Side Crash Picture
                    if (rating.SideCrashPicture){
                        let imgSC = document.createElement("img");
                        imgSC.src = rating.SideCrashPicture;
                        //imgSC.className = '';
                        imgSC.alt = "Side Crash Picture";
                        card.appendChild(imgSC);
                    }

                    // Front Crash Picture
                    if (rating.FrontCrashPicture){
                        let imgFC = document.createElement("img");
                        imgFC.src = rating.FrontCrashPicture;
                        //imgFC.className = '';
                        imgFC.alt = "Front Crash Picture";
                        card.appendChild(imgFC);
                    }

                    

                    // create and append download links to crash videos
                    function appendDownloadLink(videoUrl, description) {
                        if (videoUrl) {
                            let downloadLink = document.createElement('a');
                            downloadLink.href = videoUrl;
                            downloadLink.textContent = `Download ${description}`;
                            downloadLink.className = 'download-video-link';
                            downloadLink.download = ""; // suggest download on click
                            card.appendChild(downloadLink); 
                        }
                    }

                    
                    appendDownloadLink(rating.FrontCrashVideo, "Front Crash Video");
                    appendDownloadLink(rating.SideCrashVideo, "Side Crash Video");
                    appendDownloadLink(rating.SidePoleVideo, "Side Pole Video");
                    
                    
                    car1SpecsContainer.appendChild(card);

                    if (!imageAppended ) { //fix this!
                    
                        // image
                        if (rating.VehiclePicture){
                            let img = document.createElement("img");
                            img.src = rating.VehiclePicture;
                            img.className = 'compare-car-image';
                            img.alt = "Vehicle Safety Rating Picture";
                            car1SpecsContainer.insertBefore(img, car1SpecsContainer.firstChild);
                            imageAppended = true; 
                        }
                        
                    }

                } 
                
            });
            
            if (!ratingsFound){
                let noRatingsCard = document.createElement("div");
                noRatingsCard.classList.add("rating-card-compare");


                // No ratings results
                noRatingsCard.innerHTML = `<span class="bold">No Safety Ratings Results From NHTSA</span>`;
                car1SpecsContainer.appendChild(noRatingsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement1.textContent = error.message || 'An error occurred while fetching the ratings data.';
        });

        

        //Recalls Car 1
        await fetch(`/recallsByVehicle?make=${makeInput1}&model=${modelInput1}&year=${yearInput1}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.Count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });
            }
            
        })
        .then(data => {
            let recallsFound = false;

            
                
            if (data.results.length !== 0){
                recallsFound = true;

                data.results.forEach(recall => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("recall-card-compare");


                    // Manufacturer
                    let manufacturerDiv = document.createElement('div');
                    manufacturerDiv.innerHTML = `<span class="bold">Manufacturer:</span> ${recall.Manufacturer}`;
                    card.appendChild(manufacturerDiv);

                    // Make
                    let makeDiv = document.createElement("div");
                    makeDiv.innerHTML = `<span class="bold">Make:</span> ${recall.Make}`;
                    card.appendChild(makeDiv);
                    
                    // Model
                    let modelDiv = document.createElement("div");
                    modelDiv.innerHTML = `<span class="bold">Model:</span> ${recall.Model}`;
                    card.appendChild(modelDiv);

                    // Year
                    let yearDiv = document.createElement("div");
                    yearDiv.innerHTML = `<span class="bold">Year:</span> ${recall.ModelYear}`;
                    card.appendChild(yearDiv);

                    // Report Received Date
                    let reportDateDiv = document.createElement("div");
                    reportDateDiv.innerHTML = `<span class="bold">Report Received Date:</span> ${recall.ReportReceivedDate}`;
                    card.appendChild(reportDateDiv);

                    // Component
                    let componentDiv = document.createElement("div");
                    componentDiv.innerHTML = `<span class="bold">Component:</span> ${recall.Component}`;
                    card.appendChild(componentDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Recall Summary:</span> ${recall.Summary}`;
                    card.appendChild(summaryDiv);

                    // Consequence
                    let consequenceDiv = document.createElement("div");
                    consequenceDiv.innerHTML = `<span class="bold">Consequence:</span> ${recall.Consequence}`;
                    card.appendChild(consequenceDiv);

                    // Remedy
                    let remedyDiv = document.createElement("div");
                    remedyDiv.innerHTML = `<span class="bold">Remedy:</span> ${recall.Remedy}`;
                    card.appendChild(remedyDiv);

                    // Notes
                    let notesDiv = document.createElement("div");
                    notesDiv.innerHTML = `<span class="bold">Notes:</span> ${recall.Notes}`;
                    card.appendChild(notesDiv);

            
                    car1SpecsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!recallsFound){
                let noRecallsCard = document.createElement("div");
                noRecallsCard.classList.add("recall-card-compare");


                // No recalls results
                noRecallsCard.innerHTML = `<span class="bold">No Recall Results From NHTSA</span>`;
                car1SpecsContainer.appendChild(noRecallsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the recalls data.';
        });






        //Complaints Car 1
        await fetch(`/complaintsByVehicle?make=${makeInput1}&model=${modelInput1}&year=${yearInput1}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });
            }
            
        })
        .then(data => {
            
            let complaintsFound = false;

            
                
            if (data.count !== 0){
                complaintsFound = true;
                let complaintsToShow = data.results.slice(0, 50);

                complaintsToShow.forEach(complaint => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("complaint-card-compare");

                    // Date of Complaint Filed
                    let complaintDateDiv = document.createElement("div");
                    complaintDateDiv.innerHTML = `<span class="bold">Complaint Filed Date:</span> ${complaint.dateComplaintFiled}`;
                    card.appendChild(complaintDateDiv);

                    // Date of Incident
                    let incidentDateDiv = document.createElement("div");
                    incidentDateDiv.innerHTML = `<span class="bold">Date of Incident:</span> ${complaint.dateOfIncident}`;
                    card.appendChild(incidentDateDiv);

                    // Crash
                    let crashDiv = document.createElement("div");
                    let crashAnswer;
                    if (complaint.crash === true){
                        crashAnswer = "Yes";
                    }else{
                        crashAnswer = "No";
                    }
                    crashDiv.innerHTML = `<span class="bold">Crash:</span> ${crashAnswer}`;
                    card.appendChild(crashDiv);

                    // Fire
                    let fireDiv = document.createElement("div");
                    let fireAnswer;
                    if (complaint.fire === true){
                        fireAnswer = "Yes";
                    }else{
                        fireAnswer = "No";
                    }
                    fireDiv.innerHTML = `<span class="bold">Fire:</span> ${fireAnswer}`;
                    card.appendChild(fireDiv);

                    // Number of Injuries
                    let injuriesDiv = document.createElement("div");
                    injuriesDiv.innerHTML = `<span class="bold">Number of Injuries:</span> ${complaint.numberOfInjuries}`;
                    card.appendChild(injuriesDiv);

                    // Number of Deaths
                    let deathsDiv = document.createElement("div");
                    deathsDiv.innerHTML = `<span class="bold">Number of Deaths:</span> ${complaint.numberOfDeaths}`;
                    card.appendChild(deathsDiv);

                    // Components
                    let componentsDiv = document.createElement("div");
                    componentsDiv.innerHTML = `<span class="bold">Components:</span> ${complaint.components}`;
                    card.appendChild(componentsDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Complaint Summary:</span> ${complaint.summary}`;
                    card.appendChild(summaryDiv);

                    

            
                    car1SpecsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!complaintsFound){
                let noComplaintsCard = document.createElement("div");
                noComplaintsCard.classList.add("complaint-card-compare");


                // No complaint results
                noComplaintsCard.innerHTML = `<span class="bold">No Complaint Results From NHTSA</span>`;
                car1SpecsContainer.appendChild(noComplaintsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the complaints data.';
        });                    










        // Car 2 Prices
        await fetch(`/webscraper?year=${yearInput2}&make=${makeInput2}&model=${modelInput2}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Price data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
        })
        .then(data => {
            let textData = data.data;
            let prices = extractPrices(textData, yearInput2);
            console.log(prices);

            let numericPrices = prices.map(price => parseFloat(price.replace(/[\$,]/g, '')));
            let minValue = Math.min(...numericPrices);
            let maxValue = Math.max(...numericPrices);

            let formattedMinValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === minValue);
            let formattedMaxValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === maxValue);

            
            
            let priceCard = document.createElement("div");
            priceCard.classList.add("price-card-compare");
            priceCard.textContent = `${formattedMinValue} - ${formattedMaxValue}`;
            car2SpecsContainer.appendChild(priceCard);

            

            
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement2.textContent = error.message || 'An error occurred while fetching the price data.';
        });




        
        
        // Car 2 Image
        await fetch(`/GetImageUrl?searchTerm=&year=${yearInput2}&make=${makeInput2}&model=${modelInput2}`)
        .then(response => {
            if(response.ok) {
                return response.text();
            } else {

                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car image data not found");
            }
        })
        .then(str => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(str, "application/xml");
            let imageUrl = xml.getElementsByTagName("string")[0].textContent;
            console.log(imageUrl);

            let imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.className = 'compare-car-image';
            
            car2SpecsContainer.insertBefore(imageElement, car2SpecsContainer.firstChild);
                
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            console.error("Error:", error);
        });

        

        // Car 2 Safety Ratings
        await fetch(`/SafetyRatings?year=${yearInput2}&make=${makeInput2}&model=${modelInput2}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Safety ratings data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
            
        })
        .then(data => {
            let vehicleIds = data.Results.map(result => result.VehicleId);
            return Promise.all(vehicleIds.map(vehicleId => {
                return fetch(`/SafetyRatings/VehicleId/${vehicleId}`)
                .then(response => {
                    if (!response.ok){
                        throw new Error('Vehicle safety rating data not found');
                    }
                    return response.json();
                });
            }));
        })
        .then(allRatings => {
            let imageAppended = false;
            let ratingsFound = false;

            allRatings.forEach(ratingData => {
                
                if (ratingData.Results.length !== 0){
                    ratingsFound = true;
                    
                    let rating = ratingData.Results[0];
                    let card = document.createElement("div");
                    
                    card.classList.add("rating-card-compare");


                    // description
                    let descriptionDiv = document.createElement("div");
                    descriptionDiv.innerHTML = `<span class="bold">Description:</span> ${rating.VehicleDescription}`;
                    card.appendChild(descriptionDiv);

                    // investigation count
                    let investigationDiv = document.createElement("div");
                    investigationDiv.innerHTML = `<span class="bold">Investigation Count:</span> ${rating.InvestigationCount}`;
                    card.appendChild(investigationDiv);
                    
                    // recalls count
                    let recallsDiv = document.createElement("div");
                    recallsDiv.innerHTML = `<span class="bold">Recalls Count:</span> ${rating.RecallsCount}`;
                    card.appendChild(recallsDiv);

                    // complaints count
                    let complaintsDiv = document.createElement("div");
                    complaintsDiv.innerHTML = `<span class="bold">Complaints Count:</span> ${rating.ComplaintsCount}`;
                    card.appendChild(complaintsDiv);

                    // lane departure warning
                    let laneDepDiv = document.createElement("div");
                    laneDepDiv.innerHTML = `<span class="bold">NHTSA Lane Departure Warning:</span> ${rating.NHTSALaneDepartureWarning}`;
                    card.appendChild(laneDepDiv);

                    // forward collision warning
                    let forwColDiv = document.createElement("div");
                    forwColDiv.innerHTML = `<span class="bold">NHTSA Forward Collision Warning</span> ${rating.NHTSAForwardCollisionWarning}`;
                    card.appendChild(forwColDiv);

                    // electronic stability control
                    let elecStabDiv = document.createElement("div");
                    elecStabDiv.innerHTML = `<span class="bold">NHTSA Electronic Stability Control:</span> ${rating.NHTSAElectronicStabilityControl}`;
                    card.appendChild(elecStabDiv);

                    // side pole crash rating
                    let spRatingDiv = document.createElement("div");
                    spRatingDiv.innerHTML = `<span class="bold">Side Pole Crash Rating:</span> ${rating.SidePoleCrashRating}`;
                    card.appendChild(spRatingDiv);

                    // rollover possibility
                    let rolloverPosDiv = document.createElement("div");
                    rolloverPosDiv.innerHTML = `<span class="bold">Rollover Possibility:</span> ${rating.RolloverPossibility}`;
                    card.appendChild(rolloverPosDiv);

                    // rollover rating
                    let rolloverRatingDiv = document.createElement("div");
                    rolloverRatingDiv.innerHTML = `<span class="bold">Rollover Rating:</span> ${rating.RolloverRating}`;
                    card.appendChild(rolloverRatingDiv);

                    // side crash passenger side rating
                    let sideCPSDiv = document.createElement("div");
                    sideCPSDiv.innerHTML = `<span class="bold">Side Crash Passenger Side Rating:</span> ${rating.SideCrashPassengersideRating}`;
                    card.appendChild(sideCPSDiv);

                    // side crash driver side rating
                    let sideCDSDiv = document.createElement("div");
                    sideCDSDiv.innerHTML = `<span class="bold">Side Crash Driver Side Rating:</span> ${rating.SideCrashDriversideRating}`;
                    card.appendChild(sideCDSDiv);

                    // overall side crash rating
                    let overallSCRDiv = document.createElement("div");
                    overallSCRDiv.innerHTML = `<span class="bold">Overall Side Crash Rating:</span> ${rating.OverallSideCrashRating}`;
                    card.appendChild(overallSCRDiv);

                    // front crash passenger side rating
                    let frontCPSDiv = document.createElement("div");
                    frontCPSDiv.innerHTML = `<span class="bold">Front Crash Passenger Side Rating:</span> ${rating.FrontCrashPassengersideRating}`;
                    card.appendChild(frontCPSDiv);

                    // front crash driver side rating
                    let frontCDSDiv = document.createElement("div");
                    frontCDSDiv.innerHTML = `<span class="bold">Front Crash Driver Side Rating:</span> ${rating.FrontCrashDriversideRating}`;
                    card.appendChild(frontCDSDiv);

                    // overall front crash rating
                    let overallFCRDiv = document.createElement("div");
                    overallFCRDiv.innerHTML = `<span class="bold">Overall Front Crash Rating:</span> ${rating.OverallFrontCrashRating}`;
                    card.appendChild(overallFCRDiv);

                    // overall rating
                    let overallRDiv = document.createElement("div");
                    overallRDiv.innerHTML = `<span class="bold">Overall Rating:</span> ${rating.OverallRating}`;
                    card.appendChild(overallRDiv);

                    // Side Pole Picture
                    if (rating.SidePolePicture){
                        let imgSP = document.createElement("img");
                        imgSP.src = rating.SidePolePicture;
                        //imgSP.className = '';
                        imgSP.alt = "Side Pole Picture";
                        card.appendChild(imgSP);
                    }

                    // Side Crash Picture
                    if (rating.SideCrashPicture){
                        let imgSC = document.createElement("img");
                        imgSC.src = rating.SideCrashPicture;
                        //imgSC.className = '';
                        imgSC.alt = "Side Crash Picture";
                        card.appendChild(imgSC);
                    }

                    // Front Crash Picture
                    if (rating.FrontCrashPicture){
                        let imgFC = document.createElement("img");
                        imgFC.src = rating.FrontCrashPicture;
                        //imgFC.className = '';
                        imgFC.alt = "Front Crash Picture";
                        card.appendChild(imgFC);
                    }

                    

                    // create and append download links to crash videos
                    function appendDownloadLink(videoUrl, description) {
                        if (videoUrl) {
                            let downloadLink = document.createElement('a');
                            downloadLink.href = videoUrl;
                            downloadLink.textContent = `Download ${description}`;
                            downloadLink.className = 'download-video-link';
                            downloadLink.download = ""; // suggest download on click
                            card.appendChild(downloadLink); 
                        }
                    }

                    
                    appendDownloadLink(rating.FrontCrashVideo, "Front Crash Video");
                    appendDownloadLink(rating.SideCrashVideo, "Side Crash Video");
                    appendDownloadLink(rating.SidePoleVideo, "Side Pole Video");
                    
                    
                    car2SpecsContainer.appendChild(card);

                    if (!imageAppended ) { //Fix this!
                    
                        // image
                        if (rating.VehiclePicture){
                            let img = document.createElement("img");
                            img.src = rating.VehiclePicture;
                            img.className = 'compare-car-image';
                            img.alt = "Vehicle Safety Rating Picture";
                            car2SpecsContainer.insertBefore(img, car2SpecsContainer.firstChild);
                            imageAppended = true; 
                        }
                        
                    }

                } 
                
            });
            
            if (!ratingsFound){
                let noRatingsCard = document.createElement("div");
                noRatingsCard.classList.add("rating-card-compare");


                // No ratings results
                noRatingsCard.innerHTML = `<span class="bold">No Safety Ratings Results From NHTSA</span>`;
                car2SpecsContainer.appendChild(noRatingsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement2.textContent = error.message || 'An error occurred while fetching the ratings data.';
        });

        




        //Recalls Car 2
        await fetch(`/recallsByVehicle?make=${makeInput2}&model=${modelInput2}&year=${yearInput2}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.Count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });
            }
            
        })
        .then(data => {
            let recallsFound = false;

            
                
            if (data.results.length !== 0){
                recallsFound = true;

                data.results.forEach(recall => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("recall-card-compare");


                    // Manufacturer
                    let manufacturerDiv = document.createElement('div');
                    manufacturerDiv.innerHTML = `<span class="bold">Manufacturer:</span> ${recall.Manufacturer}`;
                    card.appendChild(manufacturerDiv);

                    // Make
                    let makeDiv = document.createElement("div");
                    makeDiv.innerHTML = `<span class="bold">Make:</span> ${recall.Make}`;
                    card.appendChild(makeDiv);
                    
                    // Model
                    let modelDiv = document.createElement("div");
                    modelDiv.innerHTML = `<span class="bold">Model:</span> ${recall.Model}`;
                    card.appendChild(modelDiv);

                    // Year
                    let yearDiv = document.createElement("div");
                    yearDiv.innerHTML = `<span class="bold">Year:</span> ${recall.ModelYear}`;
                    card.appendChild(yearDiv);

                    // Report Received Date
                    let reportDateDiv = document.createElement("div");
                    reportDateDiv.innerHTML = `<span class="bold">Report Received Date:</span> ${recall.ReportReceivedDate}`;
                    card.appendChild(reportDateDiv);

                    // Component
                    let componentDiv = document.createElement("div");
                    componentDiv.innerHTML = `<span class="bold">Component:</span> ${recall.Component}`;
                    card.appendChild(componentDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Recall Summary:</span> ${recall.Summary}`;
                    card.appendChild(summaryDiv);

                    // Consequence
                    let consequenceDiv = document.createElement("div");
                    consequenceDiv.innerHTML = `<span class="bold">Consequence:</span> ${recall.Consequence}`;
                    card.appendChild(consequenceDiv);

                    // Remedy
                    let remedyDiv = document.createElement("div");
                    remedyDiv.innerHTML = `<span class="bold">Remedy:</span> ${recall.Remedy}`;
                    card.appendChild(remedyDiv);

                    // Notes
                    let notesDiv = document.createElement("div");
                    notesDiv.innerHTML = `<span class="bold">Notes:</span> ${recall.Notes}`;
                    card.appendChild(notesDiv);

            
                    car2SpecsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!recallsFound){
                let noRecallsCard = document.createElement("div");
                noRecallsCard.classList.add("recall-card-compare");


                // No recalls results
                noRecallsCard.innerHTML = `<span class="bold">No Recall Results From NHTSA</span>`;
                car2SpecsContainer.appendChild(noRecallsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the recalls data.';
        });






        //Complaints Car 2
        await fetch(`/complaintsByVehicle?make=${makeInput2}&model=${modelInput2}&year=${yearInput2}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });
            }
            
        })
        .then(data => {
            
            let complaintsFound = false;

            
                
            if (data.count !== 0){
                complaintsFound = true;
                let complaintsToShow = data.results.slice(0, 50);
                
                complaintsToShow.forEach(complaint => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("complaint-card-compare");

                    // Date of Complaint Filed
                    let complaintDateDiv = document.createElement("div");
                    complaintDateDiv.innerHTML = `<span class="bold">Complaint Filed Date:</span> ${complaint.dateComplaintFiled}`;
                    card.appendChild(complaintDateDiv);

                    // Date of Incident
                    let incidentDateDiv = document.createElement("div");
                    incidentDateDiv.innerHTML = `<span class="bold">Date of Incident:</span> ${complaint.dateOfIncident}`;
                    card.appendChild(incidentDateDiv);

                    // Crash
                    let crashDiv = document.createElement("div");
                    let crashAnswer;
                    if (complaint.crash === true){
                        crashAnswer = "Yes";
                    }else{
                        crashAnswer = "No";
                    }
                    crashDiv.innerHTML = `<span class="bold">Crash:</span> ${crashAnswer}`;
                    card.appendChild(crashDiv);

                    // Fire
                    let fireDiv = document.createElement("div");
                    let fireAnswer;
                    if (complaint.fire === true){
                        fireAnswer = "Yes";
                    }else{
                        fireAnswer = "No";
                    }
                    fireDiv.innerHTML = `<span class="bold">Fire:</span> ${fireAnswer}`;
                    card.appendChild(fireDiv);

                    // Number of Injuries
                    let injuriesDiv = document.createElement("div");
                    injuriesDiv.innerHTML = `<span class="bold">Number of Injuries:</span> ${complaint.numberOfInjuries}`;
                    card.appendChild(injuriesDiv);

                    // Number of Deaths
                    let deathsDiv = document.createElement("div");
                    deathsDiv.innerHTML = `<span class="bold">Number of Deaths:</span> ${complaint.numberOfDeaths}`;
                    card.appendChild(deathsDiv);

                    // Components
                    let componentsDiv = document.createElement("div");
                    componentsDiv.innerHTML = `<span class="bold">Components:</span> ${complaint.components}`;
                    card.appendChild(componentsDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Complaint Summary:</span> ${complaint.summary}`;
                    card.appendChild(summaryDiv);

                    

            
                    car2SpecsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!complaintsFound){
                let noComplaintsCard = document.createElement("div");
                noComplaintsCard.classList.add("complaint-card-compare");


                // No complaint results
                noComplaintsCard.innerHTML = `<span class="bold">No Complaint Results From NHTSA</span>`;
                car2SpecsContainer.appendChild(noComplaintsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the complaints data.';
        });












    }else{
        document.getElementById("loadingMessage").classList.add("hidden");

        throw { message: "Car not found" };
    }






    


    // Hide Searching Message
    document.getElementById("loadingMessage").classList.add("hidden");


    
    
    car1Header.classList.remove("hidden");
    car2Header.classList.remove("hidden");

    // Auto scroll down to specs 
    comparisonResults.scrollIntoView({ behavior: 'smooth', block: 'start' }); 

    



}) //end of button click














// Single Car Search
carButton.addEventListener("click", async () => {
    
    
    
    document.getElementById("car-specs-header").classList.add("hidden");
    document.getElementById("prices-header").classList.add("hidden");
    document.getElementById("car-images-header").classList.add("hidden");
    document.getElementById("car-ratings-header").classList.add("hidden");
    document.getElementById("car-recalls-header").classList.add("hidden");
    document.getElementById("car-complaints-header").classList.add("hidden");

    document.getElementById("loadingMessage").classList.remove("hidden");
    
    yearInput = document.getElementById("year-input").value;
    makeInput = document.getElementById("make-input").value;
    modelInput = document.getElementById("model-input").value;

    

    

    

    while(specsContainer.firstChild) {
        specsContainer.removeChild(specsContainer.firstChild);
    }
    
    
    while(priceContainer.firstChild) {
        priceContainer.removeChild(priceContainer.firstChild);
    }

    

    while(imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    while(ratingsContainer.firstChild) {
        ratingsContainer.removeChild(ratingsContainer.firstChild);
    }

    while(recallsContainer.firstChild) {
        recallsContainer.removeChild(recallsContainer.firstChild);
    }

    while(complaintsContainer.firstChild) {
        complaintsContainer.removeChild(complaintsContainer.firstChild);
    }




    if (!yearInput || !makeInput || !modelInput){
        document.getElementById("loadingMessage").classList.add("hidden");
        errorMessageElement.textContent = "Please enter Year, Make, and Model";
        return;
    }
    errorMessageElement.textContent = "";

    
    let invalidCar = false;
    try{ 
        // Car Specs
        let carSpecResponse = await fetch(`/cars?year=${yearInput}&make=${makeInput}&model=${modelInput}`);
            
            if(!carSpecResponse.ok) {
                if (carSpecResponse.status === 404){
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw new Error("Car not found");
                }
                let errorData = await carSpecResponse.json();
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error(errorData.message || 'An error occurred while fetching the car.');
                
            } 
            let carsData = await carSpecResponse.json();

            if (carsData.length === 0){
                invalidCar = true;
                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car not found");
            }

            
            
                    
            carsData.forEach(car => {
            
                let card = document.createElement("div");
                card.classList.add("spec-card");

                //SINGLE SEARCH FAVORITE BUTTON
                let favoriteButton = document.createElement("button");
                favoriteButton.textContent = "❤️ Favorite";
                favoriteButton.className = 'favorite-button';
                favoriteButton.onclick = () => handleFavorite(rating.VehicleId); // Adjust this based on where you get the car's unique identifier
                card.appendChild(favoriteButton);


                function handleFavorite(carId) {
                    console.log("Favoriting car with ID:", carId);
                    // Add logic to mark the car as favorite
                    // This could involve making a request to your server or updating local state
                }


                // Add make
                let makeDiv = document.createElement("div");
                makeDiv.innerHTML = `<span class="bold">Make:</span> ${car.make}`;
                card.appendChild(makeDiv);

                // Add model
                let modelDiv = document.createElement("div");
                modelDiv.innerHTML = `<span class="bold">Model:</span> ${car.model}`;
                card.appendChild(modelDiv);

                // Add year
                let yearDiv = document.createElement("div");
                yearDiv.innerHTML = `<span class="bold">Year:</span> ${car.year}`;
                card.appendChild(yearDiv);

                // Add class
                let classDiv = document.createElement("div");
                classDiv.innerHTML = `<span class="bold">Class:</span> ${car.class}`;
                card.appendChild(classDiv);

                // Add fuel type
                let fuelTypeDiv = document.createElement("div");
                fuelTypeDiv.innerHTML = `<span class="bold">Fuel Type:</span> ${car.fuel_type}`;
                card.appendChild(fuelTypeDiv);

                // Add drivetrain
                let driveDiv = document.createElement("div");
                driveDiv.innerHTML = `<span class="bold">Drivetrain:</span> ${car.drive}`;
                card.appendChild(driveDiv);

                // Add cylinders
                let cylinderDiv = document.createElement("div");
                cylinderDiv.innerHTML = `<span class="bold">Cylinders:</span> ${car.cylinders}`;
                card.appendChild(cylinderDiv);

                // Add transmission
                let transDiv = document.createElement("div");
                transDiv.innerHTML = `<span class="bold">Transmission:</span> ${car.transmission}`;
                card.appendChild(transDiv);

                // Add city MPG
                let cityMPGDiv = document.createElement("div");
                cityMPGDiv.innerHTML = `<span class="bold">City MPG:</span> ${car.city_mpg}`;
                card.appendChild(cityMPGDiv);

                // Add highway MPG
                let hwyMPGDiv = document.createElement("div");
                hwyMPGDiv.innerHTML = `<span class="bold">Highway MPG:</span> ${car.highway_mpg}`;
                card.appendChild(hwyMPGDiv);

                // Add combination MPG
                let combMPGDiv = document.createElement("div");
                combMPGDiv.innerHTML = `<span class="bold">Combination MPG:</span> ${car.combination_mpg}`;
                card.appendChild(combMPGDiv);

                // Append the card to the container
                specsContainer.appendChild(card);
            });   
    }catch(error) {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the car.';
    };


    
    

    

    function getPriceBounds(year) {
        let currentYear = new Date().getFullYear();
        let age = currentYear - year;

        if (age < 5) {
            return { lowerBound: 20000, upperBound: 5000000 }; // Newer used cars
        } else if (age < 10) {
            return { lowerBound: 7000, upperBound: 2000000 }; // Moderately old cars
        } else {
            return { lowerBound: 2000, upperBound: 150000 }; // Older used cars
        }
    }

    function extractPrices(text, year){
        let bounds = getPriceBounds(year);
        // Look for patterns like $XX,XXX.XX or $XX.XX or $XXXX
        let priceRegex = /\$\d{1,3}(,\d{3})*(\.\d{2})?/g;
        let matches = text.match(priceRegex);
        let prices = matches ? matches.map(match => match.replace(/[\$,]/g, '')) : [];
        let filteredPrices = [];
        let price;

        for (price of prices){
            let numericPrice = parseFloat(price);
            if (numericPrice >= bounds.lowerBound && numericPrice <= bounds.upperBound){
                filteredPrices.push(matches[prices.indexOf(price)]);
                if (filteredPrices.length >= 3) break;
            }
        }
        // Return first 3 prices
        return filteredPrices;
    }
    // If car specs were found
    if (!invalidCar){
        
        // Car Prices
        await fetch(`/webscraper?year=${yearInput}&make=${makeInput}&model=${modelInput}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Price data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
        })
        .then(data => {
            let textData = data.data;
            let prices = extractPrices(textData, yearInput);
            console.log(prices);

            let numericPrices = prices.map(price => parseFloat(price.replace(/[\$,]/g, '')));
            let minValue = Math.min(...numericPrices);
            let maxValue = Math.max(...numericPrices);

            let formattedMinValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === minValue);
            let formattedMaxValue = prices.find(price => parseFloat(price.replace(/[\$,]/g, '')) === maxValue);

            
            
            let priceCard = document.createElement("div");
            priceCard.classList.add("price-card");
            priceCard.textContent = `${formattedMinValue} - ${formattedMaxValue}`;
            priceContainer.appendChild(priceCard);

            

            
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the price data.';
        });




        
        
        // Car Image
        await fetch(`/GetImageUrl?searchTerm=&year=${yearInput}&make=${makeInput}&model=${modelInput}`)
        .then(response => {
            if(response.ok) {
                return response.text();
            } else {

                document.getElementById("loadingMessage").classList.add("hidden");
                throw new Error("Car image data not found");
            }
        })
        .then(str => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(str, "application/xml");
            let imageUrl = xml.getElementsByTagName("string")[0].textContent;
            console.log(imageUrl);

            let imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.className = 'car-image';
            
            imageContainer.appendChild(imageElement);
                
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            console.error("Error:", error);
        });

        

        // Safety Ratings
        await fetch(`/SafetyRatings?year=${yearInput}&make=${makeInput}&model=${modelInput}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                if(response.status === 404) {
                    document.getElementById("loadingMessage").classList.add("hidden");
                    throw { message: "Safety ratings data not found" };
                }
                document.getElementById("loadingMessage").classList.add("hidden");
                return response.json().then(error => { throw error });
            }
            
        })
        .then(data => {
            let vehicleIds = data.Results.map(result => result.VehicleId);
            return Promise.all(vehicleIds.map(vehicleId => {
                return fetch(`/SafetyRatings/VehicleId/${vehicleId}`)
                .then(response => {
                    if (!response.ok){
                        throw new Error('Vehicle safety rating data not found');
                    }
                    return response.json();
                });
            }));
        })
        .then(allRatings => {
            let imageAppended = false;
            let ratingsFound = false;

            allRatings.forEach(ratingData => {
                
                if (ratingData.Results.length !== 0){
                    ratingsFound = true;
                    
                    let rating = ratingData.Results[0];
                    let card = document.createElement("div");
                    
                    card.classList.add("rating-card");


                    // description
                    let descriptionDiv = document.createElement("div");
                    descriptionDiv.innerHTML = `<span class="bold">Description:</span> ${rating.VehicleDescription}`;
                    card.appendChild(descriptionDiv);

                    // investigation count
                    let investigationDiv = document.createElement("div");
                    investigationDiv.innerHTML = `<span class="bold">Investigation Count:</span> ${rating.InvestigationCount}`;
                    card.appendChild(investigationDiv);
                    
                    // recalls count
                    let recallsDiv = document.createElement("div");
                    recallsDiv.innerHTML = `<span class="bold">Recalls Count:</span> ${rating.RecallsCount}`;
                    card.appendChild(recallsDiv);

                    // complaints count
                    let complaintsDiv = document.createElement("div");
                    complaintsDiv.innerHTML = `<span class="bold">Complaints Count:</span> ${rating.ComplaintsCount}`;
                    card.appendChild(complaintsDiv);

                    // lane departure warning
                    let laneDepDiv = document.createElement("div");
                    laneDepDiv.innerHTML = `<span class="bold">NHTSA Lane Departure Warning:</span> ${rating.NHTSALaneDepartureWarning}`;
                    card.appendChild(laneDepDiv);

                    // forward collision warning
                    let forwColDiv = document.createElement("div");
                    forwColDiv.innerHTML = `<span class="bold">NHTSA Forward Collision Warning</span> ${rating.NHTSAForwardCollisionWarning}`;
                    card.appendChild(forwColDiv);

                    // electronic stability control
                    let elecStabDiv = document.createElement("div");
                    elecStabDiv.innerHTML = `<span class="bold">NHTSA Electronic Stability Control:</span> ${rating.NHTSAElectronicStabilityControl}`;
                    card.appendChild(elecStabDiv);

                    // side pole crash rating
                    let spRatingDiv = document.createElement("div");
                    spRatingDiv.innerHTML = `<span class="bold">Side Pole Crash Rating:</span> ${rating.SidePoleCrashRating}`;
                    card.appendChild(spRatingDiv);

                    // rollover possibility
                    let rolloverPosDiv = document.createElement("div");
                    rolloverPosDiv.innerHTML = `<span class="bold">Rollover Possibility:</span> ${rating.RolloverPossibility}`;
                    card.appendChild(rolloverPosDiv);

                    // rollover rating
                    let rolloverRatingDiv = document.createElement("div");
                    rolloverRatingDiv.innerHTML = `<span class="bold">Rollover Rating:</span> ${rating.RolloverRating}`;
                    card.appendChild(rolloverRatingDiv);

                    // side crash passenger side rating
                    let sideCPSDiv = document.createElement("div");
                    sideCPSDiv.innerHTML = `<span class="bold">Side Crash Passenger Side Rating:</span> ${rating.SideCrashPassengersideRating}`;
                    card.appendChild(sideCPSDiv);

                    // side crash driver side rating
                    let sideCDSDiv = document.createElement("div");
                    sideCDSDiv.innerHTML = `<span class="bold">Side Crash Driver Side Rating:</span> ${rating.SideCrashDriversideRating}`;
                    card.appendChild(sideCDSDiv);

                    // overall side crash rating
                    let overallSCRDiv = document.createElement("div");
                    overallSCRDiv.innerHTML = `<span class="bold">Overall Side Crash Rating:</span> ${rating.OverallSideCrashRating}`;
                    card.appendChild(overallSCRDiv);

                    // front crash passenger side rating
                    let frontCPSDiv = document.createElement("div");
                    frontCPSDiv.innerHTML = `<span class="bold">Front Crash Passenger Side Rating:</span> ${rating.FrontCrashPassengersideRating}`;
                    card.appendChild(frontCPSDiv);

                    // front crash driver side rating
                    let frontCDSDiv = document.createElement("div");
                    frontCDSDiv.innerHTML = `<span class="bold">Front Crash Driver Side Rating:</span> ${rating.FrontCrashDriversideRating}`;
                    card.appendChild(frontCDSDiv);

                    // overall front crash rating
                    let overallFCRDiv = document.createElement("div");
                    overallFCRDiv.innerHTML = `<span class="bold">Overall Front Crash Rating:</span> ${rating.OverallFrontCrashRating}`;
                    card.appendChild(overallFCRDiv);

                    // overall rating
                    let overallRDiv = document.createElement("div");
                    overallRDiv.innerHTML = `<span class="bold">Overall Rating:</span> ${rating.OverallRating}`;
                    card.appendChild(overallRDiv);

                    // Side Pole Picture
                    if (rating.SidePolePicture){
                        let imgSP = document.createElement("img");
                        imgSP.src = rating.SidePolePicture;
                        //imgSP.className = '';
                        imgSP.alt = "Side Pole Picture";
                        card.appendChild(imgSP);
                    }

                    // Side Crash Picture
                    if (rating.SideCrashPicture){
                        let imgSC = document.createElement("img");
                        imgSC.src = rating.SideCrashPicture;
                        //imgSC.className = '';
                        imgSC.alt = "Side Crash Picture";
                        card.appendChild(imgSC);
                    }

                    // Front Crash Picture
                    if (rating.FrontCrashPicture){
                        let imgFC = document.createElement("img");
                        imgFC.src = rating.FrontCrashPicture;
                        //imgFC.className = '';
                        imgFC.alt = "Front Crash Picture";
                        card.appendChild(imgFC);
                    }

                    

                    // create and append download links to crash videos
                    function appendDownloadLink(videoUrl, description) {
                        if (videoUrl) {
                            let downloadLink = document.createElement('a');
                            downloadLink.href = videoUrl;
                            downloadLink.textContent = `Download ${description}`;
                            downloadLink.className = 'download-video-link';
                            downloadLink.download = ""; // suggest download on click
                            card.appendChild(downloadLink); 
                        }
                    }

                    
                    appendDownloadLink(rating.FrontCrashVideo, "Front Crash Video");
                    appendDownloadLink(rating.SideCrashVideo, "Side Crash Video");
                    appendDownloadLink(rating.SidePoleVideo, "Side Pole Video");
                    
                    
                    ratingsContainer.appendChild(card);

                    if (!imageAppended && imageContainer.children.length <= 1) {
                    
                        // image
                        if (rating.VehiclePicture){
                            let img = document.createElement("img");
                            img.src = rating.VehiclePicture;
                            img.className = 'car-image';
                            img.alt = "Vehicle Safety Rating Picture";
                            imageContainer.appendChild(img);
                            imageAppended = true; 
                        }
                        
                    }

                } 
                
            });
            
            if (!ratingsFound){
                let noRatingsCard = document.createElement("div");
                noRatingsCard.classList.add("rating-card");


                // No ratings results
                noRatingsCard.innerHTML = `<span class="bold">No Safety Ratings Results From NHTSA</span>`;
                ratingsContainer.appendChild(noRatingsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the ratings data.';
        });

        
        
        
        //Recalls
        await fetch(`/recallsByVehicle?make=${makeInput}&model=${modelInput}&year=${yearInput}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.Count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });

                
            }
            
        })
        .then(data => {
            let recallsFound = false;

            
                
            if (data.results.length !== 0){
                recallsFound = true;

                data.results.forEach(recall => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("recall-card");


                    // Manufacturer
                    let manufacturerDiv = document.createElement('div');
                    manufacturerDiv.innerHTML = `<span class="bold">Manufacturer:</span> ${recall.Manufacturer}`;
                    card.appendChild(manufacturerDiv);

                    // Make
                    let makeDiv = document.createElement("div");
                    makeDiv.innerHTML = `<span class="bold">Make:</span> ${recall.Make}`;
                    card.appendChild(makeDiv);
                    
                    // Model
                    let modelDiv = document.createElement("div");
                    modelDiv.innerHTML = `<span class="bold">Model:</span> ${recall.Model}`;
                    card.appendChild(modelDiv);

                    // Year
                    let yearDiv = document.createElement("div");
                    yearDiv.innerHTML = `<span class="bold">Year:</span> ${recall.ModelYear}`;
                    card.appendChild(yearDiv);

                    // Report Received Date
                    let reportDateDiv = document.createElement("div");
                    reportDateDiv.innerHTML = `<span class="bold">Report Received Date:</span> ${recall.ReportReceivedDate}`;
                    card.appendChild(reportDateDiv);

                    // Component
                    let componentDiv = document.createElement("div");
                    componentDiv.innerHTML = `<span class="bold">Component:</span> ${recall.Component}`;
                    card.appendChild(componentDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Recall Summary:</span> ${recall.Summary}`;
                    card.appendChild(summaryDiv);

                    // Consequence
                    let consequenceDiv = document.createElement("div");
                    consequenceDiv.innerHTML = `<span class="bold">Consequence:</span> ${recall.Consequence}`;
                    card.appendChild(consequenceDiv);

                    // Remedy
                    let remedyDiv = document.createElement("div");
                    remedyDiv.innerHTML = `<span class="bold">Remedy:</span> ${recall.Remedy}`;
                    card.appendChild(remedyDiv);

                    // Notes
                    let notesDiv = document.createElement("div");
                    notesDiv.innerHTML = `<span class="bold">Notes:</span> ${recall.Notes}`;
                    card.appendChild(notesDiv);

            
                    recallsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!recallsFound){
                let noRecallsCard = document.createElement("div");
                noRecallsCard.classList.add("recall-card");


                // No recalls results
                noRecallsCard.innerHTML = `<span class="bold">No Recall Results From NHTSA</span>`;
                recallsContainer.appendChild(noRecallsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the recalls data.';
        });






        //Complaints
        await fetch(`/complaintsByVehicle?make=${makeInput}&model=${modelInput}&year=${yearInput}`)
        .then(response => {
            if(response.ok) {
                return response.json();

            } else {
                return response.json().then(data => {
                    // Check if the response JSON has a 'count' property
                    if (data && data.count === 0) {
                        // Handle no results gracefully
                        return data;
                    } else {
                        // Throw an error if it's not the expected 'no results' JSON structure
                        throw new Error('Unexpected response structure from API');
                    }
                }).catch(error => {
                    // Handle cases where the response is not JSON
                    throw new Error('Response from API was not valid JSON');
                });

                
            }
            
        })
        .then(data => {
            
            let complaintsFound = false;

            
                
            if (data.count !== 0){
                complaintsFound = true;
                let complaintsToShow = data.results.slice(0, 50);
                
                complaintsToShow.forEach(complaint => {
                    
                    let card = document.createElement("div");
                    
                    card.classList.add("complaint-card");

                    // Date of Complaint Filed
                    let complaintDateDiv = document.createElement("div");
                    complaintDateDiv.innerHTML = `<span class="bold">Complaint Filed Date:</span> ${complaint.dateComplaintFiled}`;
                    card.appendChild(complaintDateDiv);

                    // Date of Incident
                    let incidentDateDiv = document.createElement("div");
                    incidentDateDiv.innerHTML = `<span class="bold">Date of Incident:</span> ${complaint.dateOfIncident}`;
                    card.appendChild(incidentDateDiv);

                    // Crash
                    let crashDiv = document.createElement("div");
                    let crashAnswer;
                    if (complaint.crash === true){
                        crashAnswer = "Yes";
                    }else{
                        crashAnswer = "No";
                    }
                    crashDiv.innerHTML = `<span class="bold">Crash:</span> ${crashAnswer}`;
                    card.appendChild(crashDiv);

                    // Fire
                    let fireDiv = document.createElement("div");
                    let fireAnswer;
                    if (complaint.fire === true){
                        fireAnswer = "Yes";
                    }else{
                        fireAnswer = "No";
                    }
                    fireDiv.innerHTML = `<span class="bold">Fire:</span> ${fireAnswer}`;
                    card.appendChild(fireDiv);

                    // Number of Injuries
                    let injuriesDiv = document.createElement("div");
                    injuriesDiv.innerHTML = `<span class="bold">Number of Injuries:</span> ${complaint.numberOfInjuries}`;
                    card.appendChild(injuriesDiv);

                    // Number of Deaths
                    let deathsDiv = document.createElement("div");
                    deathsDiv.innerHTML = `<span class="bold">Number of Deaths:</span> ${complaint.numberOfDeaths}`;
                    card.appendChild(deathsDiv);

                    // Components
                    let componentsDiv = document.createElement("div");
                    componentsDiv.innerHTML = `<span class="bold">Components:</span> ${complaint.components}`;
                    card.appendChild(componentsDiv);

                    // Summary
                    let summaryDiv = document.createElement("div");
                    summaryDiv.innerHTML = `<span class="bold">Complaint Summary:</span> ${complaint.summary}`;
                    card.appendChild(summaryDiv);

                    

            
                    complaintsContainer.appendChild(card);

                });
                
                

            } 
                
            if (!complaintsFound){
                let noComplaintsCard = document.createElement("div");
                noComplaintsCard.classList.add("complaint-card");


                // No complaint results
                noComplaintsCard.innerHTML = `<span class="bold">No Complaint Results From NHTSA</span>`;
                complaintsContainer.appendChild(noComplaintsCard);
            }

        
        })
        .catch(error => {
            document.getElementById("loadingMessage").classList.add("hidden");
            errorMessageElement.textContent = error.message || 'An error occurred while fetching the complaints data.';
            
        });






    }else{
        document.getElementById("loadingMessage").classList.add("hidden");
        throw { message: "Car not found" };
    }


    // Hide Searching Message
    document.getElementById("loadingMessage").classList.add("hidden");
    
    // Show Specs
    document.getElementById("car-specs-header").classList.remove("hidden");
    document.getElementById("car-specs-container").classList.remove("hidden");
    

    // Show Prices
    document.getElementById("prices-header").classList.remove("hidden");
    document.getElementById("price-container").classList.remove("hidden");
    

    // Show Images
    document.getElementById("car-images-header").classList.remove("hidden");
    document.getElementById("image-container").classList.remove("hidden");

    // Show Ratings
    document.getElementById("car-ratings-header").classList.remove("hidden");
    document.getElementById("ratings-container").classList.remove("hidden");

    // Show Recalls
    document.getElementById("car-recalls-header").classList.remove("hidden");
    document.getElementById("recalls-container").classList.remove("hidden");

    // Show Complaints
    document.getElementById("car-complaints-header").classList.remove("hidden");
    document.getElementById("complaints-container").classList.remove("hidden");
    
    // Auto scroll down to specs 
    document.getElementById('car-specs-container').scrollIntoView({ behavior: 'smooth', block: 'start' });

    

}) //end of button click