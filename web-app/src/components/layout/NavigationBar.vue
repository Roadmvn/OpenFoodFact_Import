<template>
  <nav class="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo et Nom -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <img class="h-8 w-8" src="@/assets/logo.png" alt="SuperMarché Logo" />
            <span class="text-white text-xl font-bold">SuperMarché</span>
          </router-link>
        </div>

        <!-- Navigation Principale -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-4">
            <router-link
              to="/products"
              class="nav-link group"
              :class="{ 'nav-link-active': $route.path === '/products' }"
            >
              <i class="fas fa-box-open mr-2"></i>
              <span>Produits</span>
              <div class="nav-link-underline"></div>
            </router-link>

            <router-link
              to="/orders"
              class="nav-link group"
              :class="{ 'nav-link-active': $route.path === '/orders' }"
            >
              <i class="fas fa-shopping-cart mr-2"></i>
              <span>Commandes</span>
              <div class="nav-link-underline"></div>
            </router-link>

            <router-link
              to="/invoices"
              class="nav-link group"
              :class="{ 'nav-link-active': $route.path === '/invoices' }"
            >
              <i class="fas fa-file-invoice mr-2"></i>
              <span>Factures</span>
              <div class="nav-link-underline"></div>
            </router-link>

            <router-link
              to="/statistics"
              class="nav-link group"
              :class="{ 'nav-link-active': $route.path === '/statistics' }"
            >
              <i class="fas fa-chart-line mr-2"></i>
              <span>Statistiques</span>
              <div class="nav-link-underline"></div>
            </router-link>
          </div>
        </div>

        <!-- Menu Utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative p-2 text-gray-200 hover:text-white transition-colors duration-200">
            <i class="fas fa-bell"></i>
            <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              2
            </span>
          </button>

          <!-- Menu Profil -->
          <div class="relative" @click="toggleProfileMenu" v-click-outside="closeProfileMenu">
            <button class="flex items-center space-x-3 text-gray-200 hover:text-white transition-colors duration-200">
              <img
                class="h-8 w-8 rounded-full border-2 border-white/10"
                :src="userAvatar"
                :alt="userName"
              />
              <span class="font-medium">{{ userName }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>

            <!-- Menu déroulant -->
            <div
              v-show="showProfileMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <i class="fas fa-user mr-2"></i> Mon profil
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <i class="fas fa-cog mr-2"></i> Paramètres
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
              </button>
            </div>
          </div>
        </div>

        <!-- Menu Mobile -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-200 hover:text-white focus:outline-none"
          >
            <i :class="['fas', mobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile Panel -->
    <div
      v-show="mobileMenuOpen"
      class="md:hidden bg-purple-900/95 backdrop-blur-sm"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/products"
          class="mobile-nav-link"
          :class="{ 'bg-purple-700': $route.path === '/products' }"
        >
          <i class="fas fa-box-open mr-2"></i> Produits
        </router-link>

        <router-link
          to="/orders"
          class="mobile-nav-link"
          :class="{ 'bg-purple-700': $route.path === '/orders' }"
        >
          <i class="fas fa-shopping-cart mr-2"></i> Commandes
        </router-link>

        <router-link
          to="/invoices"
          class="mobile-nav-link"
          :class="{ 'bg-purple-700': $route.path === '/invoices' }"
        >
          <i class="fas fa-file-invoice mr-2"></i> Factures
        </router-link>

        <router-link
          to="/statistics"
          class="mobile-nav-link"
          :class="{ 'bg-purple-700': $route.path === '/statistics' }"
        >
          <i class="fas fa-chart-line mr-2"></i> Statistiques
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'NavigationBar',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const showProfileMenu = ref(false)
    const mobileMenuOpen = ref(false)
    const userName = ref('Imane Dablaq')
    const userAvatar = ref('https://ui-avatars.com/api/?name=Imane+Dablaq&background=6D28D9&color=fff')

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value
    }

    const closeProfileMenu = () => {
      showProfileMenu.value = false
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    return {
      showProfileMenu,
      mobileMenuOpen,
      userName,
      userAvatar,
      toggleProfileMenu,
      closeProfileMenu,
      toggleMobileMenu,
      logout
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-gray-200 text-sm font-medium relative;
}

.nav-link:hover {
  @apply text-white;
}

.nav-link-active {
  @apply text-white;
}

.nav-link-underline {
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-200;
}

.group:hover .nav-link-underline {
  @apply scale-x-100;
}

.nav-link-active .nav-link-underline {
  @apply scale-x-100;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700;
}

/* Animation pour le menu mobile */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu-enter-active {
  animation: slideDown 0.2s ease-out;
}

.mobile-menu-leave-active {
  animation: slideDown 0.2s ease-out reverse;
}
</style>
