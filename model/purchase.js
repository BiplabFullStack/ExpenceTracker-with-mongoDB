const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const purchaseSchema = new mongoose.Schema({
    paymentid:{
        type:String,
        trim:true

    },
    orderid:{
        type:String,
      
        trim:true

    },
    status:{
        type:String,
        trim:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
    }

},{timestamps:true})

module.exports = mongoose.model('Order',purchaseSchema)