const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword 
} = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/forgot-password
// Added to support the "Forgot Password" functionality in the UI
router.post('/forgot-password', forgotPassword);

module.exports = router;