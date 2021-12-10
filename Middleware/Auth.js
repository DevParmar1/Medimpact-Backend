const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.log(err)
          return res.status(403).send({success:false, message: 'Something went wrong while verifying user token' })
        }
        else {
        console.log(decodedToken)
          req.user_id = decodedToken.id
          next()
        }
      })
    }
    else {
      return res.status(403).send({success:false, message: 'Invalid User' })
    }


  } catch (error) {
     return res.status(403).send({success:false, message: 'Login attempt failed' })
  }
}
module.exports = {authMiddleware}