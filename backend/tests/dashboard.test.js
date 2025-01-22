const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestOrder, cleanupDatabase } = require('./testUtils');

describe('Dashboard API', () => {
  let adminToken;
  let userToken;
  let testAdmin;
  let testUser;

  beforeAll(async () => {
    // Créer un admin et un utilisateur normal pour les tests
    testAdmin = await createTestUser({ role: 'admin' });
    testUser = await createTestUser({ role: 'user' });
    
    // Obtenir les tokens
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testAdmin.email,
        password: 'password123'
      });
    adminToken = adminResponse.body.token;

    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123'
      });
    userToken = userResponse.body.token;

    // Créer quelques commandes de test
    await Promise.all([
      createTestOrder({ userId: testUser.id }),
      createTestOrder({ userId: testUser.id }),
      createTestOrder({ userId: testAdmin.id })
    ]);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('GET /api/admin/dashboard', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard');
      
      expect(response.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(403);
    });

    it('should return dashboard data for admin', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(response.body.data).toHaveProperty('salesData');
      expect(response.body.data).toHaveProperty('topProducts');
      expect(response.body.data).toHaveProperty('recentOrders');
      
      // Vérifier la structure des statistiques
      expect(response.body.data.stats).toBeInstanceOf(Array);
      response.body.data.stats.forEach(stat => {
        expect(stat).toHaveProperty('title');
        expect(stat).toHaveProperty('value');
        expect(stat).toHaveProperty('trend');
      });

      // Vérifier la structure des données de vente
      expect(response.body.data.salesData).toBeInstanceOf(Array);
      response.body.data.salesData.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('total');
      });

      // Vérifier la structure des produits populaires
      expect(response.body.data.topProducts).toBeInstanceOf(Array);
      response.body.data.topProducts.forEach(product => {
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('sales');
        expect(product).toHaveProperty('quantity');
      });

      // Vérifier la structure des commandes récentes
      expect(response.body.data.recentOrders).toBeInstanceOf(Array);
      response.body.data.recentOrders.forEach(order => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('customer');
        expect(order).toHaveProperty('date');
        expect(order).toHaveProperty('total');
        expect(order).toHaveProperty('status');
      });
    });
  });
});
