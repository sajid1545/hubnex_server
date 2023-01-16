const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    fullName: String,
    email: String,
    userName: String,
    introduction: String,
    dob: {
      type: Date,
      trim: true,
    },
    mobileNum1: Number,
    mobileNum2: Number,
    highestEducation: String,
    city: String,
    state: String,
    _PAN: String,
    _GST: String,
    accountHolderName: String,
    accountType: String,
    bankAccountNumber: Number,
    bankName: String,
    ifscCode: String,
    swiftCode: String,
    linkedIn: String,
    facebook: String,
    twitter: String,
    instagram: String,
    profilePhoto: {
      type: Schema.Types.ObjectId,
      ref: "documents.files",
    },
    claimedJobId: [
      {
        type: Schema.Types.ObjectId,
        ref: "postjobs",
      },
    ],
    candidatesId: [
      {
        type: Schema.Types.ObjectId,
        ref: "candidateProfiles",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('recruiters',postSchema);