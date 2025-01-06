const db = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Invoice = require('./Invoice');
const Order = require('./Order');

// Définir les relations entre les modèles
Invoice.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Invoice, { foreignKey: 'userId' });

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

Invoice.belongsToMany(Product, { 
  through: 'InvoiceProducts',
  foreignKey: 'invoiceId'
});
Product.belongsToMany(Invoice, { 
  through: 'InvoiceProducts',
  foreignKey: 'productId'
});

module.exports = {
  sequelize: db.sequelize,
  User,
  Product,
  Invoice,
  Order
};
