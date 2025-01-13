import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useTransactionStore = defineStore('transactions', () => {
  // État
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    dateRange: 'month',
    type: '',
    status: '',
    minAmount: null
  })
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  })

  // Getters
  const filteredTransactions = computed(() => {
    let filtered = transactions.value

    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }

    if (filters.value.status) {
      filtered = filtered.filter(t => t.status === filters.value.status)
    }

    if (filters.value.minAmount) {
      filtered = filtered.filter(t => t.amount >= filters.value.minAmount)
    }

    // Filtrer par plage de dates
    const now = new Date()
    const startDate = new Date()
    switch (filters.value.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter(t => new Date(t.date) >= startDate)

    return filtered
  })

  const paginatedTransactions = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
    const end = start + pagination.value.itemsPerPage
    return filteredTransactions.value.slice(start, end)
  })

  const statistics = computed(() => {
    const total = filteredTransactions.value.reduce((acc, t) => acc + t.amount, 0)
    const count = filteredTransactions.value.length
    const average = count > 0 ? total / count : 0

    return {
      total,
      count,
      average,
      byType: {
        purchase: filteredTransactions.value.filter(t => t.type === 'purchase').length,
        sale: filteredTransactions.value.filter(t => t.type === 'sale').length,
        refund: filteredTransactions.value.filter(t => t.type === 'refund').length
      },
      byStatus: {
        completed: filteredTransactions.value.filter(t => t.status === 'completed').length,
        pending: filteredTransactions.value.filter(t => t.status === 'pending').length,
        failed: filteredTransactions.value.filter(t => t.status === 'failed').length
      }
    }
  })

  // Actions
  async function fetchTransactions(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/transactions', { params })
      transactions.value = response.data.transactions
      pagination.value = {
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        itemsPerPage: response.data.itemsPerPage,
        totalItems: response.data.totalItems
      }
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des transactions:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(transaction) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/transactions', transaction)
      transactions.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id, updates) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`/api/transactions/${id}`, updates)
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.currentPage = 1 // Réinitialiser la pagination
  }

  function setPage(page) {
    pagination.value.currentPage = page
  }

  async function exportTransactions(format = 'csv') {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/transactions/export`, {
        params: {
          format,
          filters: filters.value
        },
        responseType: 'blob'
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `transactions_${new Date().toISOString()}.${format}`)
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
    transactions,
    loading,
    error,
    filters,
    pagination,

    // Getters
    filteredTransactions,
    paginatedTransactions,
    statistics,

    // Actions
    fetchTransactions,
    createTransaction,
    updateTransaction,
    setFilters,
    setPage,
    exportTransactions,
    clearError
  }
})
