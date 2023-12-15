document.addEventListener('DOMContentLoaded', async function() {

    try {
        const response = await fetch('/current-user');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('userName').textContent = data.username;
        } else {
            // Handle user not logged in
        }
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/index.html'; // Redirect to login page
        }
    })
    .catch(error => console.error('Error:', error));});




    //GETTING FAVORITE CARS 
    async function loadFavoriteCars() {
        console.log("made it to loadfavcars fucntion");
        try {
            const response = await fetch('/get-favorite-cars');
            if (response.ok) {
                const cars = await response.json();
                console.log("Cars Data:", cars); // Log to see the structure
                displayFavoriteCars(cars);
            } else {
                console.error('Failed to load favorite cars', response.status);
                // Handle error (e.g., show a message to the user)
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show a message to the user)
        }
    }


    //DELETE FAVORITE CAR
    async function deleteFavoriteCar(carId) {
        try {
            const response = await fetch(`/delete-favorite-car/${carId}`, { method: 'DELETE' });
            if (response.ok) {
                // Remove the car element from UI or reload favorite cars
                loadFavoriteCars();
            } else {
                alert("Failed to delete the car. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    }

    
    function displayFavoriteCars(cars) {
        console.log("made it to displayfavcars function");
        const container = document.getElementById('favoriteCarsContainer');
        container.innerHTML = ''; // Clear existing content
    
        cars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.classList.add('car-item');
            carElement.innerHTML = `
                <h3>${car.carmake} ${car.carmodel} (${car.caryear})</h3>
                <p>Class: ${car.carclass}</p>
                <p>Fuel Type: ${car.fueltype}</p>
                <p>Drivetrain: ${car.drivetrain}</p>
                <p>Cylinders: ${car.cylinders}</p>
                <p>Transmission: ${car.transmission}</p>
                <p>City MPG: ${car.citympg}</p>
                <p>Highway MPG: ${car.highwaympg}</p>
                <p>Combination MPG: ${car.combinationmpg}</p>
                <button class="deleteCarButton" data-carid="${car.favoritecarid}">Delete</button>

            `;
            container.appendChild(carElement);
        });

        container.addEventListener('click', function(event) {
            if (event.target.classList.contains('deleteCarButton')) {
                const carId = event.target.getAttribute('data-carid');
                deleteFavoriteCar(carId);
            }
        });
    }
    
    document.getElementById('showFavCarsButton').addEventListener('click', function() {
        document.getElementById('favoriteCarsPopup').style.display = 'block';
        loadFavoriteCars(); // Load the favorite cars when the button is clicked
    });
    
    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('favoriteCarsPopup').style.display = 'none';
    });
    
    window.onclick = function(event) {
        let popup = document.getElementById('favoriteCarsPopup');
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    };


    

    
    
    
    
    
    
    
    
            


});
