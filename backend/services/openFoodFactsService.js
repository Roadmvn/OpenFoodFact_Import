const axios = require('axios');
const logger = require('../utils/logger');

class OpenFoodFactsService {
    constructor() {
        this.baseURL = 'https://world.openfoodfacts.net/api/v2';
        this.axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                'User-Agent': 'SuperMarche - Application de gestion de magasin'
            }
        });
    }

    // Nettoie le code-barres des caractères non désirés
    cleanBarcode(barcode) {
        logger.debug(`Nettoyage du code-barres: "${barcode}"`);
        
        // Enlever "(EAN / EAN-13)" et autres textes entre parenthèses
        let cleaned = barcode.replace(/\([^)]*\)/g, '');
        logger.debug(`Après suppression des parenthèses: "${cleaned}"`);
        
        // Enlever les espaces et caractères non numériques
        cleaned = cleaned.replace(/[^0-9]/g, '');
        logger.debug(`Après nettoyage final: "${cleaned}"`);
        
        return cleaned;
    }

    // Récupère un produit par son code-barres depuis OpenFoodFacts
    async getProductByBarcode(barcode) {
        try {
            logger.info('=== Début de la recherche du produit ===');
            logger.info(`Code-barres original: "${barcode}"`);
            
            if (!barcode) {
                logger.warn('Code-barres manquant');
                throw new Error('Le code-barres est requis');
            }

            // Nettoyer le code-barres
            const cleanBarcode = this.cleanBarcode(barcode);
            
            if (!cleanBarcode) {
                logger.warn('Code-barres invalide après nettoyage');
                throw new Error('Code-barres invalide - doit contenir des chiffres');
            }

            const url = `${this.baseURL}/product/${cleanBarcode}`;
            logger.info(`URL de l'API: ${url}`);

            logger.debug('Envoi de la requête à l\'API...');
            const response = await this.axiosInstance.get(url);
            logger.debug('Réponse reçue de l\'API');
            
            if (!response.data) {
                logger.warn('Réponse API vide');
                return null;
            }

            logger.debug('Contenu de la réponse:', JSON.stringify(response.data, null, 2));
            
            const { status, product } = response.data;
            
            if (!product || status === 0) {
                logger.warn(`Produit non trouvé dans OpenFoodFacts (status: ${status})`);
                return null;
            }

            logger.debug('Construction du produit formaté...');
            // Retourne uniquement les informations essentielles du produit
            const formattedProduct = {
                barcode: product.code || cleanBarcode,
                name: product.product_name || product.product_name_fr || 'Produit inconnu',
                brand: product.brands || 'Marque inconnue',
                imageUrl: product.image_url || product.selected_images?.front?.display?.fr || null,
                description: product.ingredients_text || product.ingredients_text_fr || '',
                categories: product.categories_tags?.join(', ') || '',
                quantity: product.quantity || '',
                labels: product.labels_tags?.join(', ') || ''
            };

            logger.info(`Produit trouvé: "${formattedProduct.name}"`);
            logger.debug('Produit formaté:', JSON.stringify(formattedProduct, null, 2));
            logger.info('=== Fin de la recherche du produit ===');
            
            return formattedProduct;

        } catch (error) {
            logger.error('=== Erreur lors de la recherche du produit ===');
            if (error.response) {
                // Erreur avec réponse du serveur
                logger.error(`Status: ${error.response.status}`);
                logger.error(`Message: ${error.response.data?.message || error.message}`);
                logger.error('Headers:', JSON.stringify(error.response.headers, null, 2));
                if (error.response.status === 404) {
                    return null;
                }
            } else if (error.request) {
                // Erreur sans réponse du serveur (timeout, etc.)
                logger.error(`Erreur réseau: ${error.message}`);
                logger.error('Request:', error.request);
            } else {
                // Erreur de configuration de la requête
                logger.error(`Erreur de configuration: ${error.message}`);
            }
            logger.error(`Stack: ${error.stack}`);
            logger.error('=== Fin de l\'erreur ===');
            
            throw new Error(`Erreur lors de la recherche du produit: ${error.message}`);
        }
    }

    // Rechercher des produits par terme de recherche
    async searchProducts(query) {
        try {
            logger.info('=== Début de la recherche de produits ===');
            logger.info(`Terme de recherche: "${query}"`);
            
            if (!query) {
                logger.warn('Terme de recherche manquant');
                throw new Error('Le terme de recherche est requis');
            }

            const url = `${this.baseURL}/search`;
            logger.info(`URL de l'API: ${url}`);

            logger.debug('Envoi de la requête à l\'API...');
            const response = await this.axiosInstance.get(url, {
                params: {
                    search_terms: query,
                    fields: 'code,product_name,brands,image_url,ingredients_text,categories_tags,quantity,labels_tags',
                    page_size: 10
                }
            });
            logger.debug('Réponse reçue de l\'API');
            
            if (!response.data || !response.data.products) {
                logger.warn('Réponse API vide ou sans produits');
                return [];
            }

            logger.debug('Contenu de la réponse:', JSON.stringify(response.data, null, 2));
            
            const formattedProducts = response.data.products.map(product => ({
                barcode: product.code,
                name: product.product_name || product.product_name_fr || 'Produit inconnu',
                brand: product.brands || 'Marque inconnue',
                imageUrl: product.image_url || product.selected_images?.front?.display?.fr || null,
                description: product.ingredients_text || product.ingredients_text_fr || '',
                categories: product.categories_tags?.join(', ') || '',
                quantity: product.quantity || '',
                labels: product.labels_tags?.join(', ') || ''
            }));

            logger.info(`${formattedProducts.length} produits trouvés`);
            logger.debug('Produits formatés:', JSON.stringify(formattedProducts, null, 2));
            logger.info('=== Fin de la recherche de produits ===');
            
            return formattedProducts;

        } catch (error) {
            logger.error('=== Erreur lors de la recherche de produits ===');
            if (error.response) {
                logger.error(`Status: ${error.response.status}`);
                logger.error(`Message: ${error.response.data?.message || error.message}`);
                logger.error('Headers:', JSON.stringify(error.response.headers, null, 2));
            } else if (error.request) {
                logger.error(`Erreur réseau: ${error.message}`);
                logger.error('Request:', error.request);
            } else {
                logger.error(`Erreur de configuration: ${error.message}`);
            }
            logger.error(`Stack: ${error.stack}`);
            logger.error('=== Fin de l\'erreur ===');
            
            throw new Error(`Erreur lors de la recherche de produits: ${error.message}`);
        }
    }
}

module.exports = new OpenFoodFactsService();
