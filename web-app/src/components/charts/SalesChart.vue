<template>
  <div class="relative">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'SalesChart',
  setup() {
    const chartCanvas = ref(null)
    let chart = null

    const createChart = () => {
      const ctx = chartCanvas.value.getContext('2d')
      
      // Données de démonstration
      const data = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Ventes',
            data: [1200, 1900, 1500, 2100, 2400, 1800, 2800],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      }

      // Configuration du graphique
      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1F2937',
              titleColor: '#F3F4F6',
              bodyColor: '#F3F4F6',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y} €`
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280',
                callback: function(value) {
                  return `${value} €`
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      }

      // Création du graphique
      chart = new Chart(ctx, config)
    }

    onMounted(() => {
      createChart()
    })

    return {
      chartCanvas
    }
  }
}
</script>
