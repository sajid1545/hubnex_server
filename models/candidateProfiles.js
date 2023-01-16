const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
   name: String,
   email: String,
   phoneNumber: Number,
   experience: String,
   currentWorking: String,
   last_or_current_ctc: String,
   expected_ctc: String,
   noticePeriod: String,
   lastWorkingDay: Date,
   currentLocation: String,
   readyToRelocate: String,
   noticePeriodBuyoutAvailable: String,
   resume: {
      type: Schema.Types.ObjectId,
      ref: 'document.files'
   },
   additionalFiles: [{
      type: Schema.Types.ObjectId,
      ref: 'documents.files'
   }],
   additionalLinks: [{ type: String }],
   remarks: String,
   recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'recruiters'
   },
   jobId: {
      type: Schema.Types.ObjectId,
      ref: 'postjobs'
   },
   companyId: {
      type: Schema.Types.ObjectId,
      ref: 'postjobs'
   },
   status: String

}, { timestamps: true });

module.exports = mongoose.model('candidateprofiles', postSchema);