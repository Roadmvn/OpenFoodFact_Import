const axios = require('axios');

const BASE_URL = 'https://world.openfoodfacts.org';
const API_URL = `${BASE_URL}/api/v2`;

// Formater les données nutritionnelles
function formatNutriments(nutriments) {
    return {
        energy: nutriments.energy_100g,
        fat: nutriments.fat_100g,
        saturatedFat: nutriments.saturated_fat_100g,
        carbohydrates: nutriments.carbohydrates_100g,
        sugars: nutriments.sugars_100g,
        proteins: nutriments.proteins_100g,
        salt: nutriments.salt_100g,
        fiber: nutriments.fiber_100g,
        sodium: nutriments.sodium_100g
    };
}

// Formater les allergènes
function formatAllergens(allergens) {
    if (!allergens) return [];
    return allergens.split(',')
        .map(allergen => allergen.trim())
        .filter(Boolean);
}

// Récupérer les informations d'un produit par code-barres
async function getProductInfo(barcode) {
    try {
        console.log(' Recherche du produit:', barcode);
        const response = await axios.get(`${API_URL}/product/${barcode}`);
        
        if (response.data.status === 0) {
            console.log(' Produit non trouvé:', barcode);
            throw new Error('Product not found');
        }

        const product = response.data.product;
        console.log(' Produit trouvé:', product.product_name);
        
        return {
            barcode,
            name: product.product_name,
            brand: product.brands,
            quantity: product.quantity,
            categories: product.categories?.split(',').map(c => c.trim()),
            imageUrl: product.image_url,
            thumbnailUrl: product.image_thumb_url,
            nutritionGrade: product.nutrition_grade_fr,
            ecoScore: product.ecoscore_grade,
            novaGroup: product.nova_group,
            ingredients: product.ingredients_text,
            allergens: formatAllergens(product.allergens),
            traces: formatAllergens(product.traces),
            labels: product.labels?.split(',').map(l => l.trim()),
            stores: product.stores?.split(',').map(s => s.trim()),
            countries: product.countries?.split(',').map(c => c.trim()),
            nutriments: formatNutriments(product.nutriments),
            servingSize: product.serving_size,
            packaging: product.packaging?.split(',').map(p => p.trim()),
            additives: product.additives_tags?.map(a => a.replace('en:', '')),
            lastModified: product.last_modified_t
        };
    } catch (error) {
        console.error(' Erreur lors de la récupération des données OpenFoodFacts:', error);
        throw new Error('Failed to fetch product information');
    }
}

// Rechercher des produits
async function searchProducts(query, options = {}) {
    try {
        console.log(' Recherche de produits:', query, options);
        const {
            page = 1,
            pageSize = 20,
            category,
            nutritionGrade,
            novaGroup,
            ecoScore,
            allergens,
            brands,
            labels,
            countries
        } = options;

        const params = {
            search_terms: query,
            json: 1,
            page,
            page_size: pageSize,
            fields: 'code,product_name,brands,image_url,nutrition_grade_fr,ecoscore_grade,nova_group,quantity'
        };

        // Ajout des filtres optionnels
        if (category) params.categories_tags = category;
        if (nutritionGrade) params.nutrition_grade_fr = nutritionGrade;
        if (novaGroup) params.nova_group = novaGroup;
        if (ecoScore) params.ecoscore_grade = ecoScore;
        if (allergens) params.allergens_tags = allergens;
        if (brands) params.brands_tags = brands;
        if (labels) params.labels_tags = labels;
        if (countries) params.countries_tags = countries;

        const response = await axios.get(`${BASE_URL}/cgi/search.pl`, { params });

        console.log(' Produits trouvés:', response.data.count);

        return {
            products: response.data.products.map(product => ({
                barcode: product.code,
                name: product.product_name,
                brand: product.brands,
                imageUrl: product.image_url,
                quantity: product.quantity,
                nutritionGrade: product.nutrition_grade_fr,
                ecoScore: product.ecoscore_grade,
                novaGroup: product.nova_group
            })),
            total: response.data.count,
            page: response.data.page,
            pageSize: response.data.page_size
        };
    } catch (error) {
        console.error(' Erreur lors de la recherche OpenFoodFacts:', error);
        throw new Error('Failed to search products');
    }
}

// Récupérer les catégories disponibles
async function getCategories() {
    try {
        console.log(' Récupération des catégories');
        const response = await axios.get(`${API_URL}/categories`);
        console.log(' Catégories récupérées:', response.data.count);
        return response.data.tags;
    } catch (error) {
        console.error(' Erreur lors de la récupération des catégories:', error);
        throw new Error('Failed to fetch categories');
    }
}

// Récupérer les labels disponibles
async function getLabels() {
    try {
        console.log(' Récupération des labels');
        const response = await axios.get(`${API_URL}/labels`);
        console.log(' Labels récupérés:', response.data.count);
        return response.data.tags;
    } catch (error) {
        console.error(' Erreur lors de la récupération des labels:', error);
        throw new Error('Failed to fetch labels');
    }
}

module.exports = {
    getProductInfo,
    searchProducts,
    getCategories,
    getLabels
};