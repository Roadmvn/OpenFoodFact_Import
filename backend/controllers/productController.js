const { Product } = require('../models');
const openFoodFactsService = require('../services/openFoodFactsService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        logger.info('=== Début getAllProducts ===');
        
        // Récupérer les paramètres de filtrage
        const { search, category, status } = req.query;
        
        // Construire les conditions de recherche
        const where = {};
        
        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }
        
        if (category && category !== 'Toutes les catégories') {
            where.category = category;
        }
        
        if (status) {
            if (Array.isArray(status)) {
                where.status = {
                    [Op.in]: status
                };
            } else {
                where.status = status;
            }
        }

        // Récupérer les produits avec les filtres
        const products = await Product.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        logger.info(`${products.length} produits trouvés`);
        logger.info('=== Fin getAllProducts ===');

        return res.json({
            success: true,
            data: products
        });

    } catch (error) {
        logger.error('=== Erreur dans getAllProducts ===');
        logger.error(`Message d'erreur: ${error.message}`);
        logger.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

// Rechercher un produit par code-barres dans OpenFoodFacts
exports.getProductByBarcode = async (req, res) => {
    try {
        logger.info('=== Début getProductByBarcode dans le contrôleur ===');
        const { barcode } = req.params;
        logger.info(`Code-barres reçu dans le contrôleur: "${barcode}"`);

        // Vérifier si le code-barres est fourni
        if (!barcode) {
            logger.warn('Code-barres manquant dans la requête');
            return res.status(400).json({
                success: false,
                message: 'Le code-barres est requis'
            });
        }

        // Rechercher le produit dans OpenFoodFacts
        logger.debug('Appel du service OpenFoodFacts...');
        const product = await openFoodFactsService.getProductByBarcode(barcode);
        logger.debug('Réponse du service OpenFoodFacts:', JSON.stringify(product, null, 2));

        if (!product) {
            logger.warn(`Aucun produit trouvé pour le code-barres: ${barcode}`);
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }

        logger.info('=== Fin getProductByBarcode - Produit trouvé ===');
        return res.json({
            success: true,
            data: product
        });

    } catch (error) {
        logger.error('=== Erreur dans getProductByBarcode ===');
        logger.error(`Message d'erreur: ${error.message}`);
        logger.error('Stack:', error.stack);
        logger.error('=== Fin de l\'erreur ===');
        
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche du produit',
            error: error.message
        });
    }
};

// Rechercher un produit local par code-barres
exports.getLocalProductByBarcode = async (req, res) => {
    try {
        logger.info('=== Début getLocalProductByBarcode ===');
        const { barcode } = req.params;
        
        logger.info(`Recherche du produit local avec le code-barres: ${barcode}`);
        
        const product = await Product.findOne({
            where: { barcode }
        });
        
        if (product) {
            logger.info('Produit trouvé localement');
            return res.json({
                success: true,
                data: product
            });
        }
        
        logger.info('Produit non trouvé localement');
        return res.json({
            success: false,
            message: 'Produit non trouvé dans la base de données locale'
        });

    } catch (error) {
        logger.error('Erreur lors de la recherche du produit local:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche du produit'
        });
    }
};

// Importer un produit depuis OpenFoodFacts
exports.importProductByBarcode = async (req, res) => {
    try {
        logger.info('=== Début importProductByBarcode dans le contrôleur ===');
        const { barcode } = req.params;
        const { name, price, stock } = req.body;
        
        logger.info(`Code-barres à importer: "${barcode}"`);
        logger.debug('Données reçues:', { name, price, stock });

        // Validation des données
        if (!barcode) {
            logger.warn('Code-barres manquant dans la requête d\'import');
            return res.status(400).json({
                success: false,
                message: 'Le code-barres est requis pour l\'import'
            });
        }

        if (!name || name.trim() === '') {
            logger.warn('Nom du produit manquant');
            return res.status(400).json({
                success: false,
                message: 'Le nom du produit est requis'
            });
        }

        if (typeof price !== 'number' || price < 0) {
            logger.warn('Prix invalide');
            return res.status(400).json({
                success: false,
                message: 'Le prix doit être un nombre positif'
            });
        }

        if (typeof stock !== 'number' || stock < 0) {
            logger.warn('Stock invalide');
            return res.status(400).json({
                success: false,
                message: 'Le stock doit être un nombre positif'
            });
        }

        // Vérifier si le produit existe déjà
        logger.debug('Vérification si le produit existe déjà...');
        const existingProduct = await Product.findOne({ where: { barcode } });
        
        if (existingProduct) {
            logger.warn(`Le produit avec le code-barres ${barcode} existe déjà`);
            return res.status(409).json({
                success: false,
                message: 'Ce produit existe déjà dans la base de données'
            });
        }

        // Rechercher le produit dans OpenFoodFacts
        logger.debug('Recherche du produit dans OpenFoodFacts...');
        const productData = await openFoodFactsService.getProductByBarcode(barcode);

        if (!productData) {
            logger.warn(`Produit non trouvé dans OpenFoodFacts pour l'import: ${barcode}`);
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé dans OpenFoodFacts'
            });
        }

        // Créer le produit dans la base de données avec les données personnalisées
        logger.debug('Création du produit dans la base de données...');
        const product = await Product.create({
            ...productData,
            name: name.trim(), // Utiliser le nom personnalisé
            price,            // Ajouter le prix
            stock,           // Ajouter le stock
            status: 'actif'
        });

        logger.info(`Produit importé avec succès: ${product.name}`);
        logger.info('=== Fin importProductByBarcode - Succès ===');

        return res.status(201).json({
            success: true,
            message: 'Produit importé avec succès',
            data: product
        });

    } catch (error) {
        logger.error('=== Erreur dans importProductByBarcode ===');
        logger.error(`Message d'erreur: ${error.message}`);
        logger.error('Stack:', error.stack);
        logger.error('=== Fin de l\'erreur ===');

        return res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'import du produit',
            error: error.message
        });
    }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
    try {
        logger.info('=== Début createProduct ===');
        const productData = req.body;
        
        logger.info('Données reçues:', productData);
        
        // Validation des données requises
        if (!productData.name || !productData.barcode) {
            logger.warn('Données manquantes');
            return res.status(400).json({
                success: false,
                message: 'Le nom et le code-barres sont requis'
            });
        }
        
        // Vérifier si le produit existe déjà
        const existingProduct = await Product.findOne({
            where: { barcode: productData.barcode }
        });
        
        if (existingProduct) {
            logger.warn('Le produit existe déjà');
            return res.status(400).json({
                success: false,
                message: 'Un produit avec ce code-barres existe déjà'
            });
        }
        
        // Créer le produit
        const product = await Product.create({
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            barcode: productData.barcode,
            imageUrl: productData.imageUrl,
            status: 'active'
        });
        
        logger.info('Produit créé avec succès');
        
        return res.status(201).json({
            success: true,
            message: 'Produit créé avec succès',
            data: product
        });

    } catch (error) {
        logger.error('Erreur lors de la création du produit:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du produit'
        });
    }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        logger.info('=== Début deleteProduct ===');
        const { barcode } = req.params;
        
        logger.info(`Suppression du produit avec le code-barres: ${barcode}`);
        
        const product = await Product.findOne({
            where: { barcode }
        });
        
        if (!product) {
            logger.warn('Produit non trouvé');
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        await product.destroy();
        logger.info('Produit supprimé avec succès');
        
        return res.json({
            success: true,
            message: 'Produit supprimé avec succès'
        });

    } catch (error) {
        logger.error('Erreur lors de la suppression du produit:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du produit'
        });
    }
};