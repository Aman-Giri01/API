import mongoose from "mongoose";

const productReview=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false,
    },
    price:{
        type:Number,
        required:true
    },
    img:{
        type:String,
        required:false
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }


});

export const ProductSchema=mongoose.model("Prod",productReview);