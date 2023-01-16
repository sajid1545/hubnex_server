const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    company: String,
    email: String,
    message: String,
    status:String
});

module.exports = mongoose.model("NeedHelpcompany", postSchema);