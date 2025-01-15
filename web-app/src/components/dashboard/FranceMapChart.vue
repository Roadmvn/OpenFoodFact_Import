<template>
  <div class="relative">
    <!-- Carte simplifiée de France avec des régions cliquables -->
    <div class="relative w-full h-full">
      <!-- Simulation de régions avec des rectangles colorés -->
      <div v-for="(value, region) in data" :key="region"
           class="absolute transform hover:scale-105 transition-transform cursor-pointer"
           :class="getRegionPosition(region)"
           @mouseenter="showTooltip(region, value)"
           @mouseleave="hideTooltip">
        <div :class="['rounded-lg p-4', getRegionColor(value)]">
          <span class="text-xs font-medium text-white opacity-75">{{ region }}</span>
        </div>
      </div>

      <!-- Tooltip -->
      <div v-if="tooltipData"
           class="absolute z-10 bg-white px-3 py-2 rounded-lg shadow-lg text-sm"
           :style="tooltipStyle">
        <p class="font-medium text-gray-900">{{ tooltipData.region }}</p>
        <p class="text-gray-600">{{ formatPrice(tooltipData.value) }}</p>
      </div>
    </div>

    <!-- Légende -->
    <div class="absolute bottom-0 right-0 bg-white rounded-lg shadow p-2">
      <div class="flex items-center space-x-2">
        <div v-for="(level, index) in heatLevels" :key="index" class="flex items-center">
          <div :class="['w-4 h-4 rounded', level.color]"></div>
          <span class="text-xs text-gray-600 ml-1">{{ level.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatPrice } from '../../utils/formatters'

export default {
  name: 'FranceMapChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const tooltipData = ref(null)
    const tooltipStyle = ref({
      top: '0px',
      left: '0px'
    })

    // Niveaux de chaleur pour la carte
    const heatLevels = [
      { min: 10000, color: 'bg-green-800', label: '> 10k€' },
      { min: 5000, color: 'bg-green-600', label: '5k-10k€' },
      { min: 1000, color: 'bg-green-400', label: '1k-5k€' },
      { min: 0, color: 'bg-green-200', label: '< 1k€' }
    ]

    // Positions relatives des régions (simulées)
    const regionPositions = {
      'Île-de-France': 'top-1/4 left-1/2',
      'Auvergne-Rhône-Alpes': 'top-1/2 right-1/4',
      'Nouvelle-Aquitaine': 'bottom-1/3 left-1/3',
      'Occitanie': 'bottom-1/4 left-1/2',
      'Hauts-de-France': 'top-1/6 left-1/2',
      'Grand Est': 'top-1/3 right-1/3',
      'Provence-Alpes-Côte d\'Azur': 'bottom-1/4 right-1/4',
      'Pays de la Loire': 'top-1/2 left-1/4',
      'Bretagne': 'top-1/3 left-1/6',
      'Normandie': 'top-1/4 left-1/3',
      'Bourgogne-Franche-Comté': 'top-1/2 right-1/3',
      'Centre-Val de Loire': 'top-1/2 left-1/2',
      'Corse': 'bottom-1/6 right-1/6'
    }

    const getRegionPosition = (region) => {
      return regionPositions[region] || ''
    }

    const getRegionColor = (value) => {
      const level = heatLevels.find(level => value >= level.min)
      return level ? level.color : heatLevels[heatLevels.length - 1].color
    }

    const showTooltip = (region, value) => {
      tooltipData.value = { region, value }
      // Positionner le tooltip (à améliorer avec la position réelle de la souris)
      tooltipStyle.value = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    const hideTooltip = () => {
      tooltipData.value = null
    }

    return {
      tooltipData,
      tooltipStyle,
      heatLevels,
      getRegionPosition,
      getRegionColor,
      showTooltip,
      hideTooltip,
      formatPrice
    }
  }
}
</script>
