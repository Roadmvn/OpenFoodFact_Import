<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Distribution des ventes</h3>
    </div>
    <div class="h-[300px]">
      <apexchart
        type="pie"
        :options="chartOptions"
        :series="chartSeries"
        height="100%"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'SalesDistributionChart',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const salesData = ref([
      { category: 'Électronique', value: 45 },
      { category: 'Périphériques', value: 25 },
      { category: 'Accessoires', value: 20 },
      { category: 'Services', value: 10 }
    ])

    const chartOptions = ref({
      chart: {
        type: 'pie',
        fontFamily: 'Inter, sans-serif',
      },
      labels: salesData.value.map(item => item.category),
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
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

    const chartSeries = computed(() => salesData.value.map(item => item.value))

    return {
      chartOptions,
      chartSeries
    }
  }
}
</script>
