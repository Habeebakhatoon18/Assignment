const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

module.exports = async (req, res, next) => {
  const userToken = req.cookies.token;
  const adminToken = req.cookies.adminToken;

  // Check for admin token first
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_KEY);
      const admin = await adminModel.findById(decoded.id);
      
      if (admin) {
        req.admin = admin;
        req.user = null; // Clear user if admin
        res.locals.isLoggedIn = true;
        return next();
      }
    } catch (err) {
      // Admin token invalid, continue to check user token
    }
  }

  // Check for user token
  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.JWT_KEY);
      const user = await userModel.findOne({ email: decoded.email }).select('-password');
      
      if (user) {
        req.user = user;
        req.admin = null; // Clear admin if user
        res.locals.isLoggedIn = true;
        return next();
      }
    } catch (err) {
      // User token invalid
    }
  }

  // No valid token found
  return res.status(401).json({ success: false, message: 'Please login first' });
};
