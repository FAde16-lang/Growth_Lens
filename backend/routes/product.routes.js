const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');

// All product routes now require Auth because they are user-scoped
router.get('/', auth, productController.getProducts);

router.post('/', auth, productController.createProduct);

router.post('/purchase/:id', auth, productController.purchaseProduct);

router.put('/:id', auth, productController.updateProduct);

router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
