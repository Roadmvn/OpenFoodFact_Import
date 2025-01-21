<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Gestion des utilisateurs</h1>
      <button
        @click="showCreateModal = true"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <i class="fas fa-plus mr-2"></i>
        Nouvel utilisateur
      </button>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
          <input
            v-model="filters.search"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom, email..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            v-model="filters.role"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value="user">Utilisateur</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
          <select
            v-model="filters.sort"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="role">Rôle</option>
            <option value="createdAt">Date de création</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getRoleClass(user.role)"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="editUser(user)"
                class="text-blue-600 hover:text-blue-800 mr-3"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="showResetPasswordModal(user)"
                class="text-yellow-600 hover:text-yellow-800 mr-3"
              >
                <i class="fas fa-key"></i>
              </button>
              <button
                v-if="user.role !== 'admin' || adminCount > 1"
                @click="confirmDelete(user)"
                class="text-red-600 hover:text-red-800"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal || editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
        </h2>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                v-model="userForm.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="userForm.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                v-model="userForm.role"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Utilisateur</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div v-if="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {{ editingUser ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de réinitialisation du mot de passe -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Réinitialiser le mot de passe</h2>
        <form @submit.prevent="resetPassword">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                v-model="newPassword"
                type="password"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closePasswordModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'

export default {
  name: 'UserManagement',
  
  setup() {
    const userStore = useUserStore()
    const toast = useToast()

    // État
    const users = ref([])
    const showCreateModal = ref(false)
    const showPasswordModal = ref(false)
    const editingUser = ref(null)
    const selectedUser = ref(null)
    const adminCount = ref(0)
    const newPassword = ref('')
    const confirmPassword = ref('')
    
    const userForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: ''
    })

    const filters = ref({
      search: '',
      role: '',
      sort: 'name'
    })

    // Computed
    const filteredUsers = computed(() => {
      let result = [...users.value]

      // Filtre de recherche
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        result = result.filter(user => 
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        )
      }

      // Filtre par rôle
      if (filters.value.role) {
        result = result.filter(user => user.role === filters.value.role)
      }

      // Tri
      result.sort((a, b) => {
        switch (filters.value.sort) {
          case 'name':
            return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
          case 'email':
            return a.email.localeCompare(b.email)
          case 'role':
            return a.role.localeCompare(b.role)
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt)
          default:
            return 0
        }
      })

      return result
    })

    // Méthodes
    const loadUsers = async () => {
      try {
        const response = await userStore.getAllUsers()
        users.value = response
        adminCount.value = response.filter(user => user.role === 'admin').length
      } catch (error) {
        toast.error('Erreur lors du chargement des utilisateurs')
      }
    }

    const getRoleClass = (role) => {
      const classes = {
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-yellow-100 text-yellow-800',
        user: 'bg-green-100 text-green-800'
      }
      return classes[role] || 'bg-gray-100 text-gray-800'
    }

    const editUser = (user) => {
      editingUser.value = user
      userForm.value = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
      showCreateModal.value = true
    }

    const showResetPasswordModal = (user) => {
      selectedUser.value = user
      showPasswordModal.value = true
      newPassword.value = ''
      confirmPassword.value = ''
    }

    const closeModal = () => {
      showCreateModal.value = false
      editingUser.value = null
      userForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        password: ''
      }
    }

    const closePasswordModal = () => {
      showPasswordModal.value = false
      selectedUser.value = null
      newPassword.value = ''
      confirmPassword.value = ''
    }

    const saveUser = async () => {
      try {
        if (editingUser.value) {
          await userStore.updateUser(editingUser.value.id, userForm.value)
          toast.success('Utilisateur mis à jour avec succès')
        } else {
          await userStore.createUser(userForm.value)
          toast.success('Utilisateur créé avec succès')
        }
        await loadUsers()
        closeModal()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
      }
    }

    const resetPassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        toast.error('Les mots de passe ne correspondent pas')
        return
      }

      try {
        await userStore.resetPassword(selectedUser.value.id, newPassword.value)
        toast.success('Mot de passe réinitialisé avec succès')
        closePasswordModal()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation')
      }
    }

    const confirmDelete = async (user) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
        try {
          await userStore.deleteUser(user.id)
          toast.success('Utilisateur supprimé avec succès')
          await loadUsers()
        } catch (error) {
          toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
        }
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      filters,
      filteredUsers,
      showCreateModal,
      showPasswordModal,
      editingUser,
      userForm,
      newPassword,
      confirmPassword,
      adminCount,
      formatDate,
      getRoleClass,
      editUser,
      showResetPasswordModal,
      closeModal,
      closePasswordModal,
      saveUser,
      resetPassword,
      confirmDelete
    }
  }
}
</script>
