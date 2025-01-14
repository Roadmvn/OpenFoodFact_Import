<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- En-tête -->
      <div class="text-center text-white mb-8">
        <h2 class="text-3xl font-bold">
          Bienvenue sur SuperMarché
        </h2>
        <p class="mt-2 text-sm text-purple-200">
          Connectez-vous pour accéder à votre espace de gestion
        </p>
      </div>

      <!-- Card principale -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <!-- Onglets -->
        <div class="flex mb-6">
          <button class="flex-1 text-center py-2 bg-purple-100 text-purple-700 rounded-md font-medium">
            Connexion
          </button>
          <router-link
            to="/auth/register"
            class="flex-1 text-center py-2 text-gray-500 hover:text-gray-700 font-medium"
          >
            Inscription
          </router-link>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                type="email"
                v-model="email"
                required
                placeholder="exemple@email.com"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="Votre mot de passe"
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-3 flex items-center"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
            </div>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <div class="text-sm">
              <router-link
                to="/auth/reset-password"
                class="font-medium text-purple-600 hover:text-purple-500"
              >
                Mot de passe oublié ?
              </router-link>
            </div>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <span v-if="isLoading">Connexion en cours...</span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <!-- Aide -->
        <div class="mt-6 text-center text-sm text-gray-500" @click="handleNeedHelp">
          Besoin d'aide ?
        </div>
        <div class="mt-2 grid grid-cols-2 gap-3">
          <button 
            @click="handleContact"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <i class="fas fa-envelope mr-2"></i>
            Contact
          </button>
          <button 
            @click="handleHelp"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <i class="fas fa-question-circle mr-2"></i>
            Aide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const showPassword = ref(false)
    const isLoading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      try {
        isLoading.value = true
        error.value = ''
        await authStore.login({
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value
        })
        router.push('/dashboard')
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de la connexion'
        console.error('Erreur de connexion:', err)
      } finally {
        isLoading.value = false
      }
    }

    const handleForgotPassword = () => {
      alert('Un email de réinitialisation a été envoyé à votre adresse email si elle existe dans notre base de données.')
    }

    const handleNeedHelp = () => {
      alert('Notre équipe de support est disponible 24/7 pour vous aider.')
    }

    const handleContact = () => {
      window.location.href = 'mailto:support@supermarche.com'
    }

    const handleHelp = () => {
      alert('Consultez notre centre d\'aide en ligne pour plus d\'informations.')
    }

    return {
      email,
      password,
      rememberMe,
      showPassword,
      isLoading,
      error,
      handleLogin,
      handleForgotPassword,
      handleNeedHelp,
      handleContact,
      handleHelp
    }
  }
}
</script>
