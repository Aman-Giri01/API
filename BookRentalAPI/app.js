import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { route } from './route/bookRoute.js';

dotenv.config();
const PORT=process.env.PORT;
const uri=process.env.MONGODB_URL;

const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(route);
app.listen(5000,()=>console.log("Server running on PORT: 5000"));

mongoose.connect(uri)
.then(()=>console.log('Connected to Database'))
.catch((error)=>console.log("error occured",error));
