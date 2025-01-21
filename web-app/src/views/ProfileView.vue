<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Bannière -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-800 h-48">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
        <h1 class="text-3xl font-bold text-white pb-6">Mon Profil</h1>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
      <div class="bg-white rounded-lg shadow p-6">
        <!-- En-tête avec avatar -->
        <div class="flex items-center space-x-6 mb-8">
          <div class="h-24 w-24 rounded-full bg-purple-200 flex items-center justify-center">
            <span class="text-3xl font-bold text-purple-700">{{ userInitials }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="text-gray-500">{{ user?.email }}</p>
          </div>
        </div>

        <!-- Informations du profil -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Prénom</label>
                <p class="mt-1 text-gray-900">{{ user?.firstName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Nom</label>
                <p class="mt-1 text-gray-900">{{ user?.lastName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-gray-900">{{ user?.email }}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Dernière connexion</label>
                <p class="mt-1 text-gray-900">14 janvier 2024</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Mot de passe</label>
                <p class="mt-1 text-gray-900">••••••••</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex space-x-4">
          <button 
            @click="showEditModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <i class="fas fa-edit mr-2"></i>
            Modifier
          </button>
          <button 
            @click="showPasswordModal = true"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <i class="fas fa-key mr-2"></i>
            Mot de passe
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification du profil -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-medium text-gray-900">Modifier le profil</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveProfile" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Prénom</label>
              <input 
                type="text" 
                v-model="editForm.firstName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input 
                type="text" 
                v-model="editForm.lastName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                v-model="editForm.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de changement de mot de passe -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
          <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="savePassword" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
              <input 
                type="password" 
                v-model="passwordForm.currentPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input 
                type="password" 
                v-model="passwordForm.newPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input 
                type="password" 
                v-model="passwordForm.confirmPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showPasswordModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'ProfileView',
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.getUser)
    const showEditModal = ref(false)
    const showPasswordModal = ref(false)

    const editForm = ref({
      firstName: user.value?.firstName || '',
      lastName: user.value?.lastName || '',
      email: user.value?.email || ''
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const userInitials = computed(() => {
      if (!user.value) return ''
      return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
    })

    const saveProfile = async () => {
      try {
        // Simuler la sauvegarde
        await new Promise(resolve => setTimeout(resolve, 500))
        showEditModal.value = false
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du profil:', error)
      }
    }

    const savePassword = async () => {
      try {
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          alert('Les mots de passe ne correspondent pas')
          return
        }
        // Simuler la sauvegarde
        await new Promise(resolve => setTimeout(resolve, 500))
        showPasswordModal.value = false
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error)
      }
    }

    return {
      user,
      userInitials,
      showEditModal,
      showPasswordModal,
      editForm,
      passwordForm,
      saveProfile,
      savePassword
    }
  }
}
</script>
