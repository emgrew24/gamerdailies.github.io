 // This is just a copy of the function incase I mess up stuff super bad
 
 
 
 // Create the features list by getting database data
            async function getFeatureList(){

                try{
                    const response = await fetch('/api');
                    
                    const data = await response.json();

                    const feature_list = document.getElementById('featureList');

                    // Get data into the display of features
                    for (let service of data.services){

                        // Ensure that only the first 3 features are added
                        // if(service.id > 3){
                        //     break;
                        // }

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

                    };

                }catch(error){
                    console.log("An error has occured while loading the feature list ->", error);
                };

            };
