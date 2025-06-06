import { user } from "../model/users.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser=async(req,res)=>{
    const {username,email,password}= req.body;
    try {
        if(!username || !email || !password){
            return res.status(401).json({message:"All details are required"});
        }
        const existingUser= await user.findOne({email});
        if(existingUser){
            return res.status(401).json({message:"User already exists"});
        }
        const hashedPassword= await argon2.hash(password);
        const newUser= await user.create({
            username,
            email,
            password:hashedPassword
        });
        res.status(200).json(newUser);
        
    } catch (error) {
        res.status(404).json({message:"Internal Server Error"})
    }
};

// LOGIN 

const secret=process.env.TOKEN_SECRET;

export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const userDoc= await user.findOne({email});
        if(userDoc){
            const passwordCorrect=await argon2.verify(userDoc.password,password);
            if(!passwordCorrect){
                return res.status(401).json({error:"Incorrect credentials"});
            }
            const token=jwt.sign({
                email:userDoc.email,
                username:userDoc.username,
            },secret,{});

            res.cookie("token",token).json(userDoc)

        }else{
            res.status(401).json({error:"invalid credentials"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

// LOGOUT

export const LogoutUser=(req,res)=>{
    res.cookie("token","").json({message:"User Logout succesfully"});
    
}
