const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Product = db.sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    imageUrl: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    imageSmallUrl: {
        type: DataTypes.STRING(1024),
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true 
});

module.exports = Product;