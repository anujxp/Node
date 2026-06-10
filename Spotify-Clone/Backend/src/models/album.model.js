import mongoose from "mongoose";    
import {User }from './user.model.js'
import { Music } from "./music.model.js";
const albumSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    artist:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    songs :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "musicModel",
        }
    ],
    description : {
        type :String,
        trim : true 
    }

},
{
    timestamps : true 
})


export const Album = mongoose.model("Album",albumSchema);