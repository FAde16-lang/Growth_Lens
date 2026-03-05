const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

// @route   GET api/admin/stats
// @desc    Get system stats
// @access  Private/Admin
router.get('/stats', [auth, admin], (req, res) => {
    // Mock stats
    res.json({
        totalUsers: 150,
        totalProducts: 45,
        totalOrders: 320,
        revenue: 15000
    });
});

module.exports = router;
