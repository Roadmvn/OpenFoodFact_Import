import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts(searchQuery = '') {
      this.loading = true
      this.error = null
      
      try {
        const endpoint = searchQuery
          ? `/api/products/search?query=${searchQuery}`
          : '/api/products'
        
        const response = await axios.get(endpoint)
        this.products = response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        this.error = 'Erreur lors du chargement des produits. Veuillez réessayer.'
      } finally {
        this.loading = false
      }
    }
  }
})
