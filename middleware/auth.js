const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user and attach to request
    //const user = await User.findById(decoded.id).select('-password');
    
    // if (!user) {
    //   return res.status(401).json({ message: 'User not found' });
    // }
    //console.log(token);
    //req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ 
      message: 'Token is not valid',
      error: err.message,
    });
  }
};

module.exports = authMiddleware;