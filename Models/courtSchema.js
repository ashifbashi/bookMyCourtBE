const mongoose = require('mongoose');

const courtSchema = mongoose.Schema({
    courtName:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    courtPic:{
        type:String,
        required:true,
    },
    timeStamb:{
        type:Date,
        default:new Date()
    }


})

const court = mongoose.model('court', courtSchema)
module.exports=court