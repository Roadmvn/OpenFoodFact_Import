const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// Routes protégées par authentification
router.use(authenticate);

// Créer une nouvelle commande
router.post('/', validateOrder, orderController.createOrder);

// Obtenir toutes les commandes de l'utilisateur
router.get('/user', orderController.getUserOrders);

// Obtenir une commande spécifique
router.get('/:orderId', orderController.getOrder);

// Mettre à jour le statut d'une commande
router.patch('/:orderId/status', orderController.updateOrderStatus);

// Annuler une commande
router.post('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;
