import mongoose from "mongoose";

const memberSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    membershipDate:{
        type:Date,
        default:Date.now
    }
});

export const member=mongoose.model('Member',memberSchema);