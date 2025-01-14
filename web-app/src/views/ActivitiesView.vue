<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Toutes les activités</h1>
      </div>

      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div v-for="activity in activities" :key="activity.id" class="p-6 hover:bg-gray-50">
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
import { ref } from 'vue'

export default {
  name: 'ActivitiesView',
  setup() {
    const activities = ref([
      {
        id: 1,
        text: 'Nouvelle commande #2458 créée par Jean Dupont',
        time: 'Il y a 3 minutes',
        icon: 'fas fa-shopping-cart'
      },
      {
        id: 2,
        text: 'Stock mis à jour pour "Ordinateur portable Pro"',
        time: 'Il y a 1 heure',
        icon: 'fas fa-box'
      },
      {
        id: 3,
        text: 'Paiement reçu pour la commande #2457',
        time: 'Il y a 2 heures',
        icon: 'fas fa-credit-card'
      },
      {
        id: 4,
        text: 'Nouvelle vente : 2x Smartphone X pour Marie Martin',
        time: 'Il y a 3 heures',
        icon: 'fas fa-shopping-cart'
      },
      {
        id: 5,
        text: 'Stock faible pour "Casque sans fil"',
        time: 'Il y a 4 heures',
        icon: 'fas fa-exclamation-triangle'
      },
      {
        id: 6,
        text: 'Mise à jour des prix catalogue',
        time: 'Il y a 5 heures',
        icon: 'fas fa-tag'
      },
      {
        id: 7,
        text: 'Nouveau client inscrit : Sophie Bernard',
        time: 'Il y a 6 heures',
        icon: 'fas fa-user-plus'
      },
      {
        id: 8,
        text: 'Retour produit traité pour la commande #2456',
        time: 'Il y a 7 heures',
        icon: 'fas fa-undo'
      },
      {
        id: 9,
        text: 'Promotion ajoutée sur les smartphones',
        time: 'Il y a 8 heures',
        icon: 'fas fa-percentage'
      },
      {
        id: 10,
        text: 'Inventaire mensuel terminé',
        time: 'Il y a 9 heures',
        icon: 'fas fa-clipboard-check'
      }
    ])

    return {
      activities
    }
  }
}
</script>
