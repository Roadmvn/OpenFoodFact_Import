<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
        </p>
      </div>

      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <div v-if="success" class="p-4 bg-green-100 text-green-700 rounded-md">
        {{ success }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Envoi en cours...</span>
            <span v-else>Envoyer le lien de réinitialisation</span>
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/auth/login"
            class="font-medium text-purple-600 hover:text-purple-500"
          >
            Retour à la connexion
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'ResetPasswordView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const email = ref('')
    const error = ref('')
    const success = ref('')
    const isLoading = ref(false)

    const handleResetPassword = async () => {
      try {
        isLoading.value = true
        error.value = ''
        success.value = ''
        
        await authStore.resetPassword(email.value)
        success.value = 'Un email de réinitialisation a été envoyé à votre adresse'
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de l\'envoi'
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      error,
      success,
      isLoading,
      handleResetPassword
    }
  }
}
</script>
