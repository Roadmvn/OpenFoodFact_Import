const request = require('supertest');
const app = require('../server');
const { localPool } = require('../config/database');

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Nettoyer la base de données de test
    await localPool.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);
  });

  afterAll(async () => {
    // Nettoyer après les tests
    await localPool.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);
    await localPool.end();
  });

  describe('GET /api/auth/check', () => {
    it('should return unauthenticated for no session', async () => {
      const response = await request(app)
        .get('/api/auth/check');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ authenticated: false });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Déconnexion réussie'
      });
    });
  });
});
