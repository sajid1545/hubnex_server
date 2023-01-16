const mongoose = require('mongoose')

const data = mongoose.Schema({
    dataProtection:String
},{ timestamps: true });

module.exports = mongoose.model('dataprotections',data)