import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    dashboardData: {
      stats: [],
      recentOrders: [],
      salesData: [],
      topProducts: []
    }
  }),

  actions: {
    async getDashboardData() {
      this.loading = true
      try {
        const response = await axios.get('/api/admin/dashboard')
        this.dashboardData = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.error = 'Erreur lors du chargement des données du tableau de bord'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getOrders() {
      this.loading = true
      try {
        const response = await axios.get('/api/orders')
        this.orders = response.data.data
        return this.orders
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.error = 'Erreur lors du chargement des commandes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getOrderById(orderId) {
      this.loading = true
      try {
        const response = await axios.get(`/api/orders/${orderId}`)
        this.currentOrder = response.data.data
        return this.currentOrder
      } catch (error) {
        console.error('Error fetching order:', error)
        this.error = 'Erreur lors du chargement de la commande'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId, status) {
      this.loading = true
      try {
        const response = await axios.put(`/api/orders/${orderId}/status`, { status })
        const updatedOrder = response.data.data
        
        // Mettre à jour la commande dans la liste
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }
        
        // Mettre à jour la commande courante si elle est chargée
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = updatedOrder
        }
        
        return updatedOrder
      } catch (error) {
        console.error('Error updating order status:', error)
        this.error = 'Erreur lors de la mise à jour du statut de la commande'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData) {
      this.loading = true
      try {
        const response = await axios.post('/api/orders', orderData)
        const newOrder = response.data.data
        this.orders.unshift(newOrder)
        return newOrder
      } catch (error) {
        console.error('Error creating order:', error)
        this.error = 'Erreur lors de la création de la commande'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
