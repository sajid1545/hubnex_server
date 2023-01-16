const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    companyName: String,
    companyWebsite: String,
    industry: String,
    contactNum1: Number,
    contactNum2: Number,
    headquarter: String,
    companySize: String,
    aboutUs: String,
    contactPerson: String,
    contactPersonEmail:String,
    contactPersonMobNo: Number,
    companyAddress:String,
    _PAN: String,
    _CIN: String,
    _TAN: String,
    _GST: String,
    incorporationDate: {
        type:Date,
        trim:true
    },
    linkedIn: String,
    facebook: String,
    twitter: String,
    instagram: String,
    jobPostedId:[{
        type: Schema.Types.ObjectId,
         ref: 'postjobs'
    }],
    profileName:String,
    tagLine: String,
    companyLogo:{
        type: Schema.Types.ObjectId,
        ref:"documents.files"
    },
    email: String,
    emailBranding: Boolean,
    jdBranding: Boolean,
    postJobBranding:Boolean
    

},{ timestamps: true }
)

module.exports = mongoose.model('companies',postSchema);