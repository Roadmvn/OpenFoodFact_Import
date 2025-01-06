const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, checkRole } = require('../middleware/auth');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Routes OpenFoodFacts
router.get('/openfoodfacts/search', productController.searchOpenFoodFacts);

// Routes protégées (authentification requise)
router.use(auth);

// Routes pour managers et admins
router.post('/openfoodfacts/import/:barcode', 
    checkRole(['manager', 'admin']), 
    productController.importProduct
);

router.put('/:id/stock', 
    checkRole(['manager', 'admin']), 
    productController.updateStock
);

// Routes pour manager et admin uniquement
router.post('/', 
    checkRole(['manager', 'admin']),
    productController.createProduct
);

router.put('/:id', 
    checkRole(['manager', 'admin']),
    productController.updateProduct
);

router.delete('/:id', 
    checkRole(['manager', 'admin']),
    productController.deleteProduct
);

module.exports = router;