<template>
  <div class="space-y-6">
    <!-- Sélecteur de graphique -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Visualisation des données
      </h3>
      <div class="flex space-x-2">
        <select
          v-model="selectedChart"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        >
          <option value="sales">Ventes</option>
          <option value="inventory">Inventaire</option>
          <option value="categories">Catégories</option>
        </select>
        <select
          v-model="timeRange"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        >
          <option value="day">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>
    </div>

    <!-- Zone de graphique -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div ref="chartContainer" class="w-full h-[400px]"></div>
    </div>

    <!-- Légende et statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="stat in currentStats" :key="stat.name" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stat.value }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

export default {
  name: 'D3Charts',
  setup() {
    const chartContainer = ref(null)
    const selectedChart = ref('sales')
    const timeRange = ref('month')
    const currentStats = ref([])

    // Données mockées - À remplacer par des appels API
    const mockData = {
      sales: [
        { date: '2024-01-01', value: 1200 },
        { date: '2024-01-02', value: 1500 },
        { date: '2024-01-03', value: 1100 },
        // ... plus de données
      ],
      inventory: [
        { name: 'Produit A', quantity: 50 },
        { name: 'Produit B', quantity: 30 },
        { name: 'Produit C', quantity: 80 },
        // ... plus de données
      ],
      categories: [
        { name: 'Alimentaire', value: 45 },
        { name: 'Boissons', value: 25 },
        { name: 'Hygiène', value: 15 },
        { name: 'Entretien', value: 15 }
      ]
    }

    const drawLineChart = (data) => {
      // Nettoyer le conteneur
      d3.select(chartContainer.value).selectAll('*').remove()

      const margin = { top: 20, right: 30, bottom: 30, left: 60 }
      const width = chartContainer.value.clientWidth - margin.left - margin.right
      const height = chartContainer.value.clientHeight - margin.top - margin.bottom

      const svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width])

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0])

      // Ajouter l'axe X
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))

      // Ajouter l'axe Y
      svg.append('g')
        .call(d3.axisLeft(y))

      // Ajouter la ligne
      const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.value))

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#8B5CF6')
        .attr('stroke-width', 2)
        .attr('d', line)

      // Ajouter les points
      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', '#8B5CF6')
    }

    const drawBarChart = (data) => {
      // Nettoyer le conteneur
      d3.select(chartContainer.value).selectAll('*').remove()

      const margin = { top: 20, right: 30, bottom: 40, left: 60 }
      const width = chartContainer.value.clientWidth - margin.left - margin.right
      const height = chartContainer.value.clientHeight - margin.top - margin.bottom

      const svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.name))
        .padding(0.2)

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.quantity)])
        .range([height, 0])

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')

      svg.append('g')
        .call(d3.axisLeft(y))

      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.quantity))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.quantity))
        .attr('fill', '#8B5CF6')
    }

    const drawPieChart = (data) => {
      // Nettoyer le conteneur
      d3.select(chartContainer.value).selectAll('*').remove()

      const width = chartContainer.value.clientWidth
      const height = chartContainer.value.clientHeight
      const radius = Math.min(width, height) / 2

      const svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeCategory10)

      const pie = d3.pie()
        .value(d => d.value)

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 40)

      const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.name))

      // Ajouter les labels
      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .text(d => `${d.data.name} (${d.data.value}%)`)
    }

    const updateChart = () => {
      switch (selectedChart.value) {
        case 'sales':
          drawLineChart(mockData.sales)
          break
        case 'inventory':
          drawBarChart(mockData.inventory)
          break
        case 'categories':
          drawPieChart(mockData.categories)
          break
      }
    }

    watch([selectedChart, timeRange], () => {
      updateChart()
    })

    onMounted(() => {
      updateChart()
    })

    return {
      chartContainer,
      selectedChart,
      timeRange,
      currentStats
    }
  }
}
</script>
