import axios from 'axios';

const API_URL = '/api/auth/';

class AuthService {
  async login(email, password) {
    // Simulation d'une attente
    await new Promise(resolve => setTimeout(resolve, 500));

    // Accepte n'importe quelles données
    const userData = {
      id: 1,
      firstName: email.split('@')[0],
      lastName: 'User',
      email: email,
      token: 'fake_token_' + Date.now()
    };

    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }

  async register(userData) {
    // Simulation d'une attente
    await new Promise(resolve => setTimeout(resolve, 500));

    // Accepte toujours l'inscription
    return {
      message: 'Inscription réussie'
    };
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }

  updateUser(userData) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return axios.put(API_URL + 'profile', userData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }
}

export default new AuthService();
