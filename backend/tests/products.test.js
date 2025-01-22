const request = require('supertest');
const app = require('../server');
const { remotePool } = require('../config/database');

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/products/search', () => {
    it('should search products by query', async () => {
      const searchQuery = 'test';
      const response = await request(app)
        .get(`/api/products/search?query=${searchQuery}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return error for empty query', async () => {
      const response = await request(app)
        .get('/api/products/search');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      // Obtenir d'abord un ID valide
      const productsResponse = await request(app)
        .get('/api/products');
      
      const firstProduct = productsResponse.body.data[0];
      if (firstProduct) {
        const response = await request(app)
          .get(`/api/products/${firstProduct.id}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(firstProduct.id);
      }
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
