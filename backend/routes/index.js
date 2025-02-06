const express = require('express');
const router = express.Router();

// 引入 Product 路由
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const internalproducts = require('./internalProductRoutes');
const cartRoutes = require('./cartRoutes');
const ordersRoutes = require('./orderRoutes');
const paypalRoutes = require('./paypalRoutes');

// 添加路由前缀 /api/products
router.use('/products', productRoutes);
router.use('/user', userRoutes);
router.use('/internal-products', internalproducts);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/paypal', paypalRoutes);

module.exports = router;