const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    termsAndConditions : String
},{ timestamps: true });

module.exports = mongoose.model('termsAndConditions', postSchema);