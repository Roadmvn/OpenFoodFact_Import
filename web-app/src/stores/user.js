import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isManager: (state) => state.currentUser?.role === 'manager',
    userRole: (state) => state.currentUser?.role
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await axios.post('/api/users/login', credentials)
        this.currentUser = response.data.user
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la connexion'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await axios.post('/api/users/register', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'inscription'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await axios.post('/api/users/logout')
        this.currentUser = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la déconnexion'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfile() {
      this.loading = true
      try {
        const response = await axios.get('/api/users/profile')
        this.currentUser = response.data.user
        return response.data.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération du profil'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(userData) {
      this.loading = true
      try {
        const response = await axios.put('/api/users/profile', userData)
        this.currentUser = response.data.user
        return response.data.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getAllUsers() {
      this.loading = true
      try {
        const response = await axios.get('/api/users/all')
        this.users = response.data.users
        return this.users
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUserById(userId) {
      this.loading = true
      try {
        const response = await axios.get(`/api/users/${userId}`)
        return response.data.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      this.loading = true
      try {
        const response = await axios.post('/api/users/register', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(userId, userData) {
      this.loading = true
      try {
        const response = await axios.put(`/api/users/${userId}`, userData)
        const updatedUserIndex = this.users.findIndex(user => user.id === userId)
        if (updatedUserIndex !== -1) {
          this.users[updatedUserIndex] = response.data.user
        }
        return response.data.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId) {
      this.loading = true
      try {
        await axios.delete(`/api/users/${userId}`)
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(userId, newPassword) {
      this.loading = true
      try {
        await axios.post(`/api/users/${userId}/reset-password`, { newPassword })
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Initialisation du store avec le token stocké
    async initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          await this.getProfile()
        } catch (error) {
          // Si le token est invalide, on déconnecte l'utilisateur
          this.logout()
        }
      }
    }
  }
})
