<template>
  <div class="relative">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'SalesChart',
  setup() {
    const canvas = ref(null)

    onMounted(() => {
      const ctx = canvas.value.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Ventes',
            data: [1200, 1900, 1500, 2100, 2400, 1800, 2800],
            borderColor: 'rgb(147, 51, 234)',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + ' €'
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    })

    return {
      canvas
    }
  }
}
</script>
