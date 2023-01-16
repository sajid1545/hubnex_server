const mongoose = require('mongoose')

const data = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    message: {
        type: String,
    },
    status: String
})

module.exports = mongoose.model('Contact_qurey', data)