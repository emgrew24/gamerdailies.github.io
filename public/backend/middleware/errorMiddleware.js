// Defines the error handler
// Takes 4 parameters (err, req, res, next) which is how express
// recognizes its an ERROR middleware, not a regular one

const errorHandler = (err, req, res, next) =>{

    // Check if a status code was already sent to the res
    // if not, default to 500 (server error)
    const statusCode = res.statusCode ? res.statusCode : 500;

    // Set the HTTP status code on the response
    // This tells the client what kind of error occured
    res.status(statusCode)

    // Send a JSON response with error details (much cleaner than Express's default)
    res.json({

        // The human-readable error message
        message: err.message,

        // The stack trace shows exactly where the error happened 
        //  only include it in development for debugging, 
        // hide it in production for security (exposing file paths and line numbers is a risk)
        stack: process.env.NODE_ENV === 'production' ? null: err.stack
    })
}

// Export as an object
//  this is why we destructure it in server.js with const { errorHandler } = require(...)
module.exports = { errorHandler }