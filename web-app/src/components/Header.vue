<template>
  <header class="bg-white shadow">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Bouton menu mobile -->
      <button
        @click="$emit('toggle-sidebar')"
        type="button"
        class="text-gray-500 lg:hidden"
      >
        <span class="sr-only">Open menu</span>
        <Bars3Icon class="h-6 w-6" />
      </button>

      <!-- Actions -->
      <div class="flex items-center gap-4 ml-auto">
        <!-- Menu utilisateur -->
        <div class="relative">
          <button
            type="button"
            class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="toggleUserMenu"
          >
            <span class="sr-only">Ouvrir le menu utilisateur</span>
            <img
              :src="userAvatar"
              alt=""
              class="h-8 w-8 rounded-full"
            />
          </button>

          <!-- Menu déroulant -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mon profil
            </router-link>
            <router-link
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Paramètres
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png')

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const closeMenus = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>
