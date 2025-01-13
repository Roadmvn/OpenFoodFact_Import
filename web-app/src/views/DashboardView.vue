<template>
  <div class="space-y-6">
    <!-- En-tête du tableau de bord -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p class="text-gray-500 mt-1">Bienvenue dans votre espace de gestion</p>
      </div>
      <div class="flex space-x-4">
        <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <i class="fas fa-plus -ml-1 mr-2"></i>
          <span>Nouvelle vente</span>
        </button>
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <i class="fas fa-download -ml-1 mr-2"></i>
          <span>Exporter</span>
        </button>
      </div>
    </div>

    <!-- Statistiques -->
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
                    {{ todaySales }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    12%
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
                    {{ totalRevenue }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    8.2%
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
                    {{ pendingOrders }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    5.4%
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
                    {{ newCustomers }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i class="fas fa-arrow-up mr-0.5"></i>
                    3.2%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et produits populaires -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique des ventes -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Évolution des ventes</h3>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Jour
            </button>
            <button class="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md">
              Semaine
            </button>
            <button class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Mois
            </button>
          </div>
        </div>
        <SalesChart class="h-72" />
      </div>

      <!-- Produits populaires -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Produits populaires</h3>
          <button class="text-sm font-medium text-purple-600 hover:text-purple-500">
            Voir tout
          </button>
        </div>
        <div class="flow-root">
          <ul class="-my-5 divide-y divide-gray-200">
            <li v-for="product in popularProducts" :key="product.id" class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img class="h-8 w-8 rounded-full" :src="product.image" :alt="product.name">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ product.name }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ product.category }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium text-gray-900">
                    {{ product.price }}
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ product.sales }} ventes
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Activités récentes -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Activités récentes</h3>
          <button class="text-sm font-medium text-purple-600 hover:text-purple-500">
            Voir tout
          </button>
        </div>
        <div class="flow-root">
          <ul class="-mb-8">
            <li v-for="(activity, index) in recentActivities" :key="activity.id">
              <div class="relative pb-8">
                <span v-if="index !== recentActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="activity.iconBackground">
                      <i :class="[activity.icon, activity.iconForeground]" class="h-5 w-5"></i>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">
                        {{ activity.content }}
                      </p>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time :datetime="activity.datetime">{{ activity.date }}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SalesChart from '@/components/charts/SalesChart.vue'

export default {
  name: 'DashboardView',
  components: {
    SalesChart
  },
  setup() {
    const todaySales = ref('2,543 €')
    const totalRevenue = ref('48,385 €')
    const pendingOrders = ref('18')
    const newCustomers = ref('156')

    const popularProducts = ref([
      {
        id: 1,
        name: 'Ordinateur portable Pro',
        category: 'Électronique',
        price: '1,299 €',
        sales: '125',
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 2,
        name: 'Smartphone X',
        category: 'Électronique',
        price: '899 €',
        sales: '98',
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 3,
        name: 'Casque sans fil',
        category: 'Accessoires',
        price: '199 €',
        sales: '78',
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 4,
        name: 'Tablette Air',
        category: 'Électronique',
        price: '649 €',
        sales: '65',
        image: 'https://via.placeholder.com/32'
      }
    ])

    const recentActivities = ref([
      {
        id: 1,
        content: 'Nouvelle commande #2458 créée par Jean Dupont',
        date: 'Il y a 3 minutes',
        datetime: '2025-01-13T22:45:00',
        icon: 'fas fa-shopping-cart',
        iconBackground: 'bg-blue-500',
        iconForeground: 'text-white'
      },
      {
        id: 2,
        content: 'Stock mis à jour pour "Ordinateur portable Pro"',
        date: 'Il y a 1 heure',
        datetime: '2025-01-13T21:45:00',
        icon: 'fas fa-box',
        iconBackground: 'bg-green-500',
        iconForeground: 'text-white'
      },
      {
        id: 3,
        content: 'Paiement reçu pour la commande #2457',
        date: 'Il y a 2 heures',
        datetime: '2025-01-13T20:45:00',
        icon: 'fas fa-credit-card',
        iconBackground: 'bg-purple-500',
        iconForeground: 'text-white'
      }
    ])

    return {
      todaySales,
      totalRevenue,
      pendingOrders,
      newCustomers,
      popularProducts,
      recentActivities
    }
  }
}
</script>
