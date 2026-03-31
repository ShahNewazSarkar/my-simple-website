const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const redis = require("../redisClient");
const { User } = require('../models');

dotenv.config();

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET, // Short-lived secret
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET, // Use a separate secret!
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required.' });
    }

    const user = await User.findOne({ where: { name: username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store in Redis (7 days expiry)
    await redis.setex(`refreshToken:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    res.status(200).json({
      success: true,
      data: { accessToken, refreshToken, user: { id: user.id, name: user.name } }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Token required.' });
    }

    // 1. Verify Refresh Token signature
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // 2. Check Redis for white-listing
    const storedToken = await redis.get(`refreshToken:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Token revoked or invalid.' });
    }

    // 3. Get User and rotate tokens
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });

    // ROTATION: Generate BOTH a new access and a new refresh token
    const tokens = generateTokens(user);
    await redis.setex(`refreshToken:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    res.status(200).json({
      success: true,
      data: { 
        accessToken: tokens.accessToken, 
        refreshToken: tokens.refreshToken // Frontend updates its storage
      }
    });

  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired.' });
  }
};
