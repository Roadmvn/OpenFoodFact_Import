const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Product = db.sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['barcode']
        }
    ]
});

module.exports = Product;