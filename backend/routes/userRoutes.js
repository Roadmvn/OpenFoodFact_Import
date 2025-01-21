const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');
const { validateUser, validatePassword } = require('../middleware/validation');

// Routes publiques
router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);

// Routes protégées
router.use(auth);
router.get('/profile', userController.getProfile);
router.put('/profile', validateUser, userController.updateProfile);

// Routes admin
router.use(checkRole(['admin']));
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/reset-password', validatePassword, userController.resetPassword);

module.exports = router;