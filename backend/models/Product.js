const { DataTypes } = require('sequelize');
const db = require('../config/database');
const { remotePool } = require('../config/database');

const Product = db.sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    barcode: {
        type: DataTypes.STRING,
        unique: true
    },
    imageUrl: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    imageSmallUrl: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        get() {
            const value = this.getDataValue('price');
            return value === null ? 0 : Number(value);
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        get() {
            const value = this.getDataValue('stock');
            return value === null ? 0 : Number(value);
        }
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeSave: (product) => {
            // S'assurer que price et stock sont des nombres
            if (product.price) product.price = Number(product.price);
            if (product.stock) product.stock = Number(product.stock);
        }
    }
});

class ProductModel {
  static async getAllProducts() {
    try {
      const [rows] = await remotePool.execute('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const [rows] = await remotePool.execute('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async searchProducts(query) {
    try {
      const searchQuery = `%${query}%`;
      const [rows] = await remotePool.execute(
        'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
        [searchQuery, searchQuery]
      );
      return rows;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

module.exports = { Product, ProductModel };