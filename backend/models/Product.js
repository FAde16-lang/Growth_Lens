const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    barcode: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    supplier: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('product', ProductSchema);
