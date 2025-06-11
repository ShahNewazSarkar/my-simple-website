const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { User } = require('../models');

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user by username (using Sequelize)
    const user = await User.findOne({ 
      where: { 
        name: username // Changed from 'username' to 'name'
      } 
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Check password
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        providedPassword: password, // Plain text password (CAUTION)
        storedPasswordHash: user.password // Hashed password from DB
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    return res.status(500).json({ 
      message: "Server error",
      error: err.message 
      // Optional: stack: err.stack (for debugging)
    });
  }
};

