<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div class="flex justify-center space-x-4">
        <router-link
          to="/auth/login"
          class="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md"
        >
          Connexion
        </router-link>

        <button
          class="flex-1 text-center px-4 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-700"
        >
          Inscription
        </button>
      </div>

      <div>
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Rejoignez-nous et commencez à gérer votre supermarché
        </p>
      </div>

      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div class="mt-1">
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div class="mt-1">
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

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
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
            </button>
          </div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: passwordStrength + '%' }"
              ></div>
            </div>
            <p class="mt-1 text-sm" :class="passwordStrengthColor">
              {{ passwordStrengthText }}
            </p>
            <ul class="mt-2 space-y-1 text-sm text-gray-500">
              <li :class="{ 'text-green-500': hasMinLength }">
                <i :class="hasMinLength ? 'fas fa-check' : 'fas fa-times'" class="w-4 inline-block"></i>
                Au moins 8 caractères
              </li>
              <li :class="{ 'text-green-500': hasNumber }">
                <i :class="hasNumber ? 'fas fa-check' : 'fas fa-times'" class="w-4 inline-block"></i>
                Au moins 1 chiffre
              </li>
              <li :class="{ 'text-green-500': hasSpecial }">
                <i :class="hasSpecial ? 'fas fa-check' : 'fas fa-times'" class="w-4 inline-block"></i>
                Au moins 1 caractère spécial
              </li>
              <li :class="{ 'text-green-500': hasUppercase }">
                <i :class="hasUppercase ? 'fas fa-check' : 'fas fa-times'" class="w-4 inline-block"></i>
                Au moins 1 majuscule
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div class="mt-1 relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Inscription en cours...</span>
            <span v-else>S'inscrire</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const isLoading = ref(false)
    const error = ref('')

    // Password validation
    const hasMinLength = computed(() => password.value.length >= 8)
    const hasNumber = computed(() => /\d/.test(password.value))
    const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))
    const hasUppercase = computed(() => /[A-Z]/.test(password.value))

    const passwordStrength = computed(() => {
      let strength = 0
      if (hasMinLength.value) strength += 25
      if (hasNumber.value) strength += 25
      if (hasSpecial.value) strength += 25
      if (hasUppercase.value) strength += 25
      return strength
    })

    const passwordStrengthText = computed(() => {
      if (passwordStrength.value <= 25) return 'Très faible'
      if (passwordStrength.value <= 50) return 'Faible'
      if (passwordStrength.value <= 75) return 'Moyen'
      return 'Très fort'
    })

    const passwordStrengthColor = computed(() => {
      if (passwordStrength.value <= 25) return 'text-red-500'
      if (passwordStrength.value <= 50) return 'text-yellow-500'
      if (passwordStrength.value <= 75) return 'text-yellow-600'
      return 'text-green-500'
    })

    const isFormValid = computed(() => {
      return (
        firstName.value &&
        lastName.value &&
        email.value &&
        password.value &&
        confirmPassword.value &&
        password.value === confirmPassword.value &&
        passwordStrength.value === 100
      )
    })

    // Reset error when form changes
    watch([email, password, confirmPassword], () => {
      error.value = ''
    })

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas'
        return
      }

      try {
        isLoading.value = true
        error.value = ''
        
        await authStore.register({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        })

        router.push('/auth/login')
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de l\'inscription'
        console.error('Erreur d\'inscription:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isLoading,
      error,
      hasMinLength,
      hasNumber,
      hasSpecial,
      hasUppercase,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthColor,
      isFormValid,
      handleRegister
    }
  }
}
</script>
