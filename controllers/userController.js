const { User } = require('../models');

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

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password, // Make sure to hash the password before storing it (use bcrypt or another library)
    });

    // Send back the response with the message
    res.status(201).json({
      success: true,
      message: 'User create successfully, yesss!',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the user.', 
      error: error.message 
    });
  }
};
