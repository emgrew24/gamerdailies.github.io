const express = require('express')
const router = express.Router()

const {
    getProducts,
    setProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')



// Import the `protect` middleware from authMiddleware.js
// `protect` runs BEFORE the controller on any route it's applied to.
// It validates the incoming JWT from the Authorization header, decodes the user ID,
// fetches that user from the DB, and attaches them to req.user.
// If the token is missing, expired, or invalid — it rejects the request with a 401
// and the controller function never runs.
const {protect} = require('../middleware/authMiddleware')




router.route('/').get(getProducts).post(protect, setProduct)


router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct)


// Export the router for the server to use
module.exports = router