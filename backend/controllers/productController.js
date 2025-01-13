const { Product } = require('../models');
const openFoodFactsService = require('../services/openFoodFactsService');
const logger = require('../utils/logger');

// Rechercher un produit par code-barres dans OpenFoodFacts
exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;

        // Vérifier si le code-barres est fourni
        if (!barcode) {
            return res.status(400).json({
                message: 'Le code-barres est requis'
            });
        }

        // Rechercher dans OpenFoodFacts
        const product = await openFoodFactsService.getProductByBarcode(barcode);
        
        if (!product) {
            return res.status(404).json({
                message: `Produit avec code-barres ${barcode} non trouvé`
            });
        }

        res.json({
            product
        });
    } catch (error) {
        logger.error(`Erreur lors de la recherche du produit: ${error.message}`);
        res.status(500).json({
            message: 'Erreur lors de la recherche du produit',
            error: error.message
        });
    }
};

// Importer un produit depuis OpenFoodFacts
exports.importProductByBarcode = async (req, res) => {
    try {
        const { barcode, stock = 0 } = req.body;

        // Vérifier si le code-barres est fourni
        if (!barcode) {
            return res.status(400).json({
                message: 'Le code-barres est requis'
            });
        }

        // Vérifier si le produit existe déjà
        let existingProduct = await Product.findOne({
            where: { barcode }
        });

        if (existingProduct) {
            return res.status(400).json({
                message: 'Ce produit existe déjà dans la base de données',
                product: existingProduct
            });
        }

        // Récupérer les données depuis OpenFoodFacts
        const offProduct = await openFoodFactsService.getProductByBarcode(barcode);
        
        if (!offProduct) {
            return res.status(404).json({
                message: `Produit avec code-barres ${barcode} non trouvé dans OpenFoodFacts`
            });
        }

        // Créer le produit dans notre base
        const product = await Product.create({
            ...offProduct,
            stock
        });

        res.status(201).json({
            message: 'Produit importé avec succès',
            product
        });
    } catch (error) {
        logger.error(`Erreur lors de l'importation du produit: ${error.message}`);
        res.status(500).json({
            message: 'Erreur lors de l\'importation du produit',
            error: error.message
        });
    }
};