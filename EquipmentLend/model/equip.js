import mongoose from "mongoose";

const equipSchema= mongoose.Schema({
    name:{
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
    minStock:{
        type:Number,
        default:5
    },
    dailyFee:{
        type:Number,
        default:20
    }
},{
    timestamps:true
});

export const equip=mongoose.model('Euip',equipSchema);