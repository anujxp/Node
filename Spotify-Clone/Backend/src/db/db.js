import mongoose from "mongoose";
import { log } from 'node:console'


async function connectDB(){
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        log("Db connected successfull",connectionInstance.connection.host);
    }catch(err){
        log(err.message);
    }
}

export default connectDB;