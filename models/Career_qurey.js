const mongoose = require('mongoose')

const data = mongoose.Schema({
    position :{
        type:String,
        required: true
    },
     jobtype :{
        type:String,
        required: true
    },
     experience :{
        type:String,
        required: true
    },
     location :{
        type:String,
        required: true
    },
     resume :{
        type:String    
    }
},{timestamp:true})

module.exports = mongoose.model('Career_qurey',data)