const { Sequelize } = require('sequelize');
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || 'supermarket_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'root';
const dbHost = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Configuration de la base de données locale
const localDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce'
};

// Configuration de la base de données distante (produits)
const remoteDbConfig = {
  host: process.env.REMOTE_DB_HOST,
  port: process.env.REMOTE_DB_PORT,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
  database: process.env.REMOTE_DB_NAME
};

// Création des pools de connexions
const localPool = mysql.createPool(localDbConfig);
const remotePool = mysql.createPool(remoteDbConfig);

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');

    // Synchroniser les modèles avec la base de données (alter: true pour mettre à jour les tables sans les recréer)
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée avec succès.');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
    throw error;
  }
};

// Test des connexions
const testConnections = async () => {
  try {
    await localPool.getConnection();
    console.log('Connected to local database successfully');
    
    await remotePool.getConnection();
    console.log('Connected to remote products database successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Sequelize,
  initializeDatabase,
  localPool,
  remotePool,
  testConnections
};