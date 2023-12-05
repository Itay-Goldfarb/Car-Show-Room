document.addEventListener('DOMContentLoaded', async function() {

    // SIGNUP open and close popups
    document.getElementById('open-signup-popup').addEventListener('click', function() {
        document.getElementById('signup-popup').style.display = 'block';
    });

    document.getElementById('close-signup-popup').addEventListener('click', function() {
        document.getElementById('signup-popup').style.display = 'none';
    });


    // Handle SIGNUP form submission
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        let username = document.getElementById('signup-username').value;
        let email = document.getElementById('signup-email').value;
        let password = document.getElementById('signup-password').value;
        let confirmPassword = document.getElementById('signup-confirmpassword').value;

        let validationMessage = validateSignup(username, password, email);
        if (validationMessage !== "Validation successful.") {
            alert(validationMessage);
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            let response = await fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                alert('Signup successful!');
                document.getElementById('signup-popup').style.display = 'none';
            } else {
                alert('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });



    // LOGIN open and close popups
    document.getElementById('open-login-popup').addEventListener('click', function() {
        document.getElementById('login-popup').style.display = 'block';
    });

    document.getElementById('close-login-popup').addEventListener('click', function() {
        document.getElementById('login-popup').style.display = 'none';
    });

    //LOGIN FORM
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        let username = document.getElementById('login-username').value;
        let password = document.getElementById('login-password').value;
    
        try {
            let response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                alert("Login successful! Click OK to proceed to the welcome page.");
                window.location.href = '/welcome';                 
                console.log('Login successful');
            } else {
                // Handle login failure here
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });


    try {
        const response = await fetch('/check-login-status');
        if (response.ok) {
            const data = await response.json();
            if (data.loggedIn) {
                enableCarroomLink();
            } else {
                setupCarroomLinkLoginPrompt();
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
});

function enableCarroomLink() {
    // If the user is logged in, allow the link to work normally
    const carroomLink = document.getElementById('carroomLink');
    carroomLink.addEventListener('click', (e) => {
        window.location.href = 'index.html'; // Redirect to showroom page
    });
}

function setupCarroomLinkLoginPrompt() {
    // If the user is not logged in, show a prompt
    const carroomLink = document.getElementById('carroomLink');
    carroomLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        alert("Please log in to access the Carroom.");
        // Optionally, open the login popup
        document.getElementById('login-popup').style.display = 'block';
    });
}



function validateSignup(username, password, email) {
    const usernameRegex = /^[a-zA-Z0-9_\-]{3,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!usernameRegex.test(username)) {
        return "Invalid username.";
    }
    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    return "Validation successful.";
}