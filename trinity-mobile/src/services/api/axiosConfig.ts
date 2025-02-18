import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Gérer la déconnexion
      await AsyncStorage.removeItem('token');
      // La redirection sera gérée par le navigateur
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
