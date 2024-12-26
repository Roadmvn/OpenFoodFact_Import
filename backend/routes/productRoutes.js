const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const openFoodFactsController = require('../controllers/openFoodFactsController');
const { auth, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { productRules } = require('../middleware/validationRules');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Routes protégées (authentification requise)
router.use(auth);

// Routes OpenFoodFacts (managers et admins)
router.get('/openfoodfacts/search', checkRole(['manager', 'admin']), openFoodFactsController.searchProducts);
router.post('/openfoodfacts/import/:barcode', 
    checkRole(['manager', 'admin']), 
    openFoodFactsController.importProduct
);
router.put('/openfoodfacts/update/:id', 
    checkRole(['manager', 'admin']), 
    openFoodFactsController.updateProductInfo
);

// Routes pour manager et admin uniquement
router.post('/', 
    checkRole(['manager', 'admin']),
    validate(productRules.create),
    productController.createProduct
);

router.put('/:id', 
    checkRole(['manager', 'admin']),
    validate(productRules.update),
    productController.updateProduct
);

router.delete('/:id', 
    checkRole(['manager', 'admin']),
    productController.deleteProduct
);

router.patch('/:id/stock',
    checkRole(['manager', 'admin']),
    validate(productRules.updateStock),
    productController.updateStock
);

module.exports = router;