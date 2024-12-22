import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users/';

class AuthService {
  async login(email, password) {
    try {
      console.log(' Tentative de connexion...', { email });
      
      const response = await axios.post(API_URL + 'login', {
        email,
        password
      });

      if (response.data.token) {
        console.log(' Connexion réussie !', {
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            role: response.data.user.role
          }
        });
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error(' Erreur de connexion:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  logout() {
    console.log(' Déconnexion...');
    localStorage.removeItem('user');
    console.log(' Déconnexion réussie !');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      console.log(' Utilisateur connecté:', JSON.parse(user).user);
    }
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
