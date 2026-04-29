const asyncHandler = require('express-async-handler') // Wraps async route handlers to automatically catch errors and pass them to Express's error middleware (no try/catch needed)
const jwt = require('jsonwebtoken')                   // Used to create and verify JSON Web Tokens for stateless authentication
const bcrypt = require('bcryptjs')                    // Used to hash passwords before storage and compare them during login

// Import mongoose to interact with the 'users' collection
const User = require('../model/userModel');


const registerUser = asyncHandler(async (req, res) => {

    // Destructuring required fields from incoming JSON request
    const {name, password} = req.body;

    // Validate all required fields are present
    if (!name || !password){
        throw new Error("Please enter all fields")
    };

    // Check if a user already exists

    // Not using emails so cant do this yet

    // ==== Password hashing ==========================================
    // Storing plain-text passwords is always a bad idea. bcrypt will
    // add a "salt" (random data) before hashing so identical passwords
    // produce different hashes each time.
    const salt = await bcrypt.genSalt(10);                      // 10 = cost factor (higher = slower but more secure)
    const hashedPassword = await bcrypt.hash(password, salt);   // Produces a one-way hash that can't be reversed

    // Create and persist a new User document in MongoDB using the newly
    // hashed password
    const user = await User.create({
        name,
        password: hashedPassword // only store the hashed password
    })

    if (user) {
        // 201 Created user - req succeded and a new user was created
        res.status(201).json({
            _id: user.id,
            name: user.name,
            token: generateToken(user._id) // Issue a JWT so the client is immediately authenticated after registration
        })
    } else {
        // If User.create() failed in some way
        res.status(400)
        throw new Error('Invalid user data')
    }

});


const loginUser = asyncHandler(async (req, res) => {

    // Destructure credentials from req body
    const {name, password} = req.body

    // Look up user by name
    const user = await User.findOne({name})

    // bcrypt.compare() hashes the plain-text input and compares it to the stored hash.
    // This is the only safe way to check passwords — you can never "unhash" to compare directly.
    if (user && (await bcrypt.compare(password, user.password))) {
        // Credentials are valid
        res.json({
            _id: user.id,
            name: user.name,
            token: generateToken(user._id)  // Client stores the token & send it with future protected reqests
        })
    } else {
        // Either no user found or password didn't match
        res.status(400)
        throw new Error('Invalid credentials')
    }
});


const getMe = asyncHandler(async (req, res) => {

    // `req.user` is NOT available by default — it is attached by the `protect` middleware,
    // which runs before this handler. The middleware validates the incoming JWT, decodes
    // the user ID from its payload, fetches the user from the DB, and sets req.user.
    // If the token is missing or invalid, `protect` rejects the request before we ever get here.
    const {_id, name} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name
    })
})



// Helper - Creates a signed JSON Web Token (JWT)
const generateToken = (id) => {
    return jwt.sign(
        { id },                         // Payload — the data embedded inside the token (kept minimal: just the user ID)
        process.env.JWT_SECRET,         // Secret key used to sign the token — must be kept private on the server; anyone with this key can forge tokens
        {
            expiresIn: '30d'            // Expiry — token becomes invalid after 30 days, forcing re-login and limiting the window of damage if a token is ever stolen
        }
    )
}

// Export all controller functions so they can be wired to routes
module.exports = {
    registerUser,
    loginUser,
    getMe
}