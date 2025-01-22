<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Toutes les activités</h1>
      </div>

      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div v-for="activity in allActivities" :key="activity.id" class="p-6 hover:bg-gray-50">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <i :class="[activity.icon, 'text-purple-600 text-lg']"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.text }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useActivities } from '../stores/activities'

export default {
  name: 'ActivitiesView',
  setup() {
    const { getAllActivities } = useActivities()
    const allActivities = ref([])

    onMounted(() => {
      allActivities.value = getAllActivities()
    })

    return {
      allActivities
    }
  }
}
</script>
