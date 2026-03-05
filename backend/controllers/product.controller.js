const Product = require('../models/Product');

// Get ALL products for the logged-in user
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a product for the logged-in user
exports.createProduct = async (req, res) => {
    const { name, price, cost, stock, barcode, supplier } = req.body;
    try {
        const newProduct = new Product({
            user: req.user.id,
            name,
            price,
            cost: cost || 0,
            stock,
            barcode,
            supplier
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update stock (used by Scanner or Manual Edit)
exports.updateProduct = async (req, res) => {
    const { stock, price, name } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (stock !== undefined) product.stock = stock;
        if (price !== undefined) product.price = price;
        if (name) product.name = name;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Purchase/Decrement Logic (Updated for specific decrement usually via Order)
exports.purchaseProduct = async (req, res) => {
    // This might be deprecated in favor of createOrder, but keeping for simple decrement w/o full order
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure user owns product if this is an internal action, 
        // OR allow public if this was a storefront. For MSME app, usually Owner scans it out.
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ msg: 'Out of stock' });
        }

        product.stock = product.stock - 1;
        await product.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
