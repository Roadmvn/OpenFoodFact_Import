const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestOrder, cleanupDatabase } = require('./testUtils');

describe('Invoice Generation API', () => {
  let userToken;
  let testUser;
  let testOrder;

  beforeAll(async () => {
    // Créer un utilisateur et une commande de test
    testUser = await createTestUser({ role: 'user' });
    testOrder = await createTestOrder({ 
      userId: testUser.id,
      items: [
        { name: 'Burger', price: 9.99, quantity: 2 },
        { name: 'Frites', price: 3.99, quantity: 1 }
      ]
    });
    
    // Obtenir le token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123'
      });
    userToken = response.body.token;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('POST /api/invoices/generate/pdf', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/pdf')
        .send({
          order: testOrder,
          notes: 'Test notes'
        });
      
      expect(response.status).toBe(401);
    });

    it('should generate PDF invoice for authenticated user', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/pdf')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          order: testOrder,
          notes: 'Test notes'
        });
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain(`filename=facture_${testOrder.id}.pdf`);
    });

    it('should return 500 if order data is invalid', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/pdf')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          order: { invalid: 'data' },
          notes: 'Test notes'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/invoices/generate/csv', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/csv')
        .send({
          order: testOrder
        });
      
      expect(response.status).toBe(401);
    });

    it('should generate CSV invoice for authenticated user', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/csv')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          order: testOrder
        });
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv');
      expect(response.headers['content-disposition']).toContain(`filename=facture_${testOrder.id}.csv`);
      
      // Vérifier le contenu du CSV
      const csvLines = response.text.split('\n');
      expect(csvLines[0]).toContain('N° Commande,Date,Client,Email,Produit,Quantité,Prix unitaire,Total ligne');
      expect(csvLines.length).toBeGreaterThan(1);
    });

    it('should return 500 if order data is invalid', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/csv')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          order: { invalid: 'data' }
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
