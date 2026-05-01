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

// Display add image options when checkbox is checked
document.getElementById('chkAddImage').addEventListener('click', ()=>{
    const addImage = document.getElementById('addImage')
    const addImageAlt = document.getElementById('addImageAlt')

    if(chkAddImage.checked){
        addImage.classList.add('visible');
        addImageAlt.classList.add('visible');
    }
    else{
        addImage.classList.remove('visible');
        addImageAlt.classList.remove('visible');
    }

});


async function getProducts() {
    const res = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
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


// POST - Add a product
document.getElementById('addNewForm').addEventListener('submit', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const idNum = document.getElementById('addIDNum').value;
  const title = document.getElementById('addTitle').value;
  const shortDesc = document.getElementById('addShortDesc').value;
  const longDesc = document.getElementById('addLongDesc').value;
  const price = document.getElementById('addPrice').value;
  const packageType = document.getElementById('addPackageType').value;

  // The images are optional but everything else is required
  const chkAddImage = document.getElementById('chkAddImage');
  const imageLink = document.getElementById('addImage').value || null;    // Incase there is no image
  const imageAlt = document.getElementById('addImageAlt').value || null;  // set value to null

  // If the image checkbox is not checked, dont look for image field values
  if ((!idNum || !title || !shortDesc || !longDesc || !price || !packageType) && !chkAddImage.checked) {
      document.getElementById('addMessage').textContent = 'All fields except product image are required.';
      return;
  }
  // If the image checkbox is checked, check image field values
  else if ((!idNum || !title || !shortDesc || !longDesc || !price || !packageType || !imageLink || !imageAlt) && chkAddImage.checked){
      document.getElementById('addMessage').textContent = 'All fields including product image and image alt are required.';
      return;
  }


  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ id: Number(idNum), service_title: title, service_description_short: shortDesc, 
        service_description_extended: longDesc, package_type: packageType, price: Number(price), 
        product_image: imageLink, image_alt: imageAlt })
  })

  const data = await res.json()

  if(!res.ok){
    document.getElementById('addMessage').style.color = 'red'
    document.getElementById('addMessage').textContent = data.message || 'Error adding product.';
    return;
  }
      
  document.getElementById('addMessage').textContent = 'Product added!';

  // Reset all input fields
  document.getElementById('addIDNum').value = '';
  document.getElementById('addTitle').value = '';
  document.getElementById('addShortDesc').value = '';
  document.getElementById('addLongDesc').value = '';
  document.getElementById('addPrice').value = '';
  document.getElementById('addPackageType').value = '';

  if(chkAddImage.checked){
      document.getElementById('addImage').value = '';    
      document.getElementById('addImageAlt').value = ''; 
  }


  // Call getProducts to refresh the list to show the new product
  getProducts()
});


// PUT - Update a product
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    const databaseID = document.getElementById('updateDatabaseID').value;
    if (!databaseID) {
        document.getElementById('updateMessage').textContent = 'Product Database ID (_id) is required.';
        return;
    }

    // Get all values of all fields
    const updates = {};
    const idNum = document.getElementById('updateIDNum').value;
    const title = document.getElementById('updateTitle').value;
    const shortDesc = document.getElementById('updateShortDesc').value;
    const longDesc = document.getElementById('updateLongDesc').value;
    const price = document.getElementById('updatePrice').value;
    const packageType = document.getElementById('updatePackageType').value;
    const imageLink = document.getElementById('updateImage').value;   
    const imageAlt = document.getElementById('updateImageAlt').value;

    
    // Check if data is entered into any of the fields
    if (idNum) updates.id = Number(idNum);
    if (title) updates.service_title = title;
    if (shortDesc) updates.service_description_short = shortDesc;
    if (longDesc) updates.service_description_extended = longDesc;
    if (packageType !== 'No Change') updates.package_type = packageType;
    if (price) updates.price = Number(price);
    if (imageLink) updates.product_image = imageLink;
    if (imageAlt) updates.image_alt = imageAlt;

    if (Object.keys(updates).length === 0) {
        document.getElementById('updateMessage').textContent = 'Provide at least one field to update.';
        return;
    }

    const res = await fetch(`${API_URL}/services/${databaseID}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(updates)
    })
    
    const data = await res.json()

    if (!res.ok){
      document.getElementById('updateMessage').style.color = 'red'
      document.getElementById('updateMessage').textContent = 'Error updating product.';
      return
    }
    
    document.getElementById('updateMessage').textContent = 'Product updated!';

    // Reset all input fields
    document.getElementById('updateDatabaseID').value = '';
    document.getElementById('updateIDNum').value = '';
    document.getElementById('updateTitle').value = '';
    document.getElementById('updateShortDesc').value = '';
    document.getElementById('updateLongDesc').value = '';
    document.getElementById('updatePrice').value = '';
    document.getElementById('updatePackageType').value = '';
    document.getElementById('updateImage').value = '';
    document.getElementById('updateImageAlt').value = '';
    
    getProducts()
});


// Load the products when the page loads
getProducts()