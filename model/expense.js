const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const expenseSchema = new mongoose.Schema({
    itemName: {
        type:String,
        required: true,
        trim:true
    },
    expense :{
        type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<0){
                throw new Error('Value must be Positive value')
            }
        }
    },
    item: {
        type:String,
        required: true,
        trim:true
      
    },
    category:{
        type:String,
        required: true,
        trim:true
      
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required: true
    }

},{timestamps:true})

module.exports = mongoose.model('Expense', expenseSchema);