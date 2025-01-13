<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Commandes</h1>
      <button
        @click="openNewOrderModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <i class="fas fa-plus -ml-1 mr-2 h-5 w-5"></i>
        Nouvelle commande
      </button>
    </div>

    <!-- Filtres et recherche -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="search" class="sr-only">Rechercher</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            name="search"
            id="search"
            v-model="searchQuery"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Rechercher une commande..."
          />
        </div>
      </div>
      <div class="flex gap-4">
        <select
          v-model="statusFilter"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <select
          v-model="sortBy"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg"
        >
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="total-desc">Montant décroissant</option>
          <option value="total-asc">Montant croissant</option>
        </select>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commande #
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.orderNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.customerName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatPrice(order.total) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewOrderDetails(order)"
                class="text-purple-600 hover:text-purple-900 mr-4"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="editOrder(order)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteOrder(order)"
                class="text-red-600 hover:text-red-900"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Affichage de <span class="font-medium">1</span> à <span class="font-medium">10</span> sur <span class="font-medium">20</span> commandes
      </div>
      <div class="flex-1 flex justify-end">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Précédent</span>
            <i class="fas fa-chevron-left h-5 w-5"></i>
          </button>
          <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Suivant</span>
            <i class="fas fa-chevron-right h-5 w-5"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'OrdersView',
  setup() {
    const searchQuery = ref('')
    const statusFilter = ref('')
    const sortBy = ref('date-desc')

    // Données de test
    const orders = ref([
      {
        id: 1,
        orderNumber: '2025-001',
        customerName: 'Jean Dupont',
        date: new Date('2025-01-13T10:00:00'),
        status: 'pending',
        total: 156.99
      },
      {
        id: 2,
        orderNumber: '2025-002',
        customerName: 'Marie Martin',
        date: new Date('2025-01-13T11:30:00'),
        status: 'processing',
        total: 89.99
      },
      // Ajoutez plus de données de test ici
    ])

    const filteredOrders = computed(() => {
      let result = orders.value

      // Filtre par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order => 
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query)
        )
      }

      // Filtre par statut
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }

      // Tri
      result = [...result].sort((a, b) => {
        switch (sortBy.value) {
          case 'date-desc':
            return b.date - a.date
          case 'date-asc':
            return a.date - b.date
          case 'total-desc':
            return b.total - a.total
          case 'total-asc':
            return a.total - b.total
          default:
            return 0
        }
      })

      return result
    })

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date)
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        processing: 'En cours',
        completed: 'Terminée',
        cancelled: 'Annulée'
      }
      return labels[status] || status
    }

    const openNewOrderModal = () => {
      // À implémenter
      console.log('Ouvrir modal nouvelle commande')
    }

    const viewOrderDetails = (order) => {
      // À implémenter
      console.log('Voir détails commande', order)
    }

    const editOrder = (order) => {
      // À implémenter
      console.log('Modifier commande', order)
    }

    const deleteOrder = (order) => {
      // À implémenter
      console.log('Supprimer commande', order)
    }

    return {
      searchQuery,
      statusFilter,
      sortBy,
      filteredOrders,
      formatDate,
      formatPrice,
      getStatusLabel,
      openNewOrderModal,
      viewOrderDetails,
      editOrder,
      deleteOrder
    }
  }
}
</script>
