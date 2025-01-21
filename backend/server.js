require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnections } = require('./config/database');
const { configureSecurityMiddleware } = require('./config/security');
const passport = require('./config/passport');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const routes = require('./routes');

const app = express();

// Sécurité
app.use(helmet());

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Logging
app.use((req, res, next) => {
  if (!req.path.includes('/api/users/login') && !req.path.includes('/api/users/logout')) {
    morgan('combined', { stream: logger.stream })(req, res, next);
  } else {
    next();
  }
});

// Configuration de la sécurité et des sessions
configureSecurityMiddleware(app);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api', routes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error'
      : err.message
  });
});

// Test des connexions à la base de données
testConnections()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to databases:', error);
    process.exit(1);
  });

module.exports = app;