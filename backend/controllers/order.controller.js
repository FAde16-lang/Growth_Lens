const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createOrder = async (req, res) => {
    const { items, customerName, totalAmount } = req.body;
    try {
        // Items is array of { productId, quantity }
        // 1. Create Order
        // 1. Calculate Profit & Update Stock
        let totalProfit = 0;
        const dbItems = [];

        for (const item of items) {
            // Handle custom items (starting with custom_) or real items
            if (item.product && !item.product.toString().startsWith('custom_')) {
                let product = await Product.findById(item.product);
                if (product) {
                    product.stock = product.stock - item.quantity;
                    await product.save();

                    // Profit = (Selling Price - Cost) * Qty
                    const cost = product.cost || 0;
                    const profit = (item.price - cost) * item.quantity;
                    totalProfit += profit;
                }
            } else {
                // Custom item: Cost is assumed 0, so Profit = Price * Qty
                totalProfit += (item.price * item.quantity);
                item.product = null; // Set to null so Mongoose doesn't try to cast "custom_" string to ObjectId
            }
            dbItems.push(item);
        }

        const newOrder = new Order({
            user: req.user.id,
            items: dbItems,
            customerName,
            totalAmount,
            totalProfit
        });

        const order = await newOrder.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
