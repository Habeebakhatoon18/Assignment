
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select('-password');
    
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ success: false, message: 'User not found, please log in again' });
    }

    req.user = user;
    res.locals.isLoggedIn = true;
    next();

  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
  }
};
