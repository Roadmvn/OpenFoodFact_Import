<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-[#004D40] fixed h-full">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6">
        <img class="h-8 w-auto" src="@/assets/logo.png" alt="SuperMarché" />
        <span class="ml-2 text-white font-semibold text-lg">Key</span>
      </div>

      <!-- Navigation -->
      <div class="px-4 py-4">
        <!-- Menu principal -->
        <div class="space-y-1">
          <router-link
            v-for="item in mainMenuItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1"
            :class="[
              $route.name === item.name
                ? 'bg-[#00695C] text-white'
                : 'text-gray-100 hover:bg-[#00695C] hover:text-white'
            ]"
          >
            <i :class="['fas', item.icon, 'w-5 h-5 mr-3']"></i>
            {{ item.text }}
          </router-link>
        </div>

        <!-- Séparateur -->
        <div class="my-4 border-t border-[#00695C]"></div>

        <!-- Menu profil -->
        <div class="space-y-1">
          <router-link
            to="/dashboard/profile"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 text-gray-100 hover:bg-[#00695C] hover:text-white"
          >
            <i class="fas fa-user w-5 h-5 mr-3"></i>
            Mon Profil
          </router-link>
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-100 hover:bg-[#00695C] hover:text-white"
          >
            <i class="fas fa-sign-out-alt w-5 h-5 mr-3"></i>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Header -->
      <div class="bg-white h-16 fixed right-0 left-64 px-6 flex items-center justify-between">
        <div class="flex items-center">
        </div>
        <div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="pt-16 p-6">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userAvatar = 'https://via.placeholder.com/40'
const userName = authStore.user?.name || 'Utilisateur'
const userEmail = authStore.user?.email || 'utilisateur@example.com'

const mainMenuItems = [
  { name: 'dashboard', to: '/dashboard', text: 'Dashboard', icon: 'fa-chart-line' },
  { name: 'widgets', to: '/dashboard/widgets', text: 'Widgets', icon: 'fa-th-large' },
  { name: 'products', to: '/dashboard/products', text: 'Produits', icon: 'fa-box' },
  { name: 'orders', to: '/dashboard/orders', text: 'Commandes', icon: 'fa-shopping-cart' },
  { name: 'statistics', to: '/dashboard/statistics', text: 'Statistiques', icon: 'fa-chart-bar' },
  { name: 'invoices', to: '/dashboard/invoices', text: 'Factures', icon: 'fa-file-invoice' },
  { name: 'activities', to: '/dashboard/activities', text: 'Activités', icon: 'fa-history' }
]

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
