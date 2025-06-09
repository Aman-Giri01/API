import mongoose from "mongoose";

const loanSchema=mongoose.Schema({
    equipId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Euip',
        required:true

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    loanDate:{
        type:Date,
        default:Date.now,
        required:true
    },
    returnDate:{
        type:Date
    },
    dueDate:{
        type:Date,
        required:true
    },
    fee:{
        type:Number,
        default:50
    },
    status:{
        type:String,
        required:true,
        enum:['rented','returned']
    }
});
export const loan=mongoose.model('Loan',loanSchema);