import { defineStore } from 'pinia'
import AuthService from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: AuthService.getCurrentUser(),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getToken: (state) => state.user?.token
  },

  actions: {
    async login({ email, password }) {
      try {
        this.loading = true
        const user = await AuthService.login(email, password)
        this.user = user
        return user
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        this.loading = true
        const response = await AuthService.register(userData)
        return response
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      AuthService.logout()
    },

    async resetPassword(email) {
      try {
        // Ici, vous devrez implémenter l'appel à votre API backend
        // Pour l'instant, on simule une réponse réussie
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation d'un délai réseau
        return true
      } catch (error) {
        throw new Error('Erreur lors de la réinitialisation du mot de passe')
      }
    }
  }
})
