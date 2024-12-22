const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { auth, checkRole } = require('../middleware/auth');
const { validateInvoice } = require('../middleware/validation');

// Routes protégées
router.use(auth);

// Routes accessibles aux utilisateurs normaux
router.get('/', invoiceController.getInvoices);
router.get('/stats', invoiceController.getInvoiceStats);
router.get('/:id', invoiceController.getInvoice);

// Routes pour les managers et admins
router.use(checkRole(['manager', 'admin']));

router.post('/', validateInvoice, invoiceController.createInvoice);
router.put('/:id', validateInvoice, invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;