const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Allow any user to own this for simplicity, or find first user
        const user = await User.findOne();
        if (!user) {
            console.log('No user found to assign product to. Please register a user first.');
            process.exit(1);
        }

        const product = new Product({
            user: user._id,
            name: "Test Scannable Item",
            price: 50,
            cost: 20,
            stock: 100,
            barcode: "12345678", // Matches the generated image
            supplier: "Demo Supplier"
        });

        await product.save();
        console.log('Test Product Added: "Test Scannable Item" with Barcode: 12345678');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
