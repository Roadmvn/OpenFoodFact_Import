const Invoice = require('../../models/Invoice'); // Adjust the path as necessary
const { DataTypes } = require('sequelize');

// Mocking Sequelize's DataTypes and the Invoice model
jest.mock('sequelize', () => {
  return {
    DataTypes: {
      UUID: 'UUID',
      STRING: 'STRING',
      DECIMAL: jest.fn(), // Ensure DECIMAL is mocked correctly
      ENUM: jest.fn(),
      JSON: 'JSON',
      DATE: 'DATE',
    },
    Sequelize: jest.fn().mockImplementation(() => ({
      define: jest.fn().mockReturnValue({
        prototype: {},
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        // Add other methods as needed
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

describe('Invoice Model', () => {
  let invoice;

  beforeEach(() => {
    invoice = new Invoice({
      userId: 'user-uuid',
      invoiceNumber: 'INV-12345',
      subtotal: 100.00,
      tax: 10.00,
      discount: 5.00,
      billingAddress: { street:'123 Main St', city:'Anytown', country:'USA' },
      items:[{ productId:'product-uuid', quantity :1 }]
    });
  });

//   it('should create an invoice', () => {
//      expect(invoice).toHaveProperty('id');
//      expect(invoice.invoiceNumber).toBe('INV-12345');
//      expect(invoice.subtotal).toBe(100.00);
//      expect(invoice.tax).toBe(10.00);
//      expect(invoice.discount).toBe(5.00);
//      expect(invoice.total).toBe(105.00); // This should be calculated in the hook
//      expect(invoice.billingAddress).toEqual({ street:'123 Main St', city:'Anytown', country:'USA' });
//    });

//    it('should calculate the total correctly in beforeValidate hook', async () => {
//      await Invoice.hooks.beforeValidate(invoice);
     
//      expect(invoice.total).toBe(105.00); // subtotal + tax - discount
//    });
});
