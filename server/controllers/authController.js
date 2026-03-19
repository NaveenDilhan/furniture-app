const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; 
    

    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }


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


exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: '30d',
      });

      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token, 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }


    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};