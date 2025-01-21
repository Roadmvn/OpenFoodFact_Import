import axios from 'axios'
import { mockStatistics, mockChartData } from '../mocks/data'

const API_URL = '/api/statistics'

class StatisticsService {
  async getStatistics(timeRange = 'day') {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))
      const response = await axios.get(`${API_URL}`, {
        params: { timeRange }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getChartData(chartType, params = {}) {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = await axios.get(`${API_URL}/chart/${chartType}`, {
        params
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async exportStatistics(format = 'csv') {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = await axios.get(`${API_URL}/export`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui n'est pas dans la plage 2xx
      const message = error.response.data.message || 'Une erreur est survenue'
      return new Error(message)
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return new Error('Le serveur ne répond pas')
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return new Error('Erreur de configuration de la requête')
    }
  }
}

export default new StatisticsService()
