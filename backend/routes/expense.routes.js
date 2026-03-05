const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

router.get('/', auth, expenseController.getExpenses);
router.post('/', auth, expenseController.createExpense);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;
