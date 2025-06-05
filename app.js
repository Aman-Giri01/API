import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { routes } from './routes/products.js';
import { connectDB } from './db/connect.js';
const app= express();
const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Hi, i am live ");
})

app.use("/api/products",routes);

connectDB(process.env.MONGODB_URL);
app.listen(PORT,()=>{console.log(`Server Running at Port: ${PORT} `)});