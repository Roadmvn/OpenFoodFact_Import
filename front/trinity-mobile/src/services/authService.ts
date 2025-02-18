import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:3000/api'; // À remplacer par votre URL d'API

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      await SecureStore.setItemAsync('token', token);
      
      return { user, token };
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  }

  static async logout() {
    await SecureStore.deleteItemAsync('token');
  }

  static async getToken() {
    return await SecureStore.getItemAsync('token');
  }
}
