// this will become the new index.js
// needs to not have a protected route so that the 
// database data will be able to load on the page

// const { getProducts } = require("../../backend/controllers/productController")


// The base URL for all API requests
const API_URL = 'https://gamer-dailies.vercel.app/api'

// When the user clicks the login button they get redirected to the login screen
document.getElementById('loginBtn').addEventListener('click', ()=>{
    window.location.href = '/login'
})


async function getProducts() {
    const res = await fetch(`${API_URL}/products`, {
        method: 'GET'
    })

    const products = await res.json()

    if (!res.ok) {
        // If the request fails send an error
        console.log("Could not fetch products")
        return
    }

    renderFeaturesList(products)
    // renderAdditionalFeatures(products)
    // renderPackageDetails(products)
}


function renderFeaturesList(products){
    const feature_list = document.getElementById('featureList');

    // Filter for just the basic package items and display those only
    const packageFilter = products.filter(p => p.package_type === "Basic Package")
    // Add each element
    packageFilter.forEach(service => {
        const feature = document.createElement('div');

        // Assign the id's of each feature being displayed
        feature.id = 'feature'+service.id;
        let btnFeatureId = 'btnFeature'+service.id;
        let descriptionId = 'desc'+service.id;


        feature.classList.add('featureListStyle');

        feature.innerHTML = `
            <img src="${service.product_image}" alt="${service.image_alt}" crossorigin="anonymous" class="featureImage">
            <h2 class="centerText">${service.service_title}</h2>
            <p class="centerText featureText">${service.service_description_short}</p>
            <p id="${descriptionId}" class="centerText featureText" style="display: none;">${service.service_description_extended}</p>
            <button class="btnPlainOrange btnFeatureList" id="${btnFeatureId}">
                <b>More Details</b>
            </button>
        `;

        // Allows the user to see a more detailed description of a feature
        const descText = feature.querySelector(`#${descriptionId}`); // selecting the actual id being created
        const descBtn = feature.querySelector(`#${btnFeatureId}`);

        descBtn.addEventListener('click', ()=>{
            // Will check if the visible class is being 
            // used on the description
            if(descText.classList.contains('visible')){
                descText.classList.remove('visible');
                descBtn.innerHTML = '<b>More Details</b>';
            }
            else{
                descText.classList.add('visible');
                descBtn.innerHTML = '<b>Less Details</b>';
            };

        });

        // Append the new HTML to an existing element
        feature_list.appendChild(feature);
    })
}


getProducts()