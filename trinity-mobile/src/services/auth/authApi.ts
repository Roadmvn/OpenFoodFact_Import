import axios from '../api/axiosConfig';
import { User } from '../../store/types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axios.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axios.post('/auth/reset-password', { token, newPassword });
  },
};
