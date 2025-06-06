import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { routes } from './routes/auth.js';
import { prodRoute } from './routes/products.js';


dotenv.config();
const PORT=process.env.PORT || 5000;


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(routes);
app.use(prodRoute);

app.get("/",(req,res)=>{
    res.send("hi i am live");
})

app.listen(PORT,()=>console.log(`Server running on PORT: ${PORT}`));

// MONGODB CONNECTION

const uri=process.env.MONGODB_URL;
// console.log(uri);
// mongoose.connect(uri);
// const db= mongoose.connection
// db.on('error',(error)=>{
//     console.error("Mongoose connection error: ",error);
// });
// db.once('open',()=>{
//     console.log("connected to Database")
// })
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Mongoose connection error:", error));