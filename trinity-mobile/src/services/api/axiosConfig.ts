import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // À changer selon l'environnement
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
      // Token expiré ou invalide
      await AsyncStorage.removeItem('token');
      // Rediriger vers la page de login si nécessaire
      // Vous pouvez utiliser un événement personnalisé ou un contexte pour gérer la redirection
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
