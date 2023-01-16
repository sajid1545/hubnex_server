const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:String,
    body:String,
    seen: Boolean,
    userId:{
        type: Schema.Types.ObjectId,
        ref:'users'
    }

},{timestamps:true});

module.exports = mongoose.model('notifications',postSchema);