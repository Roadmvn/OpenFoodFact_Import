const { Product } = require('../models');
const { Op } = require('sequelize');
const openFoodFactsService = require('../services/openFoodFacts');
const logger = require('../utils/logger');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
      search = '',
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    // Construire les conditions de recherche
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
    if (inStock !== undefined) where.inStock = inStock;

    const products = await Product.findAndCountAll({
      where,
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      products: products.rows,
      total: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Récupérer les détails complets depuis OpenFoodFacts
    const offProduct = await openFoodFactsService.getProductByBarcode(product.barcode);
    
    res.json({
      ...product.toJSON(),
      details: offProduct?.details || null
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Rechercher des produits dans OpenFoodFacts
exports.searchOpenFoodFacts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await openFoodFactsService.searchProducts(query);
    res.json(products);
  } catch (error) {
    logger.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche de produits' });
  }
};

// Importer un produit depuis OpenFoodFacts
exports.importProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    const { stock = 0 } = req.body;

    // Vérifier si le produit existe déjà
    let product = await Product.findOne({ where: { barcode } });
    
    if (product) {
      // Mettre à jour le stock si le produit existe
      product.stock += parseInt(stock);
      await product.save();
      logger.info(`Stock du produit ${barcode} mis à jour: ${product.stock}`);
    } else {
      // Récupérer les infos du produit depuis OpenFoodFacts
      const offProduct = await openFoodFactsService.getProductByBarcode(barcode);
      
      if (!offProduct) {
        return res.status(404).json({ error: 'Produit non trouvé sur OpenFoodFacts' });
      }

      // Créer le produit localement
      product = await Product.create({
        barcode,
        name: offProduct.name,
        stock: parseInt(stock)
      });
      logger.info(`Nouveau produit importé: ${barcode}`);
    }

    res.json(product);
  } catch (error) {
    logger.error('Erreur lors de l\'import du produit:', error);
    res.status(500).json({ error: 'Erreur lors de l\'import du produit' });
  }
};

// Mettre à jour le stock d'un produit
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    product.stock = parseInt(stock);
    await product.save();

    logger.info(`Stock du produit ${id} mis à jour: ${stock}`);
    res.json(product);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du stock:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
  }
};