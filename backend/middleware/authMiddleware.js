const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req,res,next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        res.status(401).json({
            success : false,
            message : 'Invalid Token'
        })
    }

    try {
        let decoded = jwt.verify(token,process.env.JWT_SECRET);


        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        res.status(401).json({
            success : false,
            message : "Token Invalid"
        })
    }
}

const authorize = (roles)=>{
    return(req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success : false,
                message : "Not Authorized"
            })
        }
        next();
    }
}


module.exports = {protect,authorize};