const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = Schema(
  {
    jobTitle: String,
    skills: Array,
    jobType: String,
    experience: String,
    package: String,
    earnPerClosure: String,
    noticePeriod: String,
    location: String,
    communication: String,
    qualifications: String,
    status: String,
    rewardType: String,
    responsibilities: String,
    benefits: String,
    recruiterIdClaimed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recruiters",
      },
    ],
    candidatesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidateprofiles",
      },
    ],
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "companies",
    },
    jobDetailsFile: {
      type: Schema.Types.ObjectId,
      ref: "documents.files",
    },
    Tech: String,
    Currency: String,
    format: String,
    remark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('postjobs', postSchema);