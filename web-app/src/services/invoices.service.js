import { mockInvoices } from '../mocks/data'

class InvoiceService {
  async getInvoices(filters = {}) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    let filtered = [...mockInvoices]

    // Appliquer les filtres
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status === filters.status)
    }
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filtered = filtered.filter(inv => {
        const invDate = new Date(inv.date)
        return invDate >= new Date(start) && invDate <= new Date(end)
      })
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(inv => 
        inv.id.toLowerCase().includes(searchLower) ||
        inv.clientName.toLowerCase().includes(searchLower)
      )
    }

    // Trier par date décroissante
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    return {
      invoices: filtered,
      total: filtered.length,
      totalAmount: filtered.reduce((sum, inv) => sum + inv.amount, 0),
      pending: filtered.filter(inv => inv.status === 'en_attente').length
    }
  }

  async createInvoice(invoiceData) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const newInvoice = {
      id: `INV-2025-${String(mockInvoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'en_attente',
      ...invoiceData,
      amount: invoiceData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    mockInvoices.push(newInvoice)
    return newInvoice
  }

  async updateInvoiceStatus(id, status) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const invoice = mockInvoices.find(inv => inv.id === id)
    if (!invoice) {
      throw new Error('Facture non trouvée')
    }

    invoice.status = status
    return invoice
  }

  async getInvoiceDetails(id) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const invoice = mockInvoices.find(inv => inv.id === id)
    if (!invoice) {
      throw new Error('Facture non trouvée')
    }

    return invoice
  }

  async exportInvoices(format = 'csv') {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const csvContent = 'N° Facture,Client,Date,Montant,Statut\n' +
      mockInvoices.map(inv => 
        `${inv.id},${inv.clientName},${inv.date},${inv.amount},${inv.status}`
      ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    return blob
  }

  async markAsPaid(id) {
    return this.updateInvoiceStatus(id, 'payée')
  }

  async markAsCancelled(id) {
    return this.updateInvoiceStatus(id, 'annulée')
  }

  async generatePDF(id) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const invoice = mockInvoices.find(inv => inv.id === id)
    if (!invoice) {
      throw new Error('Facture non trouvée')
    }

    const pdfContent = `
      <h1>Facture ${invoice.id}</h1>
      <p>Client : ${invoice.clientName}</p>
      <p>Date : ${invoice.date}</p>
      <p>Montant : ${invoice.amount}</p>
      <p>Statut : ${invoice.status}</p>
    `

    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    return blob
  }

  async sendInvoiceByEmail(id, email) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const invoice = mockInvoices.find(inv => inv.id === id)
    if (!invoice) {
      throw new Error('Facture non trouvée')
    }

    // Simuler l'envoi de l'email
    console.log(`Email envoyé à ${email} avec la facture ${invoice.id}`)
    return true
  }

  async getInvoiceStats() {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const stats = {
      total: mockInvoices.length,
      totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      pending: mockInvoices.filter(inv => inv.status === 'en_attente').length
    }

    return stats
  }

  async getDueInvoices() {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const dueInvoices = mockInvoices.filter(inv => inv.status === 'en_attente')
    return dueInvoices
  }

  async searchInvoices(query) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    const searchLower = query.toLowerCase()
    const results = mockInvoices.filter(inv => 
      inv.id.toLowerCase().includes(searchLower) ||
      inv.clientName.toLowerCase().includes(searchLower)
    )

    return results
  }
}

export default new InvoiceService()
