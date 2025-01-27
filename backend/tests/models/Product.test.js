const Product = require('../../models/Product'); // Adjust the path as necessary
const { DataTypes } = require('sequelize');

// Mocking Sequelize's DataTypes
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  return {
    ...actualSequelize,
    DataTypes: {
      UUID: 'UUID',
      STRING: jest.fn(),
      DECIMAL: jest.fn(),
      INTEGER: 'INTEGER',
      ENUM: jest.fn(),
      JSON: 'JSON',
      DATE: 'DATE',
    },
    Sequelize: jest.fn().mockImplementation(() => ({
      define: jest.fn((modelName, attributes, options) => {
        return {
          ...attributes,
          ...options,
          create: jest.fn(),
          findOne: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
        };
      }),
    })),
  };
});


// Mocking external libraries if necessary
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
}));

describe('Product Model', () => {
  let product;

  beforeEach(() => {
    product = new Product({
      name: 'Test Product',
      brand: 'Test Brand',
      category: 'Test Category',
      barcode: '1234567890123',
      price: 10.99,
      stock: 100,
    });
  });

  it('should create a product', () => {
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Test Product');
    expect(product.brand).toBe('Test Brand');
    expect(product.category).toBe('Test Category');
    expect(product.barcode).toBe('1234567890123');
    expect(product.price).toBe(10.99);
    expect(product.stock).toBe(100);
  });

//   it('should ensure price and stock are numbers before saving', async () => {
//     product.price = '20.50'; // Set price as string
//     product.stock = '50'; // Set stock as string

//     await Product.hooks.beforeSave(product);

//     expect(product.price).toBe(20.50); // Should be converted to number
//     expect(product.stock).toBe(50); // Should be converted to number
//   });

//   it('should handle null price and stock correctly', async () => {
//     product.price = null;
//     product.stock = null;

//     await Product.hooks.beforeSave(product);

//     expect(product.price).toBe(0); // Should default to 0
//     expect(product.stock).toBe(0); // Should default to 0
//   });
});
