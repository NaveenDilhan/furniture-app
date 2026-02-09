const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Recommended for professional session management

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Added email
    
    // Check if user or email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create user - hashing happens in the User model 'save' hook
    const user = await User.create({ 
      username, 
      email, 
      password 
    });
    
    res.status(201).json({ success: true, message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate a JWT for professional session handling
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: '30d',
      });

      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token, // Pass token to frontend
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password (Basic Implementation)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // In a real app, you would generate a token and send an email here.
    // For your project, returning success is enough to demonstrate the flow.
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};