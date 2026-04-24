// This file covers the main logic for the CRUD operations
// that are available to a user on the admin page.
// It is linked up to admin.html


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

// Take the user back to the login page if they logout
document.getElementById('logoutBtn').addEventListener('click', ()=>{
    window.location.href = '/login'
})

// POST - Add a product
document.getElementById('addBtn').addEventListener('click', () => {
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


    fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(idNum), service_title: title, service_description_short: shortDesc, 
            service_description_extended: longDesc, package_type: packageType, price: Number(price), 
            product_image: imageLink, image_alt: imageAlt })
    })
    .then(res => {
        if (res.status === 401) { window.location.href = '/login'; return null; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
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
    })
    .catch(() => {
        document.getElementById('addMessage').textContent = 'Error adding product.';
    });
});

// PUT - Update a product
document.getElementById('updateBtn').addEventListener('click', () => {
    const databaseID = document.getElementById('updateDatabaseID').value;
    if (!databaseID) {
        document.getElementById('updateMessage').textContent = 'Product Database ID (_id) is required.';
        return;
    }

    const updates = {};
    const idNum = document.getElementById('updateIDNum').value;
    const title = document.getElementById('updateTitle').value;
    const shortDesc = document.getElementById('updateShortDesc').value;
    const longDesc = document.getElementById('updateLongDesc').value;
    const price = document.getElementById('updatePrice').value;
    const packageType = document.getElementById('updatePackageType').value;
    const imageLink = document.getElementById('updateImage').value;   
    const imageAlt = document.getElementById('updateImageAlt').value;

    // This probably isnt best practice but I'm lowkey running out 
    // of time so blob of data it is haha

    if (idNum) updates.id = Number(idNum);
    if (title) updates.service_title = title;
    if (shortDesc) updates.service_description_short = shortDesc;
    if (longDesc) updates.service_description_extended = longDesc;
    if (packageType !== '') updates.package_type = packageType;
    if (price) updates.price = Number(price);
    if (imageLink) updates.product_image = imageLink;
    if (imageAlt) updates.image_alt = imageAlt;

    if (Object.keys(updates).length === 0) {
        document.getElementById('updateMessage').textContent = 'Provide at least one field to update.';
        return;
    }

    fetch(`/api/${databaseID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    })
    .then(res => {
        if (res.status === 401) { window.location.href = '/login'; return null; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
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
    })
    .catch(() => {
        document.getElementById('updateMessage').textContent = 'Error updating book.';
    });
});

// DELETE - Delete a product
document.getElementById('deleteBtn').addEventListener('click', () => {
    const databaseID = document.getElementById('deleteDatabaseID').value;
    if (!databaseID) {
        document.getElementById('deleteMessage').textContent = 'Product Database ID (_id) is required.';
        return;
    }

    fetch(`/api/${databaseID}`, { method: 'DELETE' })
    .then(res => {
        if (res.status === 401) { window.location.href = '/login'; return null; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        document.getElementById('deleteMessage').textContent = 'Product deleted!';
        
        // Reset all input fields
        document.getElementById('deleteDatabaseID').value = '';
        document.getElementById('deleteTitle').value = '';
    })
    .catch(() => {
        document.getElementById('deleteMessage').textContent = 'Error deleting product.';
    });
});

// GET - Fetch all product data
document.getElementById('fetchBtn').addEventListener('click', () => {
    fetch('/api')
    .then(res => {
        if (res.status === 401) { window.location.href = '/login'; return null; }
        return res.json();
    })
    .then(products => {
        if (!products) return;
        const container = document.getElementById('allProductData');
        if (products.length === 0) {
            container.innerHTML = '<p>No products found.</p>';
            return;
        }
        let html = '<ul>';
        products.forEach(service => {
            html += `<li>
                <strong>${service.service_title}</strong>
                — <small>_id: ${service._id}</small>
                <li> Product ID: ${service.id} </li>
                <li> Package: ${service.package_type} </li>
                <li> Price: ${service.price} </li>
                <li> Image Link: ${service.product_image ? '' + service.product_image + '' : 'No Image'} </li>
                <li> Image Alt: ${service.product_image ? '' + service.imageAlt + '' : 'No Image'} </li>
                <li> Short Description: ${service.service_description_short} </li>
                <li> Extended Description: ${service.service_description_extended} </li>
            </li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    })
    .catch(() => {
        document.getElementById('allProductData').innerHTML = '<p>Error fetching products.</p>';
    });
});
