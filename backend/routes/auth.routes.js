const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/google
// @desc    Google Login/Register
// @access  Public
router.post('/google', authController.googleLogin);

module.exports = router;
