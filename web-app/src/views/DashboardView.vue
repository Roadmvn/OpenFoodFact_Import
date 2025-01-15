<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p class="text-gray-500">Bienvenue dans votre espace de gestion</p>
      </div>
      <div class="flex gap-4">
        <button 
          @click="showNewSaleModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          + Nouvelle vente
        </button>
        <button 
          @click="exportDashboard"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <i class="fas fa-download mr-2"></i> Exporter
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <!-- Ventes du jour -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-shopping-cart text-green-600 text-3xl"></i>
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
                  <div class="ml-2 flex items-baseline text-sm font-semibold" 
                       :class="statistics.dailySalesChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.dailySalesChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5"></i>
                    {{ Math.abs(statistics.dailySalesChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Chiffre d'affaires -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-euro-sign text-green-600 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Chiffre d'affaires
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(statistics.totalRevenue) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" 
                       :class="statistics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.revenueChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5"></i>
                    {{ Math.abs(statistics.revenueChange) }}%
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
              <i class="fas fa-clock text-yellow-500 text-3xl"></i>
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
                  <div class="ml-2 flex items-baseline text-sm font-semibold" 
                       :class="statistics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.ordersChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5"></i>
                    {{ Math.abs(statistics.ordersChange) }}%
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
              <i class="fas fa-users text-blue-500 text-3xl"></i>
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
                  <div class="ml-2 flex items-baseline text-sm font-semibold" 
                       :class="statistics.customersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.customersChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5"></i>
                    {{ Math.abs(statistics.customersChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Taux de conversion -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-chart-line text-purple-500 text-3xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Taux de conversion
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ statistics.conversionRate }}%
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" 
                       :class="statistics.conversionChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    <i :class="statistics.conversionChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5"></i>
                    {{ Math.abs(statistics.conversionChange) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Graphiques -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Graphique d'évolution des ventes -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Évolution des ventes</h3>
            <div class="flex gap-2">
              <button 
                v-for="period in periods" 
                :key="period"
                :class="[
                  'px-3 py-1 text-sm rounded-md',
                  selectedPeriod === period
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                @click="changePeriod(period)"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-[300px]">
            <apexchart
              type="area"
              :options="chartOptions"
              :series="chartSeries"
              height="100%"
            />
          </div>
        </div>

        <!-- Distribution des ventes -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Distribution des ventes</h3>
          </div>
          <div class="h-[300px]">
            <apexchart
              type="pie"
              :options="pieChartOptions"
              :series="pieChartSeries"
              height="100%"
            />
          </div>
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Produits populaires</h3>
          <router-link 
            to="/dashboard/products" 
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Voir tout
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="product in popularProducts" :key="product.id" 
               class="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
            <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="fas fa-laptop text-2xl" v-if="product.category === 'Électronique'"></i>
                <i class="fas fa-headphones text-2xl" v-else-if="product.category === 'Accessoires'"></i>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 group-hover:text-green-600">
                    {{ product.name }}
                  </h4>
                  <p class="text-sm text-gray-500">{{ product.category }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ formatPrice(product.price) }}</p>
                  <div class="flex items-center mt-1">
                    <span class="text-sm text-gray-500">{{ product.sales }} ventes</span>
                    <div class="ml-2 flex items-center">
                      <i class="fas fa-chart-line text-green-500 text-xs mr-1"></i>
                      <span class="text-xs text-green-500">+{{ Math.floor(Math.random() * 20 + 5) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Barre de progression -->
              <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  class="bg-green-600 h-1.5 rounded-full" 
                  :style="{ width: Math.min((product.sales / 150) * 100, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activités récentes -->
    <div class="bg-white shadow rounded-lg p-6 mt-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Activités récentes</h3>
        <router-link 
          to="/dashboard/activities" 
          class="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Voir tout
        </router-link>
      </div>
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in recentActivities" :key="activity.id">
            <div class="relative pb-8">
              <span v-if="index !== recentActivities.length - 1" class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
              <div class="relative flex items-start space-x-3">
                <div class="relative">
                  <span class="h-10 w-10 rounded-full flex items-center justify-center bg-green-100">
                    <i :class="activity.icon" class="text-green-600"></i>
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

  <!-- Modal Nouvelle Vente -->
  <div v-if="showNewSaleModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Nouvelle Vente</h3>
        <button @click="showNewSaleModal = false" class="text-gray-400 hover:text-gray-500">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Sélection du produit -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Produit</label>
          <select 
            v-model="newSale.productId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Sélectionner un produit</option>
            <option v-for="product in popularProducts" :key="product.id" :value="product.id">
              {{ product.name }} - {{ formatPrice(product.price) }}
            </option>
          </select>
        </div>

        <!-- Quantité -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Quantité</label>
          <input 
            type="number" 
            v-model="newSale.quantity"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <!-- Client -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Client</label>
          <input 
            type="text" 
            v-model="newSale.customer"
            placeholder="Nom du client"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button 
          @click="showNewSaleModal = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>
        <button 
          @click="handleNewSale"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Créer la vente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useActivities } from '../stores/activities'
import VueApexCharts from 'vue3-apexcharts'
import { formatPrice, formatDate } from '../utils/formatters'

export default {
  name: 'DashboardView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const router = useRouter()
    const { getRecentActivities, addActivity } = useActivities()
    const selectedPeriod = ref('Mois')
    const periods = ['Jour', 'Semaine', 'Mois']

    // Données pour le graphique circulaire
    const pieData = ref([45, 25, 20, 10])
    const pieCategories = ['Électronique', 'Périphériques', 'Accessoires', 'Services']

    // Options du graphique circulaire
    const pieChartOptions = ref({
      chart: {
        type: 'pie',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false
        }
      },
      labels: pieCategories,
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + '%'
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + '%'
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    })

    const pieChartSeries = computed(() => pieData.value)

    const statistics = ref({
      dailySales: 2543,
      dailySalesChange: 12,
      totalRevenue: 48385,
      revenueChange: 8.2,
      pendingOrders: 18,
      ordersChange: -5.4,
      newCustomers: 156,
      customersChange: 3.2,
      conversionRate: 2.8,
      conversionChange: 0.5
    })

    const popularProducts = ref([
      {
        id: 1,
        name: 'Ordinateur portable Pro',
        category: 'Électronique',
        price: 1299,
        sales: 125,
        trend: 15
      },
      {
        id: 2,
        name: 'Écran 27" 4K',
        category: 'Périphériques',
        price: 499,
        sales: 89,
        trend: 8
      },
      {
        id: 3,
        name: 'Clavier mécanique',
        category: 'Accessoires',
        price: 129,
        sales: 234,
        trend: 25
      },
      {
        id: 4,
        name: 'Pack Office Pro',
        category: 'Services',
        price: 299,
        sales: 67,
        trend: -5
      }
    ])

    const recentActivities = ref([])
    const showNewSaleModal = ref(false)
    
    const newSale = ref({
      productId: '',
      quantity: 1,
      customer: ''
    })

    onMounted(() => {
      recentActivities.value = getRecentActivities()
    })

    const handleNewSale = () => {
      if (!newSale.value.productId || !newSale.value.customer) {
        return
      }

      const product = popularProducts.value.find(p => p.id === newSale.value.productId)
      
      // Ajouter l'activité
      addActivity({
        text: `Nouvelle vente : ${newSale.value.quantity}x ${product.name} pour ${newSale.value.customer}`,
        time: 'Il y a quelques secondes',
        icon: 'fas fa-shopping-cart'
      })

      // Mettre à jour les activités récentes
      recentActivities.value = getRecentActivities()

      showNewSaleModal.value = false
      newSale.value = {
        productId: '',
        quantity: 1,
        customer: ''
      }
    }

    const chartOptions = ref({
      chart: {
        type: 'area',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        parentHeightOffset: 0
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#2E7D32'] 
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#2E7D32',
              opacity: 0.4
            },
            {
              offset: 100,
              color: '#2E7D32',
              opacity: 0.1
            }
          ]
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          bottom: 0 
        }
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
          },
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        },
        y: {
          formatter: function(value) {
            return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
          }
        }
      }
    })

    const chartSeries = ref([{
      name: 'Ventes',
      data: []
    }])

    // Données pour chaque période
    const salesData = {
      Jour: {
        categories: ['8h', '10h', '12h', '14h', '16h', '18h', '20h'],
        data: [1500, 2200, 1800, 2400, 2100, 2800, 3000]
      },
      Semaine: {
        categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        data: [12000, 15000, 13000, 17000, 14000, 18000, 20000]
      },
      Mois: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        data: [45000, 52000, 48000, 55000, 49000, 58000]
      }
    }

    const changePeriod = (period) => {
      selectedPeriod.value = period
      
      // Mettre à jour les données du graphique
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
          ...chartOptions.value.xaxis,
          categories: salesData[period].categories
        }
      }
      
      chartSeries.value = [{
        name: 'Ventes',
        data: salesData[period].data
      }]
    }

    // Initialiser avec les données journalières
    onMounted(() => {
      changePeriod('Jour')
    })

    const formatPrice = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }

    const navigateToProducts = async () => {
      try {
        await router.push('/dashboard/products')
      } catch (error) {
        console.error('Erreur de navigation:', error)
      }
    }

    const exportDashboard = () => {
      // Préparer les données à exporter
      const data = {
        statistiques: {
          ventes_du_jour: statistics.value.dailySales,
          revenu_total: statistics.value.totalRevenue,
          commandes_en_attente: statistics.value.pendingOrders,
          nouveaux_clients: statistics.value.newCustomers,
          taux_de_conversion: statistics.value.conversionRate
        },
        produits_populaires: popularProducts.value.map(product => ({
          nom: product.name,
          categorie: product.category,
          prix: product.price,
          ventes: product.sales
        })),
        activites_recentes: recentActivities.value.map(activity => ({
          activite: activity.text,
          date: activity.time
        }))
      }

      // Convertir en CSV
      const csvContent = [
        // En-têtes des statistiques
        ['Statistiques'],
        ['Ventes du jour', 'Revenu total', 'Commandes en attente', 'Nouveaux clients', 'Taux de conversion'],
        [
          data.statistiques.ventes_du_jour,
          data.statistiques.revenu_total,
          data.statistiques.commandes_en_attente,
          data.statistiques.nouveaux_clients,
          data.statistiques.taux_de_conversion
        ],
        [], // Ligne vide pour séparer
        // En-têtes des produits
        ['Produits populaires'],
        ['Nom', 'Catégorie', 'Prix', 'Ventes'],
        ...data.produits_populaires.map(p => [p.nom, p.categorie, p.prix, p.ventes]),
        [], // Ligne vide pour séparer
        // En-têtes des activités
        ['Activités récentes'],
        ['Activité', 'Date'],
        ...data.activites_recentes.map(a => [a.activite, a.date])
      ]
        .map(row => row.join(','))
        .join('\n')

      // Créer le blob et télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `tableau_de_bord_${new Date().toLocaleDateString()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return {
      selectedPeriod,
      periods,
      statistics,
      popularProducts,
      recentActivities,
      showNewSaleModal,
      newSale,
      formatPrice,
      formatDate,
      handleNewSale,
      changePeriod,
      chartOptions,
      chartSeries,
      pieChartOptions,
      pieChartSeries
    }
  }
}
</script>
