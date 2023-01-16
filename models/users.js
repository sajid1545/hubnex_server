const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        // required: true,
        // unique: true
    }, password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneNumberVerified: {
        type: Boolean,
        default: false
    },
    status: String,
    companyName: String,
    companyWebsite: String,
    role: String,
    vote: Boolean,
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: 'recruiters'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    clientNotificationReg_Id: String


}, { timestamps: true }
)

module.exports = mongoose.model('users', userSchema)
