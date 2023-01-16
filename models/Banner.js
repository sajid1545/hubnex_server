const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema({
title:String,
desc:String,
longDesc:String,
img:String
}
)

module.exports = mongoose.model('banner',bannerSchema)
