<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-purple-600 border-b border-purple-700">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et titre -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="@/assets/logo.png" alt="SuperMarché" />
              <span class="ml-2 text-white font-semibold text-lg">SuperMarché</span>
            </div>
          </div>

          <!-- Navigation principale -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                $route.name === item.name
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-100 hover:bg-purple-500 hover:text-white'
              ]"
            >
              {{ item.text }}
            </router-link>
          </div>

          <!-- Menu utilisateur -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="ml-3 relative">
              <div class="flex items-center">
                <button
                  @click="showProfileMenu = !showProfileMenu"
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white"
                >
                  <span class="sr-only">Ouvrir le menu utilisateur</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>

              <!-- Menu déroulant -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showProfileMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                >
                  <router-link
                    to="/dashboard/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    @click="showProfileMenu = false"
                  >
                    Mon profil
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Se déconnecter
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DashboardLayout',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const showProfileMenu = ref(false)

    const navigationItems = [
      { name: 'dashboard', to: '/dashboard', text: 'Tableau de bord' },
      { name: 'products', to: '/dashboard/products', text: 'Produits' },
      { name: 'orders', to: '/dashboard/orders', text: 'Commandes' },
      { name: 'statistics', to: '/dashboard/statistics', text: 'Statistiques' },
      { name: 'invoices', to: '/dashboard/invoices', text: 'Factures' }
    ]

    const handleLogout = async () => {
      try {
        authStore.logout()
        await router.push('/auth/login')
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }

    return {
      showProfileMenu,
      navigationItems,
      handleLogout
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
