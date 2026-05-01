// Builds the schema for a user
const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, 'Please add a name'],
        },
        password: {
            type: String, 
            required: [true, 'Please add a password'],
        },
    },
    {
        timestamps: true,
    }
)

// Export the model
module.exports = mongoose.model('User', userSchema)