const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const customerController = require('../controllers/customer.controller');

router.get('/', auth, customerController.getCustomers);
router.post('/', auth, customerController.createCustomer);
router.put('/:id/balance', auth, customerController.updateBalance);

module.exports = router;
