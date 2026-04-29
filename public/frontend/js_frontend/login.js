// This file covers the logic and process of a user attempting to log in
// to the admin page.
// It is linked up to login.html 

// When the user clicks the back button they return to the main page
document.getElementById('backBtn').addEventListener('click', ()=>{
    window.location.href = '/'
})


// --- (provided by Dr. Upadhayay) ------------------------------

// Clean up any leftover junk from old sessions
localStorage.removeItem('token');
localStorage.removeItem('username');

document.getElementById('loginBtn').addEventListener('click', doLogin);

// Allows the user to just hit enter after typing their username/password to log in

document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
});
document.getElementById('username').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('password').focus();
});


function doLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        document.getElementById('errorMsg').textContent = 'Enter both fields.';
        return;
    }

    document.getElementById('errorMsg').textContent = 'Logging in...';

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('errorMsg').textContent = data.error;
            return;
        }
        // Cookie is already set by the server in the response
        // Just navigate to /admin
        window.location.href = '/admin';
    })
    .catch((err) => {
        document.getElementById('errorMsg').textContent = 'Login failed: ' + err.message;
    });
}
// --------------------------------------------------------------
