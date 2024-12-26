const { Product } = require('../models');
const openFoodFactsService = require('../services/openFoodFacts');

// Rechercher des produits dans OpenFoodFacts
exports.searchProducts = async (req, res) => {
    try {
        const { query, page = 1, pageSize = 20 } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        console.log('🔍 Recherche de produits OpenFoodFacts:', { query, page, pageSize });
        const results = await openFoodFactsService.searchProducts(query, page, pageSize);
        
        console.log('✅ Résultats trouvés:', { count: results.products.length });
        res.json(results);
    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
};

// Importer un produit depuis OpenFoodFacts
exports.importProduct = async (req, res) => {
    try {
        const { barcode } = req.params;
        const { storeId } = req.body;

        console.log('📦 Import de produit OpenFoodFacts:', { barcode, storeId });

        // Vérifier si le produit existe déjà
        const existingProduct = await Product.findOne({
            where: { barcode }
        });

        if (existingProduct) {
            console.log('⚠️ Produit déjà existant:', { barcode });
            return res.status(400).json({ 
                message: 'Product already exists',
                product: existingProduct
            });
        }

        // Récupérer les informations du produit
        const productInfo = await openFoodFactsService.getProductInfo(barcode);

        // Créer le produit dans notre base de données
        const product = await Product.create({
            name: productInfo.name,
            barcode: productInfo.barcode,
            brand: productInfo.brand,
            quantity: 0, // Quantité initiale à 0
            price: 0, // Prix à définir par l'utilisateur
            category: productInfo.categories?.split(',')[0] || 'Uncategorized',
            imageUrl: productInfo.imageUrl,
            nutritionGrade: productInfo.nutritionGrade,
            ingredients: productInfo.ingredients,
            allergens: productInfo.allergens,
            nutriments: productInfo.nutriments,
            storeId: storeId
        });

        console.log('✅ Produit importé avec succès:', { 
            id: product.id,
            name: product.name,
            barcode: product.barcode
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('❌ Erreur lors de l\'import:', error);
        res.status(500).json({ 
            message: 'Error importing product',
            error: error.message
        });
    }
};

// Mettre à jour un produit avec les données OpenFoodFacts
exports.updateProductInfo = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🔄 Mise à jour produit depuis OpenFoodFacts:', { id });

        // Récupérer le produit existant
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.barcode) {
            return res.status(400).json({ message: 'Product has no barcode' });
        }

        // Récupérer les nouvelles informations
        const productInfo = await openFoodFactsService.getProductInfo(product.barcode);

        // Mettre à jour le produit
        await product.update({
            name: productInfo.name,
            brand: productInfo.brand,
            category: productInfo.categories?.split(',')[0] || product.category,
            imageUrl: productInfo.imageUrl,
            nutritionGrade: productInfo.nutritionGrade,
            ingredients: productInfo.ingredients,
            allergens: productInfo.allergens,
            nutriments: productInfo.nutriments
        });

        console.log('✅ Produit mis à jour avec succès:', { 
            id: product.id,
            name: product.name
        });

        res.json(product);
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        res.status(500).json({ 
            message: 'Error updating product information',
            error: error.message
        });
    }
};
