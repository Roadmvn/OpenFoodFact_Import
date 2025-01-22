&lt;template>
  &lt;div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Répartition des ventes par catégorie -->
    &lt;div class="bg-white shadow rounded-lg p-6">
      &lt;h3 class="text-lg font-medium text-gray-900">Répartition des ventes par catégorie&lt;/h3>
      &lt;div class="mt-4 h-72">
        &lt;apexchart
          type="donut"
          :options="categoryChartOptions"
          :series="categoryData.series"
        />
      &lt;/div>
    &lt;/div>

    <!-- Top produits -->
    &lt;div class="bg-white shadow rounded-lg p-6">
      &lt;h3 class="text-lg font-medium text-gray-900">Top 10 produits&lt;/h3>
      &lt;div class="mt-4 h-72">
        &lt;apexchart
          type="bar"
          :options="topProductsChartOptions"
          :series="topProductsData.series"
        />
      &lt;/div>
    &lt;/div>

    <!-- Évolution des ventes -->
    &lt;div class="bg-white shadow rounded-lg p-6">
      &lt;h3 class="text-lg font-medium text-gray-900">Évolution des ventes&lt;/h3>
      &lt;div class="mt-4 h-72">
        &lt;apexchart
          type="line"
          :options="salesTrendChartOptions"
          :series="salesTrendData.series"
        />
      &lt;/div>
    &lt;/div>

    <!-- Heat map des ventes -->
    &lt;div class="bg-white shadow rounded-lg p-6">
      &lt;h3 class="text-lg font-medium text-gray-900">Activité des ventes par heure&lt;/h3>
      &lt;div class="mt-4 h-72">
        &lt;apexchart
          type="heatmap"
          :options="heatmapChartOptions"
          :series="heatmapData.series"
        />
      &lt;/div>
    &lt;/div>
  &lt;/div>
&lt;/template>

&lt;script>
import { defineComponent, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'AdvancedCharts',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    salesData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const categoryChartOptions = computed(() => ({
      labels: props.salesData.categories.map(c => c.name),
      chart: {
        type: 'donut'
      },
      colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
      legend: {
        position: 'bottom'
      }
    }))

    const topProductsChartOptions = computed(() => ({
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        categories: props.salesData.topProducts.map(p => p.name)
      }
    }))

    const salesTrendChartOptions = computed(() => ({
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: props.salesData.timeline
      }
    }))

    const heatmapChartOptions = computed(() => ({
      chart: {
        type: 'heatmap'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#4F46E5'],
      xaxis: {
        type: 'category',
        categories: ['00h', '04h', '08h', '12h', '16h', '20h']
      }
    }))

    return {
      categoryChartOptions,
      topProductsChartOptions,
      salesTrendChartOptions,
      heatmapChartOptions,
      categoryData: computed(() => ({
        series: props.salesData.categories.map(c => c.value)
      })),
      topProductsData: computed(() => ({
        series: [{
          name: 'Ventes',
          data: props.salesData.topProducts.map(p => p.value)
        }]
      })),
      salesTrendData: computed(() => ({
        series: [{
          name: 'Ventes',
          data: props.salesData.trend
        }]
      })),
      heatmapData: computed(() => ({
        series: props.salesData.heatmap
      }))
    }
  }
})
&lt;/script>
