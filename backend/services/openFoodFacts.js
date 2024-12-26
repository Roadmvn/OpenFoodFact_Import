const axios = require('axios');

const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product/';

async function getProductInfo(barcode) {
    try {
        const response = await axios.get(`${BASE_URL}${barcode}.json`);
        
        if (response.data.status === 0) {
            throw new Error('Product not found');
        }

        const product = response.data.product;
        
        return {
            barcode,
            name: product.product_name,
            brand: product.brands,
            quantity: product.quantity,
            categories: product.categories,
            imageUrl: product.image_url,
            nutritionGrade: product.nutrition_grade_fr,
            ingredients: product.ingredients_text,
            allergens: product.allergens,
            nutriments: {
                energy: product.nutriments.energy_100g,
                fat: product.nutriments.fat_100g,
                carbohydrates: product.nutriments.carbohydrates_100g,
                proteins: product.nutriments.proteins_100g,
                salt: product.nutriments.salt_100g
            }
        };
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des données OpenFoodFacts:', error);
        throw new Error('Failed to fetch product information');
    }
}

async function searchProducts(query, page = 1, pageSize = 20) {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
            params: {
                search_terms: query,
                json: 1,
                page,
                page_size: pageSize
            }
        });

        return {
            products: response.data.products.map(product => ({
                barcode: product.code,
                name: product.product_name,
                brand: product.brands,
                imageUrl: product.image_url,
                quantity: product.quantity
            })),
            total: response.data.count,
            page: response.data.page,
            pageSize: response.data.page_size
        };
    } catch (error) {
        console.error('❌ Erreur lors de la recherche OpenFoodFacts:', error);
        throw new Error('Failed to search products');
    }
}

module.exports = {
    getProductInfo,
    searchProducts
};