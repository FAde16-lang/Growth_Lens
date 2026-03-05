const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Profile fields
    bio: { type: String },
    phone: { type: String },
    address: { type: String },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['owner', 'staff'],
        default: 'owner'
    }
});

module.exports = mongoose.model('user', UserSchema);
