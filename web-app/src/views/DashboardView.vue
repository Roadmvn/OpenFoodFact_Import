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
    <div class="grid grid-cols-5 gap-6 mb-6">
      <!-- Ventes du jour -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <i class="fas fa-shopping-cart text-green-500"></i>
          </div>
          <div>
            <h4 class="text-2xl font-bold">{{ formatPrice(dailySales) }}</h4>
            <div class="flex items-center">
              <p class="text-gray-600 text-sm">Ventes du jour</p>
              <span class="ml-2 text-sm" :class="dailySalesGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ dailySalesGrowth >= 0 ? '+' : '' }}{{ dailySalesGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chiffre d'affaires -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <i class="fas fa-euro-sign text-blue-500"></i>
          </div>
          <div>
            <h4 class="text-2xl font-bold">{{ formatPrice(revenue) }}</h4>
            <div class="flex items-center">
              <p class="text-gray-600 text-sm">Chiffre d'affaires</p>
              <span class="ml-2 text-sm" :class="revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Commandes en attente -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
            <i class="fas fa-clock text-yellow-500"></i>
          </div>
          <div>
            <h4 class="text-2xl font-bold">{{ pendingOrders }}</h4>
            <div class="flex items-center">
              <p class="text-gray-600 text-sm">Commandes en attente</p>
              <span class="ml-2 text-sm" :class="ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ ordersGrowth >= 0 ? '+' : '' }}{{ ordersGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nouveaux clients -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <i class="fas fa-users text-purple-500"></i>
          </div>
          <div>
            <h4 class="text-2xl font-bold">{{ newCustomers }}</h4>
            <div class="flex items-center">
              <p class="text-gray-600 text-sm">Nouveaux clients</p>
              <span class="ml-2 text-sm" :class="customersGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ customersGrowth >= 0 ? '+' : '' }}{{ customersGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Taux de conversion -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
            <i class="fas fa-chart-line text-pink-500"></i>
          </div>
          <div>
            <h4 class="text-2xl font-bold">{{ conversionRate }}%</h4>
            <div class="flex items-center">
              <p class="text-gray-600 text-sm">Taux de conversion</p>
              <span class="ml-2 text-sm" :class="conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ conversionGrowth >= 0 ? '+' : '' }}{{ conversionGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Graphiques -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Évolution des ventes -->
        <div class="col-span-8 bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">Évolution des ventes</h3>
            <div class="flex gap-2">
              <button 
                v-for="period in periods" 
                :key="period"
                @click="selectedPeriod = period"
                class="px-4 py-2 rounded-lg text-sm"
                :class="selectedPeriod === period ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ period }}
              </button>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="space-y-2 mb-6">
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span class="text-gray-600">Ventes totales:</span>
              <span class="ml-2 font-medium">12 Millions</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span class="text-gray-600">Bénéfices totaux:</span>
              <span class="ml-2 font-medium">78 Millions</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
              <span class="text-gray-600">Chiffre d'affaires total:</span>
              <span class="ml-2 font-medium">60 Millions</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span class="text-gray-600">Nouveaux clients:</span>
              <span class="ml-2 font-medium">156k</span>
            </div>
          </div>

          <!-- Filtres de catégorie -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button 
              v-for="category in categories"
              :key="category"
              @click="toggleCategory(category)"
              class="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
              :class="selectedCategories.includes(category) ? 'bg-blue-500 text-white' : ''"
            >
              {{ category }}
            </button>
          </div>

          <div class="h-[250px]">
            <apexchart
              type="area"
              :options="areaChartOptions"
              :series="filteredSeries"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        <!-- Distribution des ventes -->
        <div class="col-span-4 bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Distribution des ventes</h3>
          <div class="h-[250px]">
            <apexchart
              type="pie"
              :options="pieChartOptions"
              :series="pieData"
              height="100%"
              width="100%"
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
import { ref, onMounted, computed, watch } from 'vue'
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
    const selectedPeriod = ref('Jour')
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

    // Données pour les KPI
    const dailySales = ref(2543.00)
    const dailySalesGrowth = ref(12)
    const revenue = ref(48385)  
    const revenueGrowth = ref(8.2)
    const pendingOrders = ref(18)
    const ordersGrowth = ref(-5.4)
    const newCustomers = ref(156)
    const customersGrowth = ref(3.2)
    const conversionRate = ref(2.8)
    const conversionGrowth = ref(0.5)

    const popularProducts = ref([
      {
        id: 1,
        name: 'Ordinateur portable Pro',
        category: 'Électronique',
        sales: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        id: 2,
        name: 'Souris Gaming',
        category: 'Périphériques',
        sales: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        id: 3,
        name: 'Clavier Mécanique',
        category: 'Périphériques',
        sales: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
      },
      {
        id: 4,
        name: 'Écouteurs Sans Fil',
        category: 'Accessoires',
        sales: [32, 38, 41, 35, 27, 81, 34, 35, 32, 45, 32, 34]
      },
      {
        id: 5,
        name: 'Support Technique',
        category: 'Services',
        sales: [15, 11, 32, 18, 9, 24, 11, 13, 15, 17, 21, 15]
      }
    ])

    const recentActivities = ref([])
    const showNewSaleModal = ref(false)
    
    const newSale = ref({
      productId: '',
      quantity: 1,
      customer: ''
    })

    const categories = ref(['Électronique', 'Périphériques', 'Accessoires', 'Services'])
    const selectedCategories = ref([])

    // Données pour chaque période
    const salesData = {
      Jour: {
        categories: ['8h', '10h', '12h', '14h', '16h', '18h', '20h'],
        data: [1500, 2200, 1800, 2400, 2100, 2800, 3000]
      },
      Semaine: {
        categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        data: [12000, 15000, 13000, 17000, 14000, 18000, 20000]
      },
      Mois: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        data: [45000, 52000, 48000, 55000, 49000, 58000, 53000, 51000, 54000, 57000, 60000, 62000]
      }
    }

    // Ratios pour les catégories
    const popularProductsRatios = ref([
      {
        category: 'Électronique',
        ratio: 0.4
      },
      {
        category: 'Périphériques',
        ratio: 0.3
      },
      {
        category: 'Accessoires',
        ratio: 0.2
      },
      {
        category: 'Services',
        ratio: 0.1
      }
    ])

    const areaChartOptions = ref({
      chart: {
        type: 'area',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#6366F1'],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      grid: {
        show: true,
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: salesData[selectedPeriod.value].categories,
        labels: {
          style: {
            colors: '#64748B',
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
          style: {
            colors: '#64748B',
            fontSize: '12px'
          },
          formatter: function(value) {
            return value.toLocaleString('fr-FR') + ' €'
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(value) {
            return value.toLocaleString('fr-FR') + ' €'
          }
        }
      }
    })

    // Fonction pour changer la période
    const changePeriod = (period) => {
      selectedPeriod.value = period
      areaChartOptions.value.xaxis.categories = salesData[period].categories
    }

    // Fonction pour basculer une catégorie
    const toggleCategory = (category) => {
      const index = selectedCategories.value.indexOf(category)
      if (index === -1) {
        selectedCategories.value.push(category)
      } else {
        selectedCategories.value.splice(index, 1)
      }
    }

    // Données filtrées pour le graphique
    const filteredSeries = computed(() => {
      if (selectedCategories.value.length === 0) {
        return [{
          name: 'Total',
          data: salesData[selectedPeriod.value].data
        }]
      }
      
      return selectedCategories.value.map(category => ({
        name: category,
        data: salesData[selectedPeriod.value].data.map(value => 
          Math.round(value * (popularProducts.value.find(p => p.category === category)?.ratio || 1))
        )
      }))
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

    // Formatage des prix
    function formatPrice(value) {
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
          ventes_du_jour: dailySales.value,
          revenu_total: revenue.value,
          commandes_en_attente: pendingOrders.value,
          nouveaux_clients: newCustomers.value,
          taux_de_conversion: conversionRate.value
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

    watch(selectedPeriod, (newPeriod) => {
      // Mettre à jour les données en fonction de la période
      updateChartData(newPeriod)
    })

    function updateChartData(period) {
      // Logique pour mettre à jour les données selon la période
      switch(period) {
        case 'Jour':
          // Données journalières
          break
        case 'Semaine':
          // Données hebdomadaires
          break
        case 'Mois':
          // Données mensuelles
          break
      }
    }

    return {
      selectedPeriod,
      periods,
      dailySales,
      dailySalesGrowth,
      revenue,
      revenueGrowth,
      pendingOrders,
      ordersGrowth,
      newCustomers,
      customersGrowth,
      conversionRate,
      conversionGrowth,
      popularProducts,
      recentActivities,
      showNewSaleModal,
      newSale,
      formatPrice,
      formatDate,
      handleNewSale,
      categories,
      selectedCategories,
      toggleCategory,
      areaChartOptions,
      filteredSeries,
      pieChartOptions,
      pieData
    }
  }
}
</script>
