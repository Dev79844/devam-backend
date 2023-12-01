const jwt = require('jsonwebtoken')

const cookieToken = (user,res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

    const options = {
      expires: new Date(
          Date.now() + process.env.COOKIE_TIME * 24*60*60*1000
      ),
      httpOnly: true
    }

    
    res.status(200).cookie('jwt',token,options).json({
      message:"Ok",
      token,
      role:user.role
    })
}

module.exports = cookieToken