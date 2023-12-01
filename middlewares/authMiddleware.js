const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')

exports.auth = async(req,res,next) => {
    try {
        let token
        token = req.cookies.jwt || req.header("Authorization").replace("Bearer ", "")

        if (token) {
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //   console.log(decoded)
        
              req.user = await User.findById(decoded.userId);
        
              next();
            } catch (error) {
              console.error(error);
              res.status(401);
              throw new Error('Not authorized, token failed');
            }
        } else {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    } catch (error) {
        console.error(error);
    }
}

exports.customRole = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new Error("Not authorized to access this resource"))
    }
    next()    
  }
}