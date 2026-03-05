const Customer = require('../models/Customer');

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ user: req.user.id }).sort({ lastTransaction: -1 });
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create new customer
exports.createCustomer = async (req, res) => {
    const { name, phone, initialBalance } = req.body;
    try {
        const newCustomer = new Customer({
            user: req.user.id,
            name,
            phone,
            balance: initialBalance || 0
        });
        const customer = await newCustomer.save();
        res.json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Balance (Khata Entry)
exports.updateBalance = async (req, res) => {
    const { amount, type } = req.body; // type: 'credit' (add to debt) or 'payment' (reduce debt)
    try {
        let customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ msg: 'Customer not found' });

        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Logic: 
        // Credit (Udhaar diya) -> Increase Balance
        // Payment (Payment received) -> Decrease Balance
        if (type === 'credit') {
            customer.balance += Number(amount);
        } else if (type === 'payment') {
            customer.balance -= Number(amount);
        }

        customer.lastTransaction = Date.now();
        await customer.save();
        res.json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
