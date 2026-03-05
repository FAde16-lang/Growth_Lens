const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0 // Positive = They owe use (Udhaar). Negative = Advance.
    },
    lastTransaction: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('customer', CustomerSchema);
