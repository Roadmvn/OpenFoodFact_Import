const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      unique: true,
      fields: ['sku']
    },
    {
      fields: ['category']
    },
    {
      fields: ['brand']
    }
  ]
});

module.exports = Product;