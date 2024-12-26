const { Order } = require('../models');
const logger = require('../utils/logger');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
    try {
        const { items, total, shippingAddress } = req.body;
        const userId = req.user.id;

        const order = await Order.create({
            userId,
            items,
            total,
            shippingAddress,
            status: 'pending'
        });

        logger.info(`Nouvelle commande créée: ${order.id}`);
        res.status(201).json(order);
    } catch (error) {
        logger.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
};

// Obtenir les commandes d'un utilisateur
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        logger.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
};

// Obtenir une commande spécifique
exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.json(order);
    } catch (error) {
        logger.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
    }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        order.status = status;
        await order.save();

        logger.info(`Statut de la commande ${orderId} mis à jour: ${status}`);
        res.json(order);
    } catch (error) {
        logger.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Impossible d\'annuler une commande qui n\'est pas en attente' 
            });
        }

        order.status = 'cancelled';
        await order.save();

        logger.info(`Commande ${orderId} annulée`);
        res.json(order);
    } catch (error) {
        logger.error('Erreur lors de l\'annulation de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande' });
    }
};
