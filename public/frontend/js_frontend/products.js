// The base URL for all API requests
const API_URL = 'https://gamer-dailies.vercel.app/api'


// --- Protecting The Page --------------------------
// Read the token that was saved to localStorage
const token = localStorage.getItem('token')

// If there is no token, the user is not logged in - send them back to the login page
if(!token){
    window.location.href = 'login.html'
    throw new Error('No token')
}


// ===== AUTH HEADER HELPER =====
// Every request to a protected route must include the JWT token in the Authorization header
// This function returns the headers object so we don't repeat it everywhere
function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // format required by our authMiddleware.js
  }
}


// ===== LOGOUT =====
// When logout is clicked, remove the token from localStorage and go back to login
// Without the token, the user can no longer make authenticated requests
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'login.html'
})



// this basically becomes what my admin.js was