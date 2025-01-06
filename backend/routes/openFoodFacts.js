const express = require('express');
const router = express.Router();
const openFoodFactsController = require('../controllers/openFoodFactsController');
const { auth } = require('../middleware/auth');

// Routes publiques
router.get('/search', openFoodFactsController.searchProductsOpenFoodFacts);
router.get('/product/:barcode', openFoodFactsController.getProductByBarcodeOpenFoodFacts);
router.get('/categories', openFoodFactsController.getCategoriesOpenFoodFacts);

// Routes protégées (nécessitent une authentification)
router.post('/product/:barcode/import', auth, openFoodFactsController.importProduct);
router.put('/product/:id/update', auth, openFoodFactsController.updateProductInfo);

module.exports = router;
