<template>
  <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">
        Créer un compte
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Rejoignez-nous et commencez à gérer votre supermarché
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <span v-if="loading">Inscription en cours...</span>
          <span v-else>S'inscrire</span>
        </button>
      </div>
    </form>

    <div v-if="error" class="mt-4 text-sm text-red-600">
      {{ error }}
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Déjà un compte?
        <router-link to="/auth/login" class="font-medium text-purple-600 hover:text-purple-500">
          Se connecter
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    const error = ref('')
    
    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const handleRegister = async () => {
      try {
        error.value = ''
        
        if (formData.value.password !== formData.value.confirmPassword) {
          error.value = 'Les mots de passe ne correspondent pas'
          return
        }

        loading.value = true
        await authStore.register({
          firstName: formData.value.firstName,
          lastName: formData.value.lastName,
          email: formData.value.email,
          password: formData.value.password
        })
        
        router.push('/auth/login')
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de l\'inscription'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      error,
      handleRegister
    }
  }
}
</script>
