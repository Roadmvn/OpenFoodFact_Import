<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Widgets</h1>
        <p class="text-gray-500">Gestion des stocks, catégories et promotions</p>
      </div>
    </div>

    <!-- Widgets -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Widget Stock -->
      <div class="col-span-4 bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Stock</h3>
          <button class="text-sm text-green-600 hover:text-green-700 font-medium">Voir tout</button>
        </div>
        <div class="space-y-4">
          <div v-for="(item, index) in stockAlerts" :key="index" 
               class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 rounded-full" 
                   :class="item.stock <= 10 ? 'bg-red-500' : 'bg-yellow-500'">
              </div>
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Stock: {{ item.stock }}</div>
              <div class="text-xs text-gray-500">Seuil: {{ item.threshold }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Top Catégories -->
      <div class="col-span-4 bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Top Catégories</h3>
        </div>
        <div class="space-y-4">
          <div v-for="(category, index) in topCategories" :key="index"
               class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">{{ category.sales }} ventes</span>
              <div class="flex items-center text-green-500">
                <i class="fas fa-arrow-up text-xs mr-1"></i>
                <span class="text-xs">{{ category.growth }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Promotions -->
      <div class="col-span-4 bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Promotions en cours</h3>
          <button class="text-sm text-green-600 hover:text-green-700 font-medium">Gérer</button>
        </div>
        <div class="space-y-4">
          <div v-for="(promo, index) in activePromotions" :key="index"
               class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-900">{{ promo.name }}</span>
              <span class="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                -{{ promo.discount }}%
              </span>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>{{ promo.startDate }} - {{ promo.endDate }}</span>
              <span>{{ promo.productsCount }} produits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    // Données pour les widgets
    const stockAlerts = ref([
      { name: 'Laptop Gaming Pro', stock: 5, threshold: 10 },
      { name: 'Smartphone X12', stock: 8, threshold: 15 },
      { name: 'Écouteurs sans fil', stock: 12, threshold: 20 },
      { name: 'Tablette Air 4', stock: 3, threshold: 10 }
    ])

    const topCategories = ref([
      { name: 'Électronique', sales: 1234, growth: 12.5 },
      { name: 'Smartphones', sales: 856, growth: 8.3 },
      { name: 'Accessoires', sales: 645, growth: 15.2 },
      { name: 'Ordinateurs', sales: 478, growth: 6.8 }
    ])

    const activePromotions = ref([
      { 
        name: 'Soldes d\'hiver', 
        discount: 30, 
        startDate: '15/01/2024', 
        endDate: '31/01/2024',
        productsCount: 45
      },
      { 
        name: 'Black Friday', 
        discount: 50, 
        startDate: '24/11/2024', 
        endDate: '27/11/2024',
        productsCount: 120
      },
      { 
        name: 'Cyber Monday', 
        discount: 25, 
        startDate: '27/11/2024', 
        endDate: '28/11/2024',
        productsCount: 85
      }
    ])

    return {
      stockAlerts,
      topCategories,
      activePromotions
    }
  }
}
</script>
