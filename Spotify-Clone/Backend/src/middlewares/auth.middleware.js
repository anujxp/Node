import jwt from 'jsonwebtoken'

 const isAuthenticated = (req,res,next)=>{
const token = req.cookies.token;
if(!token)
    return res.status(401).json({message : "Unautherized "})

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({ message: "Invalid Token" });
    }
}

const authorizeRoles= (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message : `you are a ${req.user.role} you dont have access to do this task`})
        }
        next();
    };
};

export {isAuthenticated,authorizeRoles}