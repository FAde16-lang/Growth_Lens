const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    customerName: {
        type: String,
        default: 'Walk-in Customer'
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        name: String, // Snapshot name
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true } // Snapshot price
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Completed'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('order', OrderSchema);
