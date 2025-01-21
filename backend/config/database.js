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
  dialectOptions: {
    // MySQL 8.0 身份验证配置
    connectTimeout: 10000,
    authPlugins: {
      mysql_native_password: true // 强制使用 mysql_native_password 身份验证
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Local database configuration with mysql_native_password option
const localDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 添加 MySQL 8.0 authentication 支持
  authPlugins: {
    mysql_native_password: true
  }
};

// Remote database configuration with mysql_native_password option
const remoteDbConfig = {
  host: process.env.REMOTE_DB_HOST,
  port: process.env.REMOTE_DB_PORT,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
  database: process.env.REMOTE_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 添加 MySQL 8.0 authentication 支持
  authPlugins: {
    mysql_native_password: true
  }
};

// Create connection pools with adjusted MySQL 8.0 compatibility
const localPool = mysql.createPool(localDbConfig); // mysql2 with native password auth
const remotePool = mysql.createPool(remoteDbConfig); // mysql2 with native password auth

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully.');

    // Sync models to database (alter: true updates tables without recreating them)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

// Test pool connections
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