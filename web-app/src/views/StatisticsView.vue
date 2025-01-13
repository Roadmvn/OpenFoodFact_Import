<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Statistiques</h1>
      <div class="flex gap-4">
        <select
          v-model="timeRange"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Chiffre d'affaires -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-euro-sign text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Chiffre d'affaires
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(statistics.revenue) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.revenueChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0"></i>
                    {{ Math.abs(statistics.revenueChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Commandes -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-shopping-cart text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Commandes
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ statistics.orders }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.ordersChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0"></i>
                    {{ Math.abs(statistics.ordersChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Clients -->
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
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.customersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.customersChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0"></i>
                    {{ Math.abs(statistics.customersChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Panier moyen -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-shopping-basket text-purple-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Panier moyen
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(statistics.averageBasket) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.basketChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.basketChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0"></i>
                    {{ Math.abs(statistics.basketChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Ventes par période -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900">Ventes par période</h3>
        <div class="mt-4 h-72">
          <!-- Intégrer ici un composant de graphique (Chart.js, etc.) -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Graphique des ventes à venir
          </div>
        </div>
      </div>

      <!-- Top produits -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900">Top produits</h3>
        <div class="mt-4">
          <div class="flow-root">
            <ul class="-my-4 divide-y divide-gray-200">
              <li v-for="product in topProducts" :key="product.id" class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img :src="product.image" :alt="product.name" class="h-8 w-8 rounded-full">
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ product.name }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ product.category }}
                    </p>
                  </div>
                  <div>
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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'StatisticsView',
  setup() {
    const timeRange = ref('month')

    // Données de test
    const statistics = ref({
      revenue: 15689.99,
      revenueChange: 12.5,
      orders: 156,
      ordersChange: 8.3,
      newCustomers: 48,
      customersChange: -2.1,
      averageBasket: 100.58,
      basketChange: 5.7
    })

    const topProducts = ref([
      {
        id: 1,
        name: 'Pain au chocolat',
        category: 'Boulangerie',
        sales: 234,
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 2,
        name: 'Baguette tradition',
        category: 'Boulangerie',
        sales: 189,
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 3,
        name: 'Croissant',
        category: 'Boulangerie',
        sales: 156,
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 4,
        name: 'Café arabica',
        category: 'Boissons',
        sales: 145,
        image: 'https://via.placeholder.com/32'
      },
      {
        id: 5,
        name: 'Lait demi-écrémé',
        category: 'Produits laitiers',
        sales: 134,
        image: 'https://via.placeholder.com/32'
      }
    ])

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }

    return {
      timeRange,
      statistics,
      topProducts,
      formatPrice
    }
  }
}
</script>
