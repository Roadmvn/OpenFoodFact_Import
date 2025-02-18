import axiosInstance from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    await AsyncStorage.removeItem('token');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  googleLogin: () => {
    // Note: Pour React Native, nous devrons utiliser une solution comme
    // react-native-app-auth pour l'authentification OAuth
    throw new Error('Google login not implemented for mobile yet');
  }
};
