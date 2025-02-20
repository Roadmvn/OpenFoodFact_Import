import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config/api';
import { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../../store/types/auth';

const TOKEN_KEY = 'auth_token';

class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Stocker le token de manière sécurisée
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erreur de connexion');
      }
      throw error;
    }
  }

  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      const { token, user } = response.data;
      
      // Stocker le token de manière sécurisée
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  // Configure axios avec le token pour toutes les requêtes
  static async setupAxiosInterceptors() {
    const token = await AuthService.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Intercepteur pour gérer les erreurs d'authentification
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AuthService.logout();
          // Vous pouvez ajouter ici la logique pour rediriger vers la page de connexion
        }
        return Promise.reject(error);
      }
    );
  }
}

export default AuthService;
