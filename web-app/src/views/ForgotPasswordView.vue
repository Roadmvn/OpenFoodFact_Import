<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/logo.png" alt="SuperMarché Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Réinitialisation du mot de passe
      </h2>
      <p class="mt-2 text-center text-sm text-purple-200">
        Entrez votre adresse email pour recevoir un lien de réinitialisation
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span v-if="loading">Envoi en cours...</span>
              <span v-else>Envoyer le lien</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button
                @click="$router.push('/auth/login')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Retour
              </button>
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
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ForgotPasswordView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const loading = ref(false)

    const handleResetPassword = async () => {
      try {
        loading.value = true
        // Ici, vous devrez implémenter la logique de réinitialisation du mot de passe
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
        alert('Si cette adresse email est associée à un compte, vous recevrez un email avec les instructions de réinitialisation.')
        router.push('/auth/login')
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      handleResetPassword
    }
  }
}
</script>
