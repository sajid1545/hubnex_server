const mongoose = require('mongoose')

const data = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
status:String
})

module.exports = mongoose.model('Invest_qurey', data)