const jwt = require('jsonwebtoken');
function generateToken(user){
   return jwt.sign({email: user.email}, process.env.JWT_KEY);
}

module.exports = generateToken;