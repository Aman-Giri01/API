import mongoose from "mongoose";

const item=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    minQuantity:{
        type:Number,
        default:5
    }

},{
    timestamps:true
});

export const itemSchem=mongoose.model("Item",item);