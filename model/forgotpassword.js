const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const forgotpasswordSchema = new mongoose.Schema({
    _id:{
        type:String
    },
    active:{
        type:Boolean,
        required:true
    },
    expiresby:{
        type:Date
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required: true
    }
},{timestamps:true})

module.exports = mongoose.model('Forgotpassword',forgotpasswordSchema)