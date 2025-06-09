import express from 'express';
import mongoose from 'mongoose';
import { route } from './route/equipRoute.js';

const app=express();
app.use(express.json());
// app.use(express.urlencoded({extended:false}));
app.use(express.urlencoded({extended:false}));
app.use(route);

app.listen(5000,()=>console.log('server started'));

mongoose.connect("mongodb://localhost:27017/mongoose_database")
.then(()=>console.log('Connected to Database'))
.catch((error)=>console.log("error occured",error));
