const mongoose = require('mongoose')

const data = mongoose.Schema({
    privacyPolicy:String
},{ timestamps: true })

module.exports = mongoose.model('privacyPolicy',data)
