const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'supermarket_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'root';
const dbHost = process.env.DB_HOST || 'localhost';

// Créer la base de données si elle n'existe pas
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
    await connection.end();
    console.log('✅ Base de données vérifiée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la base de données:', error);
    throw error;
  }
};

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

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
    // Vérifier/créer la base de données si nécessaire
    await createDatabase();

    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');

    // Synchroniser les modèles avec la base de données
    // force: false - Ne pas supprimer les tables existantes
    // alter: true - Mettre à jour les tables si nécessaire
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Base de données et tables synchronisées avec succès.');

    // Créer l'utilisateur admin par défaut
    const { User } = require('../models');
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Utilisateur admin créé avec succès.');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initializeDatabase
};