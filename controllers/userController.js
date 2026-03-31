const { User } = require('../models');
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists.' 
      });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(String(password), salt);

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Send back the response with the message
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle specific error types
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error.',
        error: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
