const jwt = require('jsonwebtoken');
const { User } = require('../models');

//Many production systems use a Short-lived Access Token and a Long-lived Refresh Token

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: err.message
    });
  }
};

module.exports = authMiddleware;