const express = require('express');
const router = express.Router();

// Importer les routes
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const reportRoutes = require('./reportRoutes');
const statsRoutes = require('./statsRoutes');

// Monter les routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reports', reportRoutes);
router.use('/stats', statsRoutes);

// Route de base pour vérifier que l'API fonctionne
router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API du système de gestion de supermarché',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Route pour la documentation API (à implémenter plus tard avec Swagger)
router.get('/docs', (req, res) => {
  res.json({
    message: 'Documentation API à venir',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      invoices: '/api/invoices',
      reports: '/api/reports'
    }
  });
});

module.exports = router;
