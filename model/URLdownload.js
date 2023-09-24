const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const fileURLSchema = new mongoose.Schema({
    filelink:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
    }
},{timestamps:true})

module.exports = mongoose.model('FileURL', fileURLSchema)