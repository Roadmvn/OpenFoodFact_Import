const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, checkRole } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Routes protégées
router.use(auth);

// Routes pour les managers et admins
router.use(checkRole(['manager', 'admin']));

router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/stock', productController.updateStock);

module.exports = router;