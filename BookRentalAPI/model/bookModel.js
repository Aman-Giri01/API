import mongoose from "mongoose";

const bookSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    author:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    rentalRate:{
        type:Number,
        required:true
    },
    minQuantity:{
        type:Number,
        required:true,
        default:5
    }

},{
    timestamps:true
});

export const book=mongoose.model('Book',bookSchema);