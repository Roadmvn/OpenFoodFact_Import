import axios from 'axios'
import { mockTransactions } from '../mocks/data'

const API_URL = '/api/transactions'

class TransactionsService {
  async getTransactions(params = {}) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      let filtered = [...mockTransactions]

      // Appliquer les filtres
      if (params.type) {
        filtered = filtered.filter(t => t.type === params.type)
      }
      if (params.status) {
        filtered = filtered.filter(t => t.status === params.status)
      }
      if (params.minAmount) {
        filtered = filtered.filter(t => t.amount >= params.minAmount)
      }

      // Pagination
      const page = params.page || 1
      const limit = params.limit || 10
      const start = (page - 1) * limit
      const end = start + limit

      const response = {
        transactions: filtered.slice(start, end),
        totalItems: filtered.length,
        currentPage: page,
        totalPages: Math.ceil(filtered.length / limit),
        itemsPerPage: limit
      }
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createTransaction(transaction) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      const newTransaction = {
        id: mockTransactions.length + 1,
        date: new Date().toISOString(),
        ...transaction
      }
      mockTransactions.push(newTransaction)
      return newTransaction
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateTransaction(id, updates) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = mockTransactions.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction non trouvée')
      }

      mockTransactions[index] = {
        ...mockTransactions[index],
        ...updates
      }
      return mockTransactions[index]
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteTransaction(id) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = mockTransactions.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction non trouvée')
      }

      mockTransactions.splice(index, 1)
      return {}
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async exportTransactions(format = 'csv', filters = {}) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      // Créer un fichier CSV mock
      const csvContent = 'date,type,amount,status\n' + 
        mockTransactions.map(t => `${t.date},${t.type},${t.amount},${t.status}`).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      return blob
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || 'Une erreur est survenue'
      return new Error(message)
    } else if (error.request) {
      return new Error('Le serveur ne répond pas')
    } else {
      return new Error('Erreur de configuration de la requête')
    }
  }
}

export default new TransactionsService()
