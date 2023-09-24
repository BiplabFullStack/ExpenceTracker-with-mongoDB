const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const signupSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim:true
    },
    lastName:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    number:{
        type:Number,
        required: true,
        trim:true
    },
    password:{
        type:String,
        required: true,
        trim:true
    },
    ispremium:{
        type:Boolean,
        default:false
    },
    totalexpense:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model('User', signupSchema);
