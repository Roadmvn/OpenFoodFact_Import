const { Product } = require('../models');
const { Op } = require('sequelize');

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
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({ message: 'Error retrieving product' });
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

// PATCH /api/products/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newStock = product.stock + parseInt(quantity);
    if (newStock < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await product.update({
      stock: newStock,
      inStock: newStock > 0
    });

    res.json(product);
  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(400).json({ message: 'Error updating stock', error: error.message });
  }
};