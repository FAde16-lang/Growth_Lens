const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

// @route   GET api/users
// @desc    Get all users (for admin or public directory)
// @access  Private
router.get('/', auth, userController.getUsers);

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, userController.updateProfile);
router.post('/staff', auth, userController.createStaff);

module.exports = router;
