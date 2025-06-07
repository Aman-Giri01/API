import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import { stockRoute } from './routes/stock.js';
dotenv.config();

const app=express();
const Uri=process.env.MONGODB_URL;
const PORT=process.env.PORT||5000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(stockRoute);


app.listen(PORT,()=>{console.log(`Server running on PORT: ${PORT}`)});

mongoose.connect(Uri)
.then(()=>console.log('Connected to Database'))
.catch((error)=>console.log("error occured",error));
