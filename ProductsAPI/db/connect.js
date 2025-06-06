import mongoose from "mongoose";

export const connectDB= async(uri)=>{
  try {
    console.log("DB is connected.🎉"); 
    await mongoose.connect(uri);
    // mongoose.set("debug",true);
} catch (error) {
    console.error(error);
    process.exit();
    
}
} 
