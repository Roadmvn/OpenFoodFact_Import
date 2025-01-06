const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:19006', 'exp://192.168.1.X:19000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// Logging
app.use((req, res, next) => {
  if (!req.path.includes('/api/users/login') && !req.path.includes('/api/users/logout')) {
    morgan('combined', { stream: logger.stream })(req, res, next);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message
  });
});

const PORT = process.env.PORT || 3000;

// Initialisation de la base de données et démarrage du serveur
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;