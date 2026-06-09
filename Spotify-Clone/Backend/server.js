import 'dotenv/config'
import { app } from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB().then(()=>{
try {
    app.listen(3000,()=>{
    console.log("server connected ......");
    })
}
catch(err){
    console.log(err);
}});
