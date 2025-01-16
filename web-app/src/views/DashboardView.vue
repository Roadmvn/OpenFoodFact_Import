<template>
  <main class="flex-1 pb-8" id="dashboard-content">
    <div class="bg-white shadow-sm rounded-lg mb-6">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-[#004D40]">Bienvenue {{ userName }}!</h1>
            <p class="text-sm text-gray-500">Voici votre tableau de bord</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Menu d'export -->
            <div class="relative">
              <button 
                @click="showExportMenu = !showExportMenu"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#004D40] text-white rounded-lg hover:bg-[#00695C] transition-colors duration-200"
              >
                <i class="fas fa-download"></i>
                <span>Exporter le rapport</span>
              </button>
              
              <!-- Options d'export -->
              <div v-if="showExportMenu" 
                class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
              >
                <div class="p-3">
                  <h3 class="text-sm font-medium text-gray-700 mb-2">Sélectionner les données</h3>
                  
                  <!-- Sélection des données -->
                  <div class="space-y-2 mb-4">
                    <label class="flex items-center gap-2 text-sm text-gray-600">
                      <input 
                        type="checkbox" 
                        v-model="exportConfig.sections.kpis"
                        class="rounded text-[#004D40] focus:ring-[#004D40]"
                      >
                      KPIs (Ventes, CA, etc.)
                    </label>
                    <label class="flex items-center gap-2 text-sm text-gray-600">
                      <input 
                        type="checkbox" 
                        v-model="exportConfig.sections.salesChart"
                        class="rounded text-[#004D40] focus:ring-[#004D40]"
                      >
                      Graphique des ventes
                    </label>
                    <label class="flex items-center gap-2 text-sm text-gray-600">
                      <input 
                        type="checkbox" 
                        v-model="exportConfig.sections.categories"
                        class="rounded text-[#004D40] focus:ring-[#004D40]"
                      >
                      Répartition par catégories
                    </label>
                    <label class="flex items-center gap-2 text-sm text-gray-600">
                      <input 
                        type="checkbox" 
                        v-model="exportConfig.sections.products"
                        class="rounded text-[#004D40] focus:ring-[#004D40]"
                      >
                      Produits populaires
                    </label>
                  </div>

                  <!-- Période -->
                  <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Période</h3>
                    <select 
                      v-model="exportConfig.period"
                      class="w-full text-sm border-gray-200 rounded-lg focus:border-[#004D40] focus:ring-[#004D40]"
                    >
                      <option value="current">Période actuelle</option>
                      <option value="day">Dernier jour</option>
                      <option value="week">Dernière semaine</option>
                      <option value="month">Dernier mois</option>
                      <option value="custom">Personnalisé</option>
                    </select>
                  </div>

                  <!-- Format d'export -->
                  <div class="border-t border-gray-100 pt-3">
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Format d'export</h3>
                    <div class="grid grid-cols-2 gap-2">
                      <button 
                        v-for="option in exportFormats"
                        :key="option.format"
                        @click="handleExport(option.format)"
                        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        :class="{ 'bg-[#E0F2F1]': exportConfig.format === option.format }"
                      >
                        <i :class="['fas', option.icon, 'text-[#004D40]']"></i>
                        <span>{{ option.text }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Barre de progression -->
                  <div v-if="isExporting" class="mt-3">
                    <div class="text-sm text-gray-600 mb-2">Export en cours...</div>
                    <div class="h-2 bg-gray-200 rounded-full">
                      <div 
                        class="h-full bg-[#004D40] rounded-full transition-all duration-300"
                        :style="{ width: exportProgress + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative w-64">
              <input 
                type="text" 
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Rechercher..." 
                class="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:border-[#004D40] focus:ring-1 focus:ring-[#004D40] transition-colors duration-200"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards en taille réduite -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div v-for="(card, index) in [
        { icon: 'fa-shopping-cart', bg: 'bg-[#E8F5E9]', iconColor: 'text-[#004D40]', title: 'Ventes du jour', value: '2 543,00 €', growth: '+12%' },
        { icon: 'fa-euro-sign', bg: 'bg-[#EFEBE9]', iconColor: 'text-[#8B0000]', title: 'Chiffre d\'affaires', value: '48 385,00 €', growth: '+8.2%' },
        { icon: 'fa-clock', bg: 'bg-[#F7D2C4]', iconColor: 'text-[#FFA07A]', title: 'Commandes en attente', value: '18', growth: '-5.4%' },
        { icon: 'fa-users', bg: 'bg-[#C9E4CA]', iconColor: 'text-[#3E8E41]', title: 'Nouveaux clients', value: '156', growth: '+3.2%' },
        { icon: 'fa-chart-line', bg: 'bg-[#F7CAC9]', iconColor: 'text-[#FF69B4]', title: 'Taux de conversion', value: '2.8%', growth: '+0.5%' }
      ]" :key="index" 
      class="bg-white rounded-lg shadow p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <div class="flex items-center">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center mr-2', card.bg]">
            <i :class="['fas', card.icon, card.iconColor, 'text-sm']"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-gray-500">{{ card.title }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold">{{ card.value }}</span>
              <span :class="card.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'" 
                    class="text-xs">{{ card.growth }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      <!-- Évolution des ventes -->
      <div class="lg:col-span-2 bg-white shadow rounded-lg p-4">
        <div class="flex flex-col space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Évolution des ventes</h3>
            <div class="flex items-center gap-3">
              <div class="flex gap-2">
                <button 
                  v-for="period in ['jour', 'semaine', 'mois']" 
                  :key="period"
                  @click="changePeriod(period)"
                  class="px-4 py-1.5 text-sm rounded-lg transition-all duration-200 shadow-sm"
                  :class="selectedPeriod === period ? 'bg-[#004D40] text-white shadow-md scale-105' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                >
                  {{ period.charAt(0).toUpperCase() + period.slice(1) }}
                </button>
              </div>
              <button 
                @click="showExportMenu = !showExportMenu"
                class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <i class="fas fa-download text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Statistiques en ligne -->
          <div class="flex flex-wrap gap-4 text-sm">
            <div v-for="stat in [
              { label: 'Ventes totales', value: '12M', color: 'bg-[#004D40]' },
              { label: 'Bénéfices', value: '78M', color: 'bg-[#8B0000]' },
              { label: 'CA total', value: '60M', color: 'bg-[#FFA07A]' },
              { label: 'Nouveaux', value: '156k', color: 'bg-[#3E8E41]' }
            ]" :key="stat.label" class="flex items-center">
              <div :class="['w-2 h-2 rounded-full mr-1.5', stat.color]"></div>
              <span class="text-gray-600">{{ stat.label }}:</span>
              <span class="ml-1 font-medium">{{ stat.value }}</span>
            </div>
          </div>

          <!-- Filtres de catégorie -->
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="category in ['Électronique', 'Périphériques', 'Accessoires', 'Services']"
              :key="category"
              @click="toggleCategory(category)"
              class="px-2 py-1 text-xs rounded-md transition-colors duration-200"
              :class="selectedCategories.includes(category) ? 'bg-[#004D40] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ category }}
            </button>
          </div>

          <!-- Graphique -->
          <div class="h-[280px]">
            <apexchart
              type="area"
              :options="chartOptions"
              :series="getSeriesForPeriod"
              height="100%"
              width="100%"
            />
          </div>
        </div>
      </div>

      <!-- Distribution des ventes -->
      <div class="bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Distribution des ventes</h3>
        <div class="h-[280px]">
          <apexchart
            type="pie"
            :options="pieChartOptions"
            :series="[45, 25, 20, 10]"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>

    <!-- Produits populaires -->
    <div class="bg-white shadow rounded-lg p-4 mt-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Produits populaires</h3>
        <router-link to="/products" class="text-sm text-[#004D40] hover:text-[#00796B]">
          Voir tout
        </router-link>
      </div>
      <div class="space-y-4">
        <div v-for="product in popularProducts" :key="product.id" 
             class="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <i :class="['fas', 
              product.category === 'Électronique' ? 'fa-laptop' : 
              product.category === 'Périphériques' ? 'fa-mouse' : 
              'fa-plug',
              'text-2xl text-gray-400']">
            </i>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
            <p class="text-sm text-gray-500">{{ product.category }}</p>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-900">{{ product.sales }} ventes</p>
            <p class="text-sm text-gray-500">{{ product.revenue }}</p>
          </div>
          <div class="ml-4">
            <span :class="product.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'" 
                  class="text-sm font-medium">
              {{ product.trend }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useActivities } from '../stores/activities'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

const router = useRouter()
const authStore = useAuthStore()
const { getRecentActivities, addActivity } = useActivities()

// Nom d'utilisateur
const userName = computed(() => authStore.user?.firstName || 'Guest')

// États
const selectedPeriod = ref('jour')
const selectedCategories = ref(['Électronique', 'Périphériques', 'Accessoires', 'Services'])
const showExportMenu = ref(false)
const searchQuery = ref('')

// États pour l'export
const isExporting = ref(false)
const exportProgress = ref(0)
const exportConfig = ref({
  format: 'pdf',
  sections: {
    kpis: true,
    salesChart: true,
    categories: true,
    products: true
  },
  period: 'current'
})

// Formats d'export
const exportFormats = [
  { format: 'pdf', icon: 'fa-file-pdf', text: 'PDF' },
  { format: 'excel', icon: 'fa-file-excel', text: 'Excel' },
  { format: 'csv', icon: 'fa-file-csv', text: 'CSV' },
  { format: 'image', icon: 'fa-file-image', text: 'Image' }
]

// Données de vente par période
const salesData = {
  jour: {
    Électronique: [1500, 2200, 1800, 2400, 2100, 2800, 3000],
    Périphériques: [1000, 1500, 1200, 1700, 1400, 1900, 2100],
    Accessoires: [800, 1200, 900, 1400, 1100, 1600, 1800],
    Services: [500, 800, 600, 900, 700, 1000, 1200],
    categories: ['8h', '10h', '12h', '14h', '16h', '18h', '20h']
  },
  semaine: {
    Électronique: [10500, 12200, 11800, 13400, 12100, 13800, 14000],
    Périphériques: [8000, 9500, 8200, 9700, 8400, 9900, 10100],
    Accessoires: [6800, 7200, 6900, 7400, 7100, 7600, 7800],
    Services: [4500, 4800, 4600, 4900, 4700, 5000, 5200],
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  },
  mois: {
    Électronique: [45000, 48000, 46000, 49000, 47000, 50000, 52000],
    Périphériques: [35000, 37000, 36000, 38000, 37000, 39000, 40000],
    Accessoires: [25000, 26000, 25500, 27000, 26000, 28000, 29000],
    Services: [15000, 16000, 15500, 16500, 16000, 17000, 17500],
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil']
  }
}

// Options du graphique
const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    stacked: true,
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: ['#004D40', '#00796B', '#009688', '#4DB6AC'],
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1
    }
  },
  stroke: {
    width: 2,
    curve: 'smooth'
  },
  grid: {
    borderColor: '#f1f1f1',
    padding: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: salesData[selectedPeriod.value].categories,
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: (value) => value.toFixed(0)
    }
  }
}))

// Options du graphique circulaire
const pieChartOptions = {
  labels: ['Électronique', 'Périphériques', 'Accessoires', 'Services'],
  colors: ['#004D40', '#00796B', '#009688', '#4DB6AC'],
  legend: {
    position: 'bottom'
  }
}

// Séries de données filtrées selon la période
const getSeriesForPeriod = computed(() => {
  return selectedCategories.value.map(category => ({
    name: category,
    data: salesData[selectedPeriod.value][category]
  }))
})

// Changer la période
const changePeriod = (period) => {
  selectedPeriod.value = period
}

// Basculer une catégorie
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else if (selectedCategories.value.length > 1) {
    selectedCategories.value.splice(index, 1)
  }
}

// Données des produits populaires
const popularProducts = ref([
  {
    id: 1,
    name: 'Laptop Pro X1',
    category: 'Électronique',
    sales: 145,
    revenue: '158,000 €',
    trend: '+12.5%'
  },
  {
    id: 2,
    name: 'Souris Gaming RGB',
    category: 'Périphériques',
    sales: 89,
    revenue: '4,450 €',
    trend: '+5.8%'
  },
  {
    id: 3,
    name: 'Câble USB-C 2m',
    category: 'Accessoires',
    sales: 238,
    revenue: '2,380 €',
    trend: '+18.2%'
  }
])

// Fonction d'export
const handleExport = async (format) => {
  try {
    isExporting.value = true
    exportProgress.value = 0
    
    const dashboard = document.querySelector('#dashboard-content')
    
    switch (format) {
      case 'pdf':
        await exportToPDF(dashboard)
        break
      case 'excel':
        await exportToExcel()
        break
      case 'csv':
        await exportToCSV()
        break
      case 'image':
        await exportToImage(dashboard)
        break
    }
    
    // Sauvegarder les préférences
    exportConfig.value.format = format
    localStorage.setItem('exportPreferences', JSON.stringify(exportConfig.value))
    
    // Ajouter l'activité
    addActivity({
      type: 'export',
      details: `Dashboard exported as ${format.toUpperCase()}`,
      timestamp: new Date()
    })
    
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    isExporting.value = false
    exportProgress.value = 0
    showExportMenu.value = false
  }
}

// Fonction d'export Excel
const exportToExcel = async () => {
  const data = {}
  
  if (exportConfig.value.sections.kpis) {
    data['KPI Summary'] = [
      ['Metric', 'Value', 'Growth'],
      ['Ventes du jour', '2 543,00 €', '+12%'],
      ['Chiffre d\'affaires', '48 385,00 €', '+8.2%'],
      ['Commandes en attente', '18', '-5.4%'],
      ['Nouveaux clients', '156', '+3.2%'],
      ['Taux de conversion', '2.8%', '+0.5%']
    ]
  }
  
  if (exportConfig.value.sections.products) {
    data['Products'] = [
      ['Nom', 'Ventes', 'Revenus', 'Croissance'],
      ...popularProducts.value.map(product => [
        product.name,
        product.sales,
        product.revenue,
        product.growth
      ])
    ]
  }
  
  if (exportConfig.value.sections.salesChart) {
    const periodData = salesData[selectedPeriod.value]
    data['Sales Data'] = [
      ['Date', 'Électronique', 'Périphériques'],
      ...Object.entries(periodData).map(([date, values]) => [
        date,
        values.electronics,
        values.peripherals
      ])
    ]
  }
  
  exportProgress.value = 50
  
  const wb = XLSX.utils.book_new()
  
  Object.entries(data).forEach(([sheetName, sheetData]) => {
    const ws = XLSX.utils.aoa_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  })
  
  const fileName = `dashboard-data-${exportConfig.value.period}-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
  
  exportProgress.value = 100
}

// Fonction d'export CSV
const exportToCSV = async () => {
  let data = []
  const headers = []
  const rows = []
  
  if (exportConfig.value.sections.kpis) {
    headers.push('Metric', 'Value', 'Growth')
    rows.push(
      ['Ventes du jour', '2 543,00 €', '+12%'],
      ['Chiffre d\'affaires', '48 385,00 €', '+8.2%'],
      ['Commandes en attente', '18', '-5.4%'],
      ['Nouveaux clients', '156', '+3.2%'],
      ['Taux de conversion', '2.8%', '+0.5%']
    )
  }
  
  if (exportConfig.value.sections.products) {
    if (headers.length > 0) rows.push([]) // Add separator
    headers.push('Nom', 'Ventes', 'Revenus', 'Croissance')
    rows.push(...popularProducts.value.map(product => [
      product.name,
      product.sales,
      product.revenue,
      product.growth
    ]))
  }
  
  data = [headers, ...rows]
  exportProgress.value = 50
  
  const csvContent = data.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  const fileName = `dashboard-data-${exportConfig.value.period}-${new Date().toISOString().split('T')[0]}.csv`
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  
  exportProgress.value = 100
}

// Fonction d'export PDF
const exportToPDF = async (element) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  let yOffset = 10
  
  // Titre
  pdf.setFontSize(16)
  pdf.text('Rapport du Dashboard', 10, yOffset)
  yOffset += 10
  
  if (exportConfig.value.sections.kpis) {
    // KPIs
    pdf.setFontSize(12)
    pdf.text('KPIs', 10, yOffset)
    yOffset += 10
    
    const kpiData = [
      ['Ventes du jour', '2 543,00 €', '+12%'],
      ['Chiffre d\'affaires', '48 385,00 €', '+8.2%'],
      ['Commandes en attente', '18', '-5.4%'],
      ['Nouveaux clients', '156', '+3.2%'],
      ['Taux de conversion', '2.8%', '+0.5%']
    ]
    
    pdf.autoTable({
      startY: yOffset,
      head: [['Metric', 'Value', 'Growth']],
      body: kpiData,
      margin: { top: 10 }
    })
    
    yOffset = pdf.lastAutoTable.finalY + 10
  }
  
  if (exportConfig.value.sections.salesChart || exportConfig.value.sections.categories) {
    // Capture et ajout des graphiques
    const charts = element.querySelectorAll('.chart-container')
    for (const chart of charts) {
      const canvas = await html2canvas(chart)
      const imgData = canvas.toDataURL('image/png')
      
      if (yOffset + 60 > pdf.internal.pageSize.height) {
        pdf.addPage()
        yOffset = 10
      }
      
      pdf.text(chart.getAttribute('data-title') || 'Graphique', 10, yOffset)
      yOffset += 5
      
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight)
      yOffset += imgHeight + 10
    }
  }
  
  if (exportConfig.value.sections.products) {
    if (yOffset + 60 > pdf.internal.pageSize.height) {
      pdf.addPage()
      yOffset = 10
    }
    
    pdf.text('Produits Populaires', 10, yOffset)
    yOffset += 10
    
    const productsData = popularProducts.value.map(product => [
      product.name,
      product.sales,
      product.revenue,
      product.growth
    ])
    
    pdf.autoTable({
      startY: yOffset,
      head: [['Nom', 'Ventes', 'Revenus', 'Croissance']],
      body: productsData,
      margin: { top: 10 }
    })
  }
  
  const fileName = `dashboard-report-${exportConfig.value.period}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
  
  exportProgress.value = 100
}

// Fonction d'export Image
const exportToImage = async (element) => {
  const canvas = await html2canvas(element)
  exportProgress.value = 50
  
  const link = document.createElement('a')
  link.download = 'dashboard-snapshot.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
  
  exportProgress.value = 100
}

// Fonction de recherche
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // TODO: Implémenter la logique de recherche
  console.log('Recherche:', searchQuery.value)
}
</script>
