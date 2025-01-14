<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p class="text-gray-500">Bienvenue dans votre espace de gestion</p>
      </div>
      <div class="flex gap-4">
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
          + Nouvelle vente
        </button>
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <i class="fas fa-download mr-2"></i> Exporter
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Ventes du jour -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-shopping-cart text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Ventes du jour
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(statistics.dailySales) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    {{ statistics.dailySalesChange }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenu total -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-euro-sign text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Revenu total
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(statistics.totalRevenue) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    {{ statistics.revenueChange }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Commandes en attente -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-clock text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Commandes en attente
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ statistics.pendingOrders }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    {{ statistics.ordersChange }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Nouveaux clients -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-users text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Nouveaux clients
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ statistics.newCustomers }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    {{ statistics.customersChange }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Graphique d'évolution des ventes -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Évolution des ventes</h3>
          <div class="flex gap-2">
            <button 
              v-for="period in ['Jour', 'Semaine', 'Mois']" 
              :key="period"
              :class="[
                'px-3 py-1 text-sm rounded-md',
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <apexchart
            type="area"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Produits populaires</h3>
          <a href="#" class="text-sm text-purple-600 hover:text-purple-700">Voir tout</a>
        </div>
        <div class="space-y-4">
          <div v-for="product in popularProducts" :key="product.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <img :src="product.image" alt="" class="w-10 h-10 rounded-lg object-cover"/>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">{{ product.name }}</h4>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatPrice(product.price) }}</p>
              <p class="text-sm text-gray-500">{{ product.sales }} ventes</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activités récentes -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Activités récentes</h3>
        <a href="#" class="text-sm text-purple-600 hover:text-purple-700">Voir tout</a>
      </div>
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in recentActivities" :key="activity.id">
            <div class="relative pb-8">
              <span v-if="index !== recentActivities.length - 1" class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
              <div class="relative flex items-start space-x-3">
                <div class="relative">
                  <span class="h-10 w-10 rounded-full flex items-center justify-center bg-purple-100">
                    <i :class="activity.icon" class="text-purple-600"></i>
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm text-gray-500">
                    <span class="font-medium text-gray-900">{{ activity.text }}</span>
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    {{ activity.time }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'DashboardView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const selectedPeriod = ref('Semaine')
    const statistics = ref({
      dailySales: 2543,
      dailySalesChange: 12,
      totalRevenue: 48385,
      revenueChange: 8.2,
      pendingOrders: 18,
      ordersChange: 5.4,
      newCustomers: 156,
      customersChange: 3.2
    })

    const popularProducts = ref([
      {
        id: 1,
        name: 'Ordinateur portable Pro',
        category: 'Électronique',
        price: 1299,
        sales: 125,
        image: '/images/products/laptop.jpg'
      },
      {
        id: 2,
        name: 'Smartphone X',
        category: 'Électronique',
        price: 899,
        sales: 98,
        image: '/images/products/phone.jpg'
      },
      {
        id: 3,
        name: 'Casque sans fil',
        category: 'Accessoires',
        price: 199,
        sales: 78,
        image: '/images/products/headphones.jpg'
      },
      {
        id: 4,
        name: 'Tablette Air',
        category: 'Électronique',
        price: 649,
        sales: 65,
        image: '/images/products/tablet.jpg'
      }
    ])

    const recentActivities = ref([
      {
        id: 1,
        text: 'Nouvelle commande #2458 créée par Jean Dupont',
        time: 'Il y a 3 minutes',
        icon: 'fas fa-shopping-cart'
      },
      {
        id: 2,
        text: 'Stock mis à jour pour "Ordinateur portable Pro"',
        time: 'Il y a 1 heure',
        icon: 'fas fa-box'
      },
      {
        id: 3,
        text: 'Paiement reçu pour la commande #2457',
        time: 'Il y a 2 heures',
        icon: 'fas fa-credit-card'
      }
    ])

    const chartOptions = {
      chart: {
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return value + ' €'
          },
          style: {
            colors: '#6B7280'
          }
        }
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4
      },
      colors: ['#9333EA']
    }

    const chartSeries = [{
      name: 'Ventes',
      data: [1200, 1900, 1500, 2100, 2400, 1800, 2800]
    }]

    const formatPrice = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }

    return {
      selectedPeriod,
      statistics,
      popularProducts,
      recentActivities,
      chartOptions,
      chartSeries,
      formatPrice
    }
  }
}
</script>
