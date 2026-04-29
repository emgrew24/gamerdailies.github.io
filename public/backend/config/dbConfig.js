const mongoose = require('mongoose') // Allows interaction with MongoDB

// Make the async function to get a connection to the database
const connectDB = async()=>{

    // Wrapping in try-catch to handle connection failures properly
    try{
        // Connect to MongoDB using URI stored in .env
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // If there was success, log a message
        console.log("[DB] Connected to MongoDB ", conn.connection.host)

    } catch(err){
        console.log('[DB] MongoDB connection failed: ', err)
    }

}

// Export the function for server.js
module.exports = connectDB