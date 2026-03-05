const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, orderController.getOrders);
router.post('/', auth, orderController.createOrder);

module.exports = router;
