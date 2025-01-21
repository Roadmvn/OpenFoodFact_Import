import { defineStore } from 'pinia'
import axios from 'axios'

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null
  }),

  actions: {
    async generatePDF(data) {
      this.loading = true
      try {
        const response = await axios.post('/api/invoices/generate/pdf', data, {
          responseType: 'blob'
        })
        
        // Créer un URL pour le blob
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        
        // Créer un lien temporaire et cliquer dessus pour télécharger
        const link = document.createElement('a')
        link.href = url
        link.download = `facture_${data.order.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Nettoyer l'URL
        window.URL.revokeObjectURL(url)
        
        return response.data
      } catch (error) {
        console.error('Error generating PDF:', error)
        this.error = 'Erreur lors de la génération du PDF'
        throw error
      } finally {
        this.loading = false
      }
    },

    async generateCSV(data) {
      this.loading = true
      try {
        const response = await axios.post('/api/invoices/generate/csv', data, {
          responseType: 'blob'
        })
        
        // Créer un URL pour le blob
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        
        // Créer un lien temporaire et cliquer dessus pour télécharger
        const link = document.createElement('a')
        link.href = url
        link.download = `facture_${data.order.id}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Nettoyer l'URL
        window.URL.revokeObjectURL(url)
        
        return response.data
      } catch (error) {
        console.error('Error generating CSV:', error)
        this.error = 'Erreur lors de la génération du CSV'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getInvoices() {
      this.loading = true
      try {
        const response = await axios.get('/api/invoices')
        this.invoices = response.data.data
        return this.invoices
      } catch (error) {
        console.error('Error fetching invoices:', error)
        this.error = 'Erreur lors du chargement des factures'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getInvoiceById(invoiceId) {
      this.loading = true
      try {
        const response = await axios.get(`/api/invoices/${invoiceId}`)
        this.currentInvoice = response.data.data
        return this.currentInvoice
      } catch (error) {
        console.error('Error fetching invoice:', error)
        this.error = 'Erreur lors du chargement de la facture'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
