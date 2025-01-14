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
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
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
              v-for="period in periods" 
              :key="period"
              :class="[
                'px-3 py-1 text-sm rounded-md',
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
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

      <!-- Produits populaires -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Produits populaires</h3>
          <router-link 
            to="/dashboard/products" 
            class="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Voir tout
          </router-link>
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
    <div class="bg-white shadow rounded-lg p-6 mt-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Activités récentes</h3>
        <router-link 
          to="/dashboard/activities" 
          class="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <!-- Client -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Client</label>
          <input 
            type="text" 
            v-model="newSale.customer"
            placeholder="Nom du client"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Créer la vente
        </button>
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
    const selectedPeriod = ref('Jour')
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
        colors: ['#9333EA'] 
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
              color: '#9333EA',
              opacity: 0.4
            },
            {
              offset: 100,
              color: '#9333EA',
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

    const periods = ref(['Jour', 'Semaine', 'Mois'])

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

    const showNewSaleModal = ref(false)

    const newSale = ref({
      productId: '',
      quantity: 1,
      customer: ''
    })

    const formatPrice = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }

    const handleNewSale = () => {
      // Validation
      if (!newSale.value.productId || newSale.value.quantity < 1 || !newSale.value.customer) {
        alert('Veuillez remplir tous les champs correctement')
        return
      }

      // Trouver le produit sélectionné
      const product = popularProducts.value.find(p => p.id === parseInt(newSale.value.productId))
      if (!product) {
        alert('Produit non trouvé')
        return
      }

      // Calculer le montant total
      const totalAmount = product.price * newSale.value.quantity

      // Mettre à jour les statistiques
      statistics.value.dailySales += totalAmount
      statistics.value.dailySalesChange = ((statistics.value.dailySales / 2000) * 100).toFixed(1)
      statistics.value.totalRevenue += totalAmount
      statistics.value.revenueChange = ((statistics.value.totalRevenue / 45000) * 100).toFixed(1)

      // Ajouter aux activités récentes
      recentActivities.value.unshift({
        id: Date.now(),
        text: `Nouvelle vente : ${newSale.value.quantity}x ${product.name} pour ${newSale.value.customer}`,
        time: 'Il y a quelques secondes',
        icon: 'fas fa-shopping-cart'
      })

      // Mettre à jour le nombre de ventes du produit
      product.sales += parseInt(newSale.value.quantity)

      // Fermer le modal et réinitialiser le formulaire
      showNewSaleModal.value = false
      newSale.value = {
        productId: '',
        quantity: 1,
        customer: ''
      }
    }

    const exportDashboard = () => {
      // Préparer les données à exporter
      const data = {
        statistiques: {
          ventes_du_jour: statistics.value.dailySales,
          revenu_total: statistics.value.totalRevenue,
          commandes_en_attente: statistics.value.pendingOrders,
          nouveaux_clients: statistics.value.newCustomers
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
        ['Ventes du jour', 'Revenu total', 'Commandes en attente', 'Nouveaux clients'],
        [
          data.statistiques.ventes_du_jour,
          data.statistiques.revenu_total,
          data.statistiques.commandes_en_attente,
          data.statistiques.nouveaux_clients
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
      statistics,
      popularProducts,
      recentActivities,
      chartOptions,
      chartSeries,
      periods,
      showNewSaleModal,
      newSale,
      formatPrice,
      changePeriod,
      handleNewSale,
      exportDashboard
    }
  }
}
</script>
