import { ref } from 'vue'

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
  }
])

export function useActivities() {
  const addActivity = (activity) => {
    // Générer un nouvel ID basé sur le timestamp
    const newId = Date.now()
    activities.value.unshift({
      id: newId,
      ...activity
    })
  }

  const getRecentActivities = (count = 4) => {
    return activities.value.slice(0, count)
  }

  const getAllActivities = () => {
    return activities.value
  }

  return {
    activities,
    addActivity,
    getRecentActivities,
    getAllActivities
  }
}
