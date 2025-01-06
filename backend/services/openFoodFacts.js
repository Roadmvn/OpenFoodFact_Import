const axios = require('axios');
const logger = require('../utils/logger');

const BASE_URL = 'https://world.openfoodfacts.net/api/v2';

// Récupérer les détails d'un produit par son code-barres
exports.getProductByBarcode = async (barcode) => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${barcode}`);
        if (response.data.status === 1) {
            return {
                barcode: response.data.code,
                name: response.data.product.product_name,
                details: response.data.product
            };
        }
        return null;
    } catch (error) {
        logger.error(`Erreur lors de la récupération du produit ${barcode}:`, error);
        throw new Error('Erreur lors de la récupération du produit');
    }
};

// Rechercher des produits
exports.searchProducts = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                search_terms: query,
                fields: 'code,product_name',
                page_size: 10
            }
        });

        if (response.data.products) {
            return response.data.products.map(product => ({
                barcode: product.code,
                name: product.product_name
            }));
        }
        return [];
    } catch (error) {
        logger.error('Erreur lors de la recherche de produits:', error);
        throw new Error('Erreur lors de la recherche de produits');
    }
};