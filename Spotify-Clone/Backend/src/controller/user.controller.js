import { User } from "../models/user.model.js"; // Note: Use User, not userModel (based on your export)
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
async function registerUser(req, res) {
    try {
        const { username, email, password, role = 'user' } = req.body;

        // 1. Check if user exists
        const isUserAlreadyExists = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({ message: "User Already Exists" });
        }

        // 2. Hash the password correctly (Added 'await' and salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign(
         {_id: user._id,role : user.role},
         process.env.JWT_SECRET,
         {expiresIn : "1d"}
        )

        res.cookie("token",token)

        // 4. Send success response (Don't send the password back!)
        return res.status(201).json({ 
            message: "User registered successfully", 
            data : user,
            token : token

        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function loginUser(req,res){
   const {username ,email,password } = req.body;

   const user = await User.findOne({
      $or:[
         {username},{email}
      ]
   })

   if(!user)
      return res.status(401).json({message : "user not found "})

   const isPasswordValid = await bcrypt.compare(password,user.password);

   if(!isPasswordValid){
      return res.status(401).json({message : "invalid credentials"});
   }

   const token = jwt.sign(
      {_id : user._id},
      process.env.JWT_SECRET,
      {expiresIn  :"1d"}
   )
   res.cookie("token",token);
   res.status(200).json({
      message : 'login successfully...',
      user
   })
}



export{registerUser,loginUser}