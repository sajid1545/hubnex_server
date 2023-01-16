const multer = require("multer");
const mongoose=require('mongoose');
const {GridFsStorage}= require("multer-gridfs-storage");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const promise = MongoClient
  .connect(process.env.MONGODB_URL)
  .then(client => client.db(process.env.DATABASE));
const storage =new GridFsStorage({
    db: promise,
   //url: ' mongodb://0.0.0.0:27017/college_db_ReactApp',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg","image/jpg","application/pdf"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-photo-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "documents",
            filename: `${Date.now()}-photo-${file.originalname}`,
        };
    },
});



module.exports = multer({ storage });
