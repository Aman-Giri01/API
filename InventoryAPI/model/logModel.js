import mongoose from "mongoose";

const log= mongoose.Schema({
    itemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },
    operation:{
        type:String,
        enum:['restock','sell'],
        required:true

    },
    quantity:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

export const logSchema= mongoose.model('Log',log);