const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Routes protégées par authentification et rôle admin
router.use(isAuthenticated, isAdmin);

// GET /api/admin/dashboard
router.get('/', dashboardController.getDashboardData);

module.exports = router;
