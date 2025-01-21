<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- En-tête et filtres -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Historique des transactions</h3>
          <p class="mt-2 text-sm text-gray-700">
            Liste détaillée de toutes les transactions avec options de filtrage et d'export.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            @click="exportTransactions"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Exporter
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label for="date-range" class="block text-sm font-medium text-gray-700">Période</label>
          <select
            id="date-range"
            v-model="filters.dateRange"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            v-model="filters.type"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">Tous</option>
            <option value="purchase">Achat</option>
            <option value="sale">Vente</option>
            <option value="refund">Remboursement</option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="status"
            v-model="filters.status"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">Tous</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
          </select>
        </div>

        <div>
          <label for="min-amount" class="block text-sm font-medium text-gray-700">Montant minimum</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="number"
              id="min-amount"
              v-model="filters.minAmount"
              class="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            >
          </div>
        </div>
      </div>

      <!-- Tableau des transactions -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Montant</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-if="loading" class="animate-pulse">
                    <td colspan="5" class="py-4 px-6 text-center text-gray-500">
                      Chargement des transactions...
                    </td>
                  </tr>
                  <tr v-else-if="error" class="bg-red-50">
                    <td colspan="5" class="py-4 px-6 text-center text-red-500">
                      {{ error }}
                    </td>
                  </tr>
                  <tr v-else-if="paginatedTransactions.length === 0" class="bg-gray-50">
                    <td colspan="5" class="py-4 px-6 text-center text-gray-500">
                      Aucune transaction trouvée
                    </td>
                  </tr>
                  <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {{ formatDate(transaction.date) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatTransactionType(transaction.type) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm" :class="getAmountClass(transaction)">
                      {{ formatCurrency(transaction.amount) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span :class="getStatusClass(transaction.status)">
                        {{ formatStatus(transaction.status) }}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        @click="viewDetails(transaction)"
                        class="text-purple-600 hover:text-purple-900"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <label for="items-per-page" class="mr-2 text-sm text-gray-700">Afficher</label>
          <select
            id="items-per-page"
            v-model="pagination.itemsPerPage"
            class="mr-2 rounded border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-700">éléments</span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            :disabled="pagination.currentPage === 1"
            @click="setPage(pagination.currentPage - 1)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span class="text-sm text-gray-700">
            Page {{ pagination.currentPage }} sur {{ pagination.totalPages }}
          </span>
          <button
            :disabled="pagination.currentPage === pagination.totalPages"
            @click="setPage(pagination.currentPage + 1)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useTransactionStore } from '../../stores/transactions'

export default {
  name: 'TransactionHistory',

  setup() {
    const transactionStore = useTransactionStore()
    
    // Récupérer les données du store
    const {
      loading,
      error,
      filters,
      pagination,
      paginatedTransactions,
      statistics
    } = transactionStore

    // Charger les données initiales
    onMounted(() => {
      transactionStore.fetchTransactions()
    })

    // Observer les changements de filtres
    watch(filters, () => {
      transactionStore.fetchTransactions()
    })

    // Formater la date
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(date))
    }

    // Formater le type de transaction
    const formatTransactionType = (type) => {
      const types = {
        purchase: 'Achat',
        sale: 'Vente',
        refund: 'Remboursement'
      }
      return types[type] || type
    }

    // Formater le montant
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    // Formater le statut
    const formatStatus = (status) => {
      const statuses = {
        completed: 'Complété',
        pending: 'En attente',
        failed: 'Échoué'
      }
      return statuses[status] || status
    }

    // Classes CSS pour le montant
    const getAmountClass = (transaction) => {
      if (transaction.type === 'refund' || transaction.type === 'purchase') {
        return 'text-red-600'
      }
      return 'text-green-600'
    }

    // Classes CSS pour le statut
    const getStatusClass = (status) => {
      const classes = {
        completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
        pending: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
        failed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
      }
      return classes[status] || ''
    }

    // Voir les détails d'une transaction
    const viewDetails = (transaction) => {
      // TODO: Implémenter la vue détaillée
      console.log('Voir les détails de la transaction:', transaction)
    }

    // Exporter les transactions
    const exportTransactions = async () => {
      try {
        await transactionStore.exportTransactions('csv')
      } catch (err) {
        console.error('Erreur lors de l\'export:', err)
      }
    }

    return {
      loading,
      error,
      filters,
      pagination,
      paginatedTransactions,
      statistics,
      formatDate,
      formatTransactionType,
      formatCurrency,
      formatStatus,
      getAmountClass,
      getStatusClass,
      viewDetails,
      exportTransactions,
      setPage: transactionStore.setPage,
      setFilters: transactionStore.setFilters
    }
  }
}
</script>
