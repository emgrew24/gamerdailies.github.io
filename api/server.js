// --- Core Dependencies -------------------
const express = require('express')
const path = require('path')
require('dotenv').config()

// --- App-Specific Imports ----------------
const connectDB = require('../public/backend/config/dbConfig')
const { errorHandler } = require('../public/backend/middleware/errorMiddleware')
const cors = require('cors')

// Read port so it can be configured per environment (dev or production)
const port = process.env.PORT || 5555

// --- Database Connection ----------------------------------
// Connect to MongoDB before the server starts accepting requests
connectDB()

// --- Express App Setup ------------------------------------
const app = express()

// --- Middleware Stack -------------------------------------
// The order matters! Run from top-to-bottom on every incoming request

// Allow cross-origin requests from frontend
// In dev this allows all origins
// In production its locked to my website link
app.use(cors({ origin: 'https://gamer-dailies.vercel.app'}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Serve the entire /frontend folder as static files so Express can deliver the
// React/HTML build directly. path.join(__dirname, '../frontend') resolves to the
// frontend folder one level up from /backend — visiting '/' loads index.html automatically
app.use(express.static(path.join(__dirname, '../public/frontend')))


// --- API Routes --------------------------------------------
// Mount the product and user routers under their respective base paths.
// All routes defined in productRoutes.js are prefixed with /api/product
// All routes defined in userRoutes.js are prefixed with /api/users
app.use('/api/products', require('../public/backend/routes/productRoutes'))
app.use('/api/users', require('../public/backend/routes/userRoutes'))


// --- Global Error Handler ----------------------------------
// Must be registered LAST — Express identifies error-handling middleware by its
// position in the stack. Any error thrown (via throw or next(err)) in a route
// or middleware above will bubble down to this handler.
// Overrides Express's default HTML error page with a structured JSON response.
app.use(errorHandler)




// Export the express app so Vercel can find it
module.exports = app