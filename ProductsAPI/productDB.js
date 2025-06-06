import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/connect.js";
import { prod } from "./model/products.js";
import products from "./products.json" assert { type: "json" };

const start= async()=>{
    try {
        connectDB(process.env.MONGODB_URL);
        await prod.deleteMany();
        await prod.create(products);
        console.log("success");
    } catch (error) {
        console.log("error occured");
    }
}


start();