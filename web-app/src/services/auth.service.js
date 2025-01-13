import axios from 'axios';
import { mockUsers } from '../mocks/data'

const API_URL = 'http://localhost:3000/api/users/';

class AuthService {
  async register(userData) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée')
      }

      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        role: 'user'
      }
      mockUsers.push(newUser)

      // Retourner l'utilisateur sans le mot de passe
      const userWithoutPassword = { ...newUser }
      delete userWithoutPassword.password
      return userWithoutPassword
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      throw error
    }
  }

  async login(email, password) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        throw new Error('Email ou mot de passe incorrect')
      }

      if (user.password !== password) {
        throw new Error('Email ou mot de passe incorrect')
      }

      const token = 'mock-jwt-token'
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password

      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('token', token)
      return { user: userWithoutPassword, token }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
