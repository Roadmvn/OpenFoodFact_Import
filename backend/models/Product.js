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
    brand: {
        type: DataTypes.STRING,
        allowNull: true
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
    ingredients: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nutritionGrade: {
        type: DataTypes.STRING(1),
        allowNull: true
    },
    ecoScore: {
        type: DataTypes.STRING(1),
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageSmallUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageFrontUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categories: {
        type: DataTypes.STRING,
        allowNull: true
    },
    labels: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    servingSize: {
        type: DataTypes.STRING,
        allowNull: true
    },
    allergens: {
        type: DataTypes.STRING,
        allowNull: true
    },
    traces: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nutriments: {
        type: DataTypes.JSON,
        allowNull: true
    },
    keywords: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    lastUpdatedOFF: {
        type: DataTypes.DATE,
        allowNull: true
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