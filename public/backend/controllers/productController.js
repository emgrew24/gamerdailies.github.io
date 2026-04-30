const asyncHandler = require('express-async-handler')
const Product = require('../model/productModel')
const User = require('../model/userModel') // for update and delete


// === GET Products =================================
// const getProducts = asyncHandler(async (req, res) => {

//     const products = await Product.find({})

//     console.log("[API] - GET products successful")

//     res.status(200).json(products)
// })
const getProducts = async (req, res) => {
    const mongoose = require('mongoose')
  try {
    const db = mongoose.connection.db;
    console.log("Connected to DB:", db.databaseName); // tells you which DB it's hitting
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections); // shows what collections exist
    const products = await Product.find({});
    console.log("Products found:", products.length);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// === POST New Product ==============================
const setProduct = asyncHandler(async (req, res) =>{

    // validate there is text in the required fields
    if(!req.body.id || !req.body.service_title ||
         !req.body.service_description_short){

        res.status(400)
        console.log('[API] - Missing data, cannot POST')

        throw new Error("Missing required inputs")
    }

    // Insert the new product into the database
    const product_created = await Product.create(
        {
            id: req.body.id,
            service_title: req.body.service_title,
            service_description_short: req.body.service_description_short
            // wait to add the rest to see if this even works
        }
    )

    res.status(200).json(product_created)
    console.log('[API] - POST successful! Product added')
})


// === PUT Update Product ==============================
const updateProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product){
        res.status(400)
        console.log('[API] - Product not found')
        throw new Error("Product not found")
    }

    
    const updatedProduct = await Product.findByIDAndUpdate(
        req.params.id,
        {service_title: req.body.service_title},   // will need to fix this
        {new: true}
    )

    res.status(200).json(updatedProduct)
    console.log('[API] - PUT successful! Updated product')
})


// === DELETE A Product ==================================
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product){
        res.status(400)
        throw new Error("Product not found")
    }


    await product.deleteOne()

    res.status(200).json({message: `Deleted Product ${req.params.id}`})

})


// Export all functions to be used in routing
module.exports = {
    getProducts,
    setProduct,
    updateProduct,
    deleteProduct
}