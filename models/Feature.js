const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({

    message: String,
    type: String,
    status: String,
    ApplicationFrom: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true }
)

module.exports = mongoose.model('features', postSchema);