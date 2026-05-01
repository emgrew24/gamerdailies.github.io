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


async function getProducts() {
    const res = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: authHeader()
    })

    const products = await res.json()

    if (!res.ok) {
        // If the request fails send an error
        console.log("Could not fetch products")
        return
    }
    console.log("[API] - Products found!")
    console.log(products)

    renderProducts(products)
}


function renderProducts(products){
  const container = document.getElementById('allProductData');
  if (products.length === 0) {
      container.innerHTML = '<p>No products found.</p>';
      return;
  }
  let html = '<ul class="productList dotStyle">';
  products.forEach(service => {
      html += `<li class="productData">
          <strong>${service.service_title}</strong>
          — <small><strong>_id: ${service._id}</strong></small>
          <ul class="dataSubCategory">
              <li><strong>Product ID:</strong> ${service.id} </li>
              <li><strong>Package:</strong>  ${service.package_type} </li>
              <li><strong>Price:</strong>  ${service.price} </li>
              <li><strong>Image Link:</strong>  ${service.product_image ? '' + service.product_image + '' : 'No Image'} </li>
              <li><strong>Image Alt:</strong>  ${service.product_image ? '' + service.image_alt + '' : 'No Image'} </li>
              <li><strong>Short Description:</strong>  ${service.service_description_short} </li>
              <li><strong>Extended Description:</strong>  ${service.service_description_extended} </li>
          </ul>
      </li>`;
  });
  html += '</ul>';
  container.innerHTML = html;
}