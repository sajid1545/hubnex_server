const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

userName:{
    type:String,
    required: true
},
email:String,
password:{
    type:String,
    required: true
},
mobile:Number,
status:String,
Dashboard :Boolean,
company :Boolean,
manageRoles :Boolean,
forms :Boolean,
recruiter :Boolean,
referral :Boolean,
cms :Boolean,
payment :Boolean,
emailVerified:{
    type:Boolean,
    default: false
},
phoneNumberVerified:{
    type: Boolean,
    default: false
    },
clientNotificationReg_Id:String,
Applications :Boolean, 
Invoices :Boolean,
 Notifications :Boolean,
  NeedHelp :Boolean

},{ timestamps: true }
)

module.exports = mongoose.model('loginadmins',userSchema)