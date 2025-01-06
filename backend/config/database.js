const { Sequelize } = require('sequelize');
require('dotenv').config();

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

// Fonction pour créer l'utilisateur admin par défaut
const createDefaultAdmin = async () => {
  try {
    const User = require('../models/User');
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });

    if (!adminUser) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123', // Le mot de passe sera hashé automatiquement grâce aux hooks
        role: 'admin'
      });
      console.log('✅ Utilisateur admin créé avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error);
  }
};

// Fonction pour nettoyer les index redondants
const cleanupRedundantIndexes = async () => {
  try {
    // Vérifier si la table Products existe
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = '${dbName}' 
      AND TABLE_NAME = 'Products'
    `);

    if (tables.length === 0) {
      console.log('Table Products n\'existe pas encore, pas besoin de nettoyer les index.');
      return;
    }

    // Supprimer d'abord tous les index sauf PRIMARY
    const [indexes] = await sequelize.query(`
      SELECT index_name 
      FROM information_schema.statistics 
      WHERE table_schema = '${dbName}' 
      AND table_name = 'Products'
      AND index_name != 'PRIMARY'
    `);

    // Supprimer les index un par un
    for (const index of indexes) {
      if (index.index_name) {
        try {
          await sequelize.query(`DROP INDEX ${index.index_name} ON Products`);
          console.log(`✅ Index supprimé: ${index.index_name}`);
        } catch (err) {
          console.error(`❌ Erreur lors de la suppression de l'index ${index.index_name}:`, err.message);
        }
      }
    }

    // Recréer uniquement les index nécessaires
    await sequelize.query(`
      ALTER TABLE Products
      ADD UNIQUE INDEX sku (sku),
      ADD UNIQUE INDEX barcode (barcode),
      ADD INDEX products_category (category),
      ADD INDEX products_brand (brand)
    `);
    console.log('✅ Index essentiels recréés avec succès');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des index:', error);
  }
};

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');

    // Nettoyer les index redondants avant la synchronisation
    await cleanupRedundantIndexes();

    // Synchroniser les modèles avec la base de données avec force: true pour recréer la table
    await sequelize.sync({ force: true });
    console.log('✅ Modèles synchronisés avec la base de données.');

    // Créer l'utilisateur admin par défaut
    await createDefaultAdmin();

  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initializeDatabase
};