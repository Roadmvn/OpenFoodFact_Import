<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- En-tête avec effet de gradient -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Gestion des factures</h1>
          <p class="text-blue-100">Gérez vos factures en toute simplicité</p>
        </div>
        <button @click="openNewInvoiceModal" class="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center space-x-2">
          <i class="fas fa-plus"></i>
          <span>Nouvelle facture</span>
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques avec animations -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total factures</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-file-invoice text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Montant total</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatPrice(stats.totalAmount) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-euro-sign text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">En attente</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et filtres avec design moderne -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="col-span-2">
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une facture..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              @input="handleSearch"
            />
          </div>
        </div>
        <div>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            @change="handleFilterChange"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="payée">Payée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
        <div class="flex space-x-2">
          <input
            type="date"
            v-model="selectedDate"
            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            @change="handleFilterChange"
          />
          <button
            @click="exportInvoices"
            class="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <i class="fas fa-download"></i>
            <span>Exporter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table des factures avec design moderne -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Facture</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ invoice.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ invoice.clientName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(invoice.date) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ formatPrice(invoice.amount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                getStatusClass(invoice.status),
                'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center'
              ]">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                  'bg-yellow-500': invoice.status === 'en_attente',
                  'bg-green-500': invoice.status === 'payée',
                  'bg-red-500': invoice.status === 'annulée'
                }"></span>
                {{ formatStatus(invoice.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-3">
                <button @click="viewInvoice(invoice)" class="text-blue-600 hover:text-blue-800 transition-colors duration-150">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="downloadPDF(invoice)" class="text-gray-600 hover:text-gray-800 transition-colors duration-150">
                  <i class="fas fa-download"></i>
                </button>
                <button 
                  v-if="invoice.status === 'en_attente'"
                  @click="markAsPaid(invoice)"
                  class="text-green-600 hover:text-green-800 transition-colors duration-150"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  v-if="invoice.status === 'en_attente'"
                  @click="cancelInvoice(invoice)"
                  class="text-red-600 hover:text-red-800 transition-colors duration-150"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import InvoiceService from '../services/invoices.service'

export default {
  name: 'InvoicesView',
  setup() {
    const invoices = ref([])
    const stats = ref({
      total: 0,
      totalAmount: 0,
      pending: 0
    })
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const selectedDate = ref('')

    const loadInvoices = async () => {
      try {
        const filters = {
          status: selectedStatus.value,
          search: searchQuery.value,
          dateRange: selectedDate.value ? {
            start: selectedDate.value,
            end: selectedDate.value
          } : null
        }
        const response = await InvoiceService.getInvoices(filters)
        invoices.value = response.invoices
        stats.value = {
          total: response.total,
          totalAmount: response.totalAmount,
          pending: response.pending
        }
      } catch (error) {
        console.error('Erreur lors du chargement des factures:', error)
      }
    }

    const handleSearch = () => {
      loadInvoices()
    }

    const handleFilterChange = () => {
      loadInvoices()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const formatPrice = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatStatus = (status) => {
      const statusMap = {
        en_attente: 'En attente',
        payée: 'Payée',
        annulée: 'Annulée'
      }
      return statusMap[status] || status
    }

    const getStatusClass = (status) => {
      const classes = {
        en_attente: 'bg-yellow-100 text-yellow-800',
        payée: 'bg-green-100 text-green-800',
        annulée: 'bg-red-100 text-red-800'
      }
      return classes[status] || ''
    }

    const exportInvoices = async () => {
      try {
        const blob = await InvoiceService.exportInvoices()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `factures_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Erreur lors de l\'export:', error)
      }
    }

    const viewInvoice = async (invoice) => {
      try {
        const details = await InvoiceService.getInvoiceDetails(invoice.id)
        console.log('Détails de la facture:', details)
        // TODO: Afficher les détails dans une modal
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error)
      }
    }

    const downloadPDF = async (invoice) => {
      try {
        const blob = await InvoiceService.generatePDF(invoice.id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture_${invoice.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Erreur lors du téléchargement du PDF:', error)
      }
    }

    const markAsPaid = async (invoice) => {
      try {
        await InvoiceService.markAsPaid(invoice.id)
        loadInvoices()
      } catch (error) {
        console.error('Erreur lors du marquage comme payée:', error)
      }
    }

    const cancelInvoice = async (invoice) => {
      try {
        await InvoiceService.markAsCancelled(invoice.id)
        loadInvoices()
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error)
      }
    }

    onMounted(() => {
      loadInvoices()
    })

    return {
      invoices,
      stats,
      searchQuery,
      selectedStatus,
      selectedDate,
      handleSearch,
      handleFilterChange,
      formatDate,
      formatPrice,
      formatStatus,
      getStatusClass,
      exportInvoices,
      viewInvoice,
      downloadPDF,
      markAsPaid,
      cancelInvoice
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour les statuts */
.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Animation des cartes statistiques */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.stats-card:hover {
  animation: pulse 2s infinite;
}
</style>
