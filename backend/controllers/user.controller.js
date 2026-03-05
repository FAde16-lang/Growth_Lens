const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get All Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { name, bio, phone, address } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create Staff Member (Owner Only)
exports.createStaff = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if requester is owner
        const requester = await User.findById(req.user.id);
        if (requester.role !== 'owner') {
            return res.status(403).json({ msg: 'Only Owner can add staff' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({
            name,
            email,
            password,
            role: 'staff'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json({ msg: 'Staff member created', user: { id: user.id, name: user.name, email: user.email, role: 'staff' } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
