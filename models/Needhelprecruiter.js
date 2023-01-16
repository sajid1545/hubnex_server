const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    recruiterId: String,
    recruiterName: String,
    email: String,
    message: String,
    status:String
});

module.exports = mongoose.model("NeedHelpRequiter", postSchema);