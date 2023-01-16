const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const postSchema=new Schema({
    length:Number,
    chunkSize:Number,
    uploadDate:Date,
    filename:String,
    contentType:String
});

module.exports=mongoose.model("documents.files",postSchema);