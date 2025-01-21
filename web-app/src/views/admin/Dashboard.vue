<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" 
           class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm uppercase">{{ stat.title }}</h3>
        <p class="text-3xl font-bold mt-2">{{ stat.value }}</p>
        <p class="text-sm text-gray-600 mt-2">
          <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
          vs mois dernier
        </p>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Ventes -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Ventes des 7 derniers jours</h3>
        <apexchart
          type="line"
          :options="salesChartOptions"
          :series="salesChartSeries"
          height="300"
        />
      </div>

      <!-- Produits populaires -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Produits les plus vendus</h3>
        <apexchart
          type="bar"
          :options="productsChartOptions"
          :series="productsChartSeries"
          height="300"
        />
      </div>
    </div>

    <!-- Dernières commandes -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h3 class="text-xl font-semibold mb-4">Dernières commandes</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-6 py-4">#{{ order.id }}</td>
                <td class="px-6 py-4">{{ order.customer }}</td>
                <td class="px-6 py-4">{{ formatDate(order.date) }}</td>
                <td class="px-6 py-4">{{ formatPrice(order.total) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button @click="viewOrder(order.id)" 
                          class="text-blue-600 hover:text-blue-800">
                    Voir détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import { formatDate, formatPrice } from '@/utils/formatters'

export default {
  name: 'AdminDashboard',
  setup() {
    const orderStore = useOrderStore()
    const stats = ref([
      { title: 'Ventes du jour', value: '0 €', trend: 0 },
      { title: 'Commandes', value: '0', trend: 0 },
      { title: 'Clients actifs', value: '0', trend: 0 },
      { title: 'Panier moyen', value: '0 €', trend: 0 }
    ])
    const recentOrders = ref([])

    const salesChartOptions = {
      chart: {
        type: 'line',
        toolbar: { show: false }
      },
      stroke: { curve: 'smooth' },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      }
    }

    const salesChartSeries = [{
      name: 'Ventes',
      data: [0, 0, 0, 0, 0, 0, 0]
    }]

    const productsChartOptions = {
      chart: {
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: { horizontal: true }
      },
      xaxis: {
        categories: []
      }
    }

    const productsChartSeries = [{
      name: 'Ventes',
      data: []
    }]

    const getStatusClass = (status) => {
      const classes = {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'Confirmée': 'bg-green-100 text-green-800',
        'Annulée': 'bg-red-100 text-red-800'
      }
      return `px-2 py-1 rounded-full text-xs ${classes[status] || ''}`
    }

    const viewOrder = (orderId) => {
      // Rediriger vers la page de détails de la commande
      router.push(`/admin/orders/${orderId}`)
    }

    const loadDashboardData = async () => {
      try {
        // Charger les statistiques
        const dashboardData = await orderStore.getDashboardData()
        stats.value = dashboardData.stats
        recentOrders.value = dashboardData.recentOrders
        salesChartSeries[0].data = dashboardData.salesData
        productsChartSeries[0].data = dashboardData.topProducts.map(p => p.sales)
        productsChartOptions.xaxis.categories = dashboardData.topProducts.map(p => p.name)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      stats,
      recentOrders,
      salesChartOptions,
      salesChartSeries,
      productsChartOptions,
      productsChartSeries,
      formatDate,
      formatPrice,
      getStatusClass,
      viewOrder
    }
  }
}
</script>
