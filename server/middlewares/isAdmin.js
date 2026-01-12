const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Please login as admin first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};
