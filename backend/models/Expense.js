const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true // e.g., "Shop Rent", "Helper Salary"
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String, // 'Rent', 'Salary', 'Utilities', 'Other'
        default: 'Other'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('expense', ExpenseSchema);
