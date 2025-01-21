const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route pour démarrer l'authentification Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Callback après l'authentification Google
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/'
    })
);

// Vérifier l'état de l'authentification
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la déconnexion'
            });
        }
        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    });
});

module.exports = router;
