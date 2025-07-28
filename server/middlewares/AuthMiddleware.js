const jwt = require("jsonwebtoken") ; 
const User = require("../models/UserModel");

const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt ;
    console.log(token) ;
    if (!token){
        return res.status(401).json({
            success: false,
            message: "Access Token Required",
        }) ; 
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY) ;
    console.log(decoded) ; 
    const user = await User.findById(decoded.id) ; 
    if(!user){
        return res.status(403).json({
            success: false,
            message: "User Not Found",
        })  ; 
    }
    req.user = decoded ; 
    next() ; 
} ; 

module.exports = {
    verifyToken
} ;