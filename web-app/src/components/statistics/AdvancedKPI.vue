&lt;template>
  &lt;div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Panier moyen -->
    &lt;div class="bg-white overflow-hidden shadow rounded-lg">
      &lt;div class="p-5">
        &lt;div class="flex items-center">
          &lt;div class="flex-shrink-0">
            &lt;i class="fas fa-shopping-basket text-purple-600 text-3xl">&lt;/i>
          &lt;/div>
          &lt;div class="ml-5 w-0 flex-1">
            &lt;dl>
              &lt;dt class="text-sm font-medium text-gray-500 truncate">
                Panier moyen
              &lt;/dt>
              &lt;dd class="flex items-baseline">
                &lt;div class="text-2xl font-semibold text-gray-900">
                  {{ formatPrice(statistics.averageBasket) }}
                &lt;/div>
                &lt;div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.averageBasketChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  &lt;i :class="statistics.averageBasketChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0">&lt;/i>
                  {{ Math.abs(statistics.averageBasketChange) }}%
                &lt;/div>
              &lt;/dd>
            &lt;/dl>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>

    <!-- Taux de conversion -->
    &lt;div class="bg-white overflow-hidden shadow rounded-lg">
      &lt;div class="p-5">
        &lt;div class="flex items-center">
          &lt;div class="flex-shrink-0">
            &lt;i class="fas fa-chart-line text-purple-600 text-3xl">&lt;/i>
          &lt;/div>
          &lt;div class="ml-5 w-0 flex-1">
            &lt;dl>
              &lt;dt class="text-sm font-medium text-gray-500 truncate">
                Taux de conversion
              &lt;/dt>
              &lt;dd class="flex items-baseline">
                &lt;div class="text-2xl font-semibold text-gray-900">
                  {{ statistics.conversionRate }}%
                &lt;/div>
                &lt;div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.conversionRateChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  &lt;i :class="statistics.conversionRateChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0">&lt;/i>
                  {{ Math.abs(statistics.conversionRateChange) }}%
                &lt;/div>
              &lt;/dd>
            &lt;/dl>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>

    <!-- Produits vendus -->
    &lt;div class="bg-white overflow-hidden shadow rounded-lg">
      &lt;div class="p-5">
        &lt;div class="flex items-center">
          &lt;div class="flex-shrink-0">
            &lt;i class="fas fa-box text-purple-600 text-3xl">&lt;/i>
          &lt;/div>
          &lt;div class="ml-5 w-0 flex-1">
            &lt;dl>
              &lt;dt class="text-sm font-medium text-gray-500 truncate">
                Produits vendus
              &lt;/dt>
              &lt;dd class="flex items-baseline">
                &lt;div class="text-2xl font-semibold text-gray-900">
                  {{ statistics.productsSold }}
                &lt;/div>
                &lt;div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.productsSoldChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  &lt;i :class="statistics.productsSoldChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0">&lt;/i>
                  {{ Math.abs(statistics.productsSoldChange) }}%
                &lt;/div>
              &lt;/dd>
            &lt;/dl>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>

    <!-- Satisfaction client -->
    &lt;div class="bg-white overflow-hidden shadow rounded-lg">
      &lt;div class="p-5">
        &lt;div class="flex items-center">
          &lt;div class="flex-shrink-0">
            &lt;i class="fas fa-smile text-purple-600 text-3xl">&lt;/i>
          &lt;/div>
          &lt;div class="ml-5 w-0 flex-1">
            &lt;dl>
              &lt;dt class="text-sm font-medium text-gray-500 truncate">
                Satisfaction client
              &lt;/dt>
              &lt;dd class="flex items-baseline">
                &lt;div class="text-2xl font-semibold text-gray-900">
                  {{ statistics.customerSatisfaction }}%
                &lt;/div>
                &lt;div class="ml-2 flex items-baseline text-sm font-semibold" :class="statistics.satisfactionChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  &lt;i :class="statistics.satisfactionChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-0.5 h-5 w-5 flex-shrink-0">&lt;/i>
                  {{ Math.abs(statistics.satisfactionChange) }}%
                &lt;/div>
              &lt;/dd>
            &lt;/dl>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>
  &lt;/div>
&lt;/template>

&lt;script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdvancedKPI',
  props: {
    statistics: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }
  }
})
&lt;/script>
