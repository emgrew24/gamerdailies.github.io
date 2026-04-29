const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        // --- Product Content ------------------------
        id: {
            type: Number,
            required: [true, 'Please add an id number'],
        },
        service_title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        service_description_short: {
            type: String,
            required: [true, 'Please add a short description'],
        },
        service_description_extended: {
            type: String,
            required: [true, 'Please add a long description'],
        },
        package_type: {
            type: String,
            required: [true, 'Please select the package type'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        product_image: {
            type: String,   // Not required to have an image
        },
        image_alt: {
            type: String,   // Not required to have an image
        },
    },
    {
        timestamps: true,
    }
)

// Export the model 
module.exports = mongoose.model('Service', productSchema)