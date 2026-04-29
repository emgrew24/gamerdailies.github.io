// The base URL for all API requests
const API_URL = 'https://gamer-dailies.vercel.app/api'

// -----------------------------------------------
// === REGISTER ==================================

// Grab the register section - this will be null on the login page
const registerForm = document.getElementById('registerForm')
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        // prevent page refresh on form submit
        e.preventDefault()

        // Read the values the user typed in
        const name = document.getElementById('name').value
        const password = document.getElementById('password').value

        try{
            // Send a POST request to api/users with the data
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            })

            // Parse JSON res body
            const data = await res.json()

            if (!res.ok) {
                // Show error message returned from the server
                document.getElementById('errorMsg').textContent = data.message || 'Registration failed'
                return
            }

            // Registration successful - redirect user
            document.getElementById('successMsg').textContent = 'Registered! Redirecting to login...'
            setTimeout(() => window.location.href = 'login.html', 1500)


        } catch (err) {
            // Runs if the fetch failed
            document.getElementById('errorMsg').textContent = 'Could not connect to server'
        }
    })
}




// -----------------------------------------------
// === LOGIN =====================================

// Grab the login section - this will be null on the register page
const loginForm = document.getElementById('loginSection')
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        // prevent page refresh on form submit
        e.preventDefault()

        // Read the values from the user
        const name = document.getElementById('username').value
        const password = documen.getElementById('password').value

        try{
            // Send a POST request to /api/users/login with the username and password
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            })

            // Parse JSON body
            const data = await res.json()

            if (!res.ok){
                // Show the server error message
                document.getElementById('errorMsg').textContent = data.message || 'Login failed'
                return
            }

            localStorage.setItem('token', data.token)

            // Redirect to admin page
            window.location.href = 'admin.html';

        } catch (err) {
            // Fetch failed - potential backend issue
            document.getElementById('errorMsg').textContent = 'Could not connect to server'
        }
    })

    // When the user clicks the back button they return to the main page
    document.getElementById('backBtn').addEventListener('click', ()=>{
        window.location.href = 'index.html'
    })
}
