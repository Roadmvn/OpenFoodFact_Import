import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useStatisticsStore = defineStore('statistics', () => {
  // État
  const statistics = ref({
    products: {
      total: 0,
      outOfStock: 0,
      lowStock: 0,
      totalValue: 0,
      changes: {
        daily: 0,
        weekly: 0,
        monthly: 0
      }
    },
    users: {
      total: 0,
      active: 0,
      newThisMonth: 0,
      changes: {
        daily: 0,
        weekly: 0,
        monthly: 0
      }
    },
    sales: {
      total: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      changes: {
        daily: 0,
        weekly: 0,
        monthly: 0
      }
    },
    transactions: {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      changes: {
        daily: 0,
        weekly: 0,
        monthly: 0
      }
    }
  })
  const loading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)

  // Getters
  const productStats = computed(() => statistics.value.products)
  const userStats = computed(() => statistics.value.users)
  const salesStats = computed(() => statistics.value.sales)
  const transactionStats = computed(() => statistics.value.transactions)

  const topProducts = computed(() => {
    // Implémenter la logique pour les produits les plus vendus
    return []
  })

  const revenueChart = computed(() => {
    // Implémenter la logique pour les données du graphique de revenus
    return []
  })

  // Actions
  async function fetchStatistics(timeRange = 'day') {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/statistics', {
        params: { timeRange }
      })
      statistics.value = response.data
      lastUpdate.value = new Date()
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des statistiques:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchChartData(chartType, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/statistics/chart/${chartType}`, {
        params
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function exportStatistics(format = 'csv') {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/statistics/export', {
        params: { format },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `statistics_${new Date().toISOString()}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // État
    statistics,
    loading,
    error,
    lastUpdate,

    // Getters
    productStats,
    userStats,
    salesStats,
    transactionStats,
    topProducts,
    revenueChart,

    // Actions
    fetchStatistics,
    fetchChartData,
    exportStatistics,
    clearError
  }
})
