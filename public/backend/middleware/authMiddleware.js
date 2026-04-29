// Checks the authorization of a user before routing to a protected page

const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token  // Declares token variable in outer scope so both if-blocks below can access it

    if (
        req.headers.authorization &&    // Checks that an Authorization header actually exists on the request
        req.headers.authorization.startsWith('Bearer')  // Checks it follows the Bearer token format — e.g. "Bearer eyJhbG..."
    ){
        try{
            // Splits "Bearer eyJhbG..." by space and grabs index [1] 
            token = req.headers.authorization.split(' ')[1]

            // Verifies the token's signature using your secret key
            // also checks expiry. Returns the decoded payload { id } if valid, throws if tampered or expired
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Looks up the real user in MongoDB using the id embedded in the token
            // .select('-password') strips the password field from the returned object for security
            req.user = await User.findById(decoded.id).select('-password')

            // Passes control to the actual route handler — only reached if everything above succeeded
            next()
        } catch (error) {
            console.log(error) // Logs the exact JWT error
            res.status(401)    // Sets HTTP status to unauthorized
            throw new Error('Not authorized')
        }
    }

    // Runs if the Authorization header was missing 
    // or didn't start with 'Bearer' — token was never assigned
    if (!token){
        
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

// Export middleware so routes can use it
module.exports = { protect }