const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route pour lister tous les produits
router.get('/', productController.getAllProducts);

// Route pour rechercher un produit local par code-barres
router.get('/local/:barcode', productController.getLocalProductByBarcode);

// Route pour rechercher un produit par code-barres dans OpenFoodFacts
router.get('/barcode/:barcode', productController.getProductByBarcode);

// Route pour créer un nouveau produit
router.post('/', productController.createProduct);

// Route pour importer un produit par code-barres
router.post('/import/:barcode', productController.importProductByBarcode);

// Route pour supprimer un produit
router.delete('/:barcode', productController.deleteProduct);

module.exports = router;