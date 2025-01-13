<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-16 w-auto" src="@/assets/logo.png" alt="SuperMarché Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Bienvenue sur SuperMarché
      </h2>
      <p class="mt-2 text-center text-sm text-purple-200">
        Connectez-vous pour accéder à votre espace de gestion
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Onglets de navigation -->
        <div class="sm:flex sm:justify-center space-x-4 mb-8">
          <button
            class="flex-1 text-center px-3 py-2 font-medium text-sm rounded-md bg-purple-100 text-purple-700"
          >
            Connexion
          </button>
          <button
            @click="$router.push('/auth/register')"
            class="flex-1 text-center px-3 py-2 font-medium text-sm rounded-md text-gray-500 hover:text-gray-700"
          >
            Inscription
          </button>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <EmailInput
            v-model="email"
            id="login-email"
          />

          <PasswordInput
            v-model="password"
            id="login-password"
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <button
                type="button"
                @click="$router.push('/auth/forgot-password')"
                class="font-medium text-purple-600 hover:text-purple-500"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span v-if="loading">Connexion en cours...</span>
              <span v-else>Se connecter</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Besoin d'aide ?</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="mailto:support@supermarche.com"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i class="fas fa-envelope mr-2"></i>
                Contact
              </a>
            </div>
            <div>
              <button
                @click="$router.push('/support')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i class="fas fa-question-circle mr-2"></i>
                Aide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center">
      <p class="text-xs text-purple-200">
        &copy; 2025 SuperMarché. Tous droits réservés.
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default {
  name: 'LoginView',
  components: {
    EmailInput,
    PasswordInput
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        await authStore.login({
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Erreur de connexion:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      loading,
      handleLogin
    }
  }
}
</script>
