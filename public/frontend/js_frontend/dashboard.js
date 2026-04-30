// The base URL for all API requests
const API_URL = 'https://gamer-dailies.vercel.app/api'

// When the user clicks the login button they get redirected to the login screen
document.getElementById('loginBtn').addEventListener('click', ()=>{
    window.location.href = 'login.html'
})


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

    renderFeaturesList(products)
    renderAdditionalFeatures(products)
    renderPackageDetails(products)
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


function renderAdditionalFeatures(products){
    const additional_features = document.getElementById('additionalFeatures');

    // Filter for everything but the basic package items and display those only
    const packageFilterExclude = products.filter(p => p.package_type !== "Basic Package")
    // Add each element
    packageFilterExclude.forEach(service =>{

        const feature = document.createElement('div');

        // Assign the id's of each feature being displayed
        feature.id = 'feature'+service.id;
        let btnFeatureId = 'btnFeature'+service.id;
        let descriptionId = 'desc'+service.id;


        feature.classList.add('additionalFeatureStyle');

        feature.innerHTML = `
            <h2 class="centerText">${service.service_title}</h2>
            <p class="centerText featureText">${service.service_description_short}</p>
            <p id="${descriptionId}" class="centerText featureText" style="display: none;">${service.service_description_extended}</p>
            <button class="btnPlainDarkGreen btnAdditionalFeatures" id="${btnFeatureId}">
                <b>See More</b>
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
                descBtn.innerHTML = '<b>See More</b>';
            }
            else{
                descText.classList.add('visible');
                descBtn.innerHTML = '<b>See Less</b>';
            }

        });

        // Append the new HTML to an existing element
        additional_features.appendChild(feature);
    })
}


function renderPackageDetails(products) {
    const install_options = document.getElementById('installOptions');

    // Get all data for each individual package in a for loop
    // - the title of the package
    // - hardcode the id tag for each package 
    // - a dynamic list of services (as an array to use later)
    // - the price of the package

    // Create an object to hold the data in each package
    const packageTypes = {
        'Basic Package': {id: 'package1', features:[], price: null},
        'Quality Of Life Package': {id: 'package2', features:[], price: null},
        'Deluxe Package': {id: 'package3', features:[], price: null}
    };

    products.forEach(service => {
        // Loop through the database and add the neccessary data to the object
        if(service.package_type in packageTypes){
            packageTypes[service.package_type].features.push('<li>'+ service.service_title +'</li>');
            packageTypes[service.package_type].price = service.price;
        };
    })

    // Add each package to its own div --------------------------------
    // - Iterate through the packageTypes object by getting 
    //   the key-value pairs (thank you geeks for geeks & w3schools)
    // - Build the div and insert html 

    for(let [type, pkgDetail] of Object.entries(packageTypes)){       
        const package_div = document.createElement('div');

        package_div.id = pkgDetail.id
        package_div.classList.add('installOptionStyle');

        package_div.innerHTML = `
            <h2 class="installOptionTitle centerText">${type}</h2>
            <p class="installOptionText centerText"><b>Features this package includes:</b></p>
            <ul class="installOptionList">
                ${pkgDetail.features.join('')}
            </ul>
            <h2 class="installOptionPrice centerText">$${pkgDetail.price}</h2>
            <button class="installBtn btnPlainYellow">
                <b>Install</b>
            </button>
        `
        install_options.appendChild(package_div);
    };

}


// Get all product data when the site loads
getProducts()