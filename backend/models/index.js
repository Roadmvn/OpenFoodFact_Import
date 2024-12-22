const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Invoice = require('./Invoice');

// Définir les relations entre les modèles
Invoice.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Invoice, { foreignKey: 'userId' });

Invoice.belongsToMany(Product, { 
  through: 'InvoiceProducts',
  foreignKey: 'invoiceId'
});
Product.belongsToMany(Invoice, { 
  through: 'InvoiceProducts',
  foreignKey: 'productId'
});

module.exports = {
  sequelize,
  User,
  Product,
  Invoice
};
