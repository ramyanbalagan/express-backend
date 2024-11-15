const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('authjwt', loginSchema)