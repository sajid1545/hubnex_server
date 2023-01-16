const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    jobId: {
        type: Schema.Types.ObjectId,
        ref : 'postjobs'
    },
    recruiterId:{
        type: Schema.Types.ObjectId,
        ref: 'recruiters'
    }
},{timestamps:true});

module.exports = mongoose.model('claimedpositions', postSchema);