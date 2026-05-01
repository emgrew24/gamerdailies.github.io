const asyncHandler = require('express-async-handler')
const Product = require('../model/productModel')
const User = require('../model/userModel') // for update and delete


// === GET Products =================================
const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({})

    console.log("[GET] - GET products successful")

    res.status(200).json(products)
})


// === POST New Product ==============================
const setProduct = asyncHandler(async (req, res) =>{

    // validate there is text in the required fields
    if(!req.body.id || !req.body.service_title ||
         !req.body.service_description_short || 
         !req.body.service_description_extended ||
         !req.body.package_type || !req.body.price){

        console.log('[POST] - Missing data, cannot POST')
        res.status(400)

        throw new Error("Missing required inputs")
    }

    // Insert the new product into the database
    const product_created = await Product.create(
        {
            id: req.body.id,
            service_title: req.body.service_title,
            service_description_short: req.body.service_description_short,
            service_description_extended: req.body.service_description_extended,
            package_type: req.body.package_type,
            price: req.body.price,

        }
    )

    console.log('[POST] - POST successful! Product added')
    res.status(200).json(product_created)
})


// === PUT Update Product ==============================
const updateProduct = asyncHandler(async (req, res) => {

    // Look up the note by the id
    const product = await Product.findById(req.params.id)

    if (!product){
        console.log('[PUT] - Product not found')
        res.status(400)
        throw new Error("Product not found")
    }

    
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},   // will grab any valid data from updates
        {new: true}
    )

    console.log('[PUT] - PUT successful! Updated product')
    res.status(200).json(updatedProduct)
})


// === DELETE A Product ==================================
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product){
        console.log('[DELETE] - Product not found')
        res.status(400)
        throw new Error("Product not found")
    }


    await product.deleteOne()

    console.log('[DELETE] - DELETE successful! Deleted product')
    res.status(200).json({message: `Deleted Product ${req.params.id}`})

})


// Export all functions to be used in routing
module.exports = {
    getProducts,
    setProduct,
    updateProduct,
    deleteProduct
}