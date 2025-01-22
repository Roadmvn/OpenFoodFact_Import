<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative">
      <!-- Icône à gauche -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="fas fa-lock text-gray-400"></i>
      </div>

      <!-- Champ de saisie -->
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup="checkPassword"
        @keypress="checkCapsLock"
        class="appearance-none block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        :class="{ 'border-red-300': errors.length > 0 }"
        :placeholder="placeholder"
      />

      <!-- Icônes à droite -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
        <!-- Indicateur Caps Lock -->
        <span v-if="capsLockOn" class="text-yellow-500" title="Majuscules activées">
          <i class="fas fa-arrow-alt-square-up"></i>
        </span>

        <!-- Bouton afficher/masquer mot de passe -->
        <button
          type="button"
          @click="togglePassword"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <!-- Indicateur de force du mot de passe -->
    <div v-if="showStrength" class="mt-2">
      <div class="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="{
            'w-1/4 bg-red-500': passwordStrength === 'faible',
            'w-2/4 bg-yellow-500': passwordStrength === 'moyen',
            'w-3/4 bg-blue-500': passwordStrength === 'fort',
            'w-full bg-green-500': passwordStrength === 'très fort'
          }"
        ></div>
      </div>
      <p class="mt-1 text-sm" :class="{
        'text-red-500': passwordStrength === 'faible',
        'text-yellow-500': passwordStrength === 'moyen',
        'text-blue-500': passwordStrength === 'fort',
        'text-green-500': passwordStrength === 'très fort'
      }">
        Force du mot de passe : {{ passwordStrength }}
      </p>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="errors.length > 0" class="mt-2 text-sm text-red-600">
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PasswordInput',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Mot de passe'
    },
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '••••••••'
    },
    showStrength: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const showPassword = ref(false)
    const capsLockOn = ref(false)
    const errors = ref([])

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const checkCapsLock = (e) => {
      capsLockOn.value = e.getModifierState('CapsLock')
    }

    const passwordStrength = computed(() => {
      const password = props.modelValue
      if (!password) return 'faible'

      let score = 0
      // Longueur minimale
      if (password.length >= 8) score++
      // Contient des chiffres
      if (/\d/.test(password)) score++
      // Contient des minuscules et majuscules
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
      // Contient des caractères spéciaux
      if (/[^A-Za-z0-9]/.test(password)) score++

      switch (score) {
        case 0:
        case 1:
          return 'faible'
        case 2:
          return 'moyen'
        case 3:
          return 'fort'
        case 4:
          return 'très fort'
      }
    })

    const checkPassword = () => {
      errors.value = []
      const password = props.modelValue

      if (password.length < 8) {
        errors.value.push('Le mot de passe doit contenir au moins 8 caractères')
      }
      if (!/\d/.test(password)) {
        errors.value.push('Le mot de passe doit contenir au moins 1 chiffre')
      }
      if (!/[A-Z]/.test(password)) {
        errors.value.push('Le mot de passe doit contenir au moins 1 majuscule')
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        errors.value.push('Le mot de passe doit contenir au moins 1 caractère spécial')
      }
    }

    return {
      showPassword,
      capsLockOn,
      errors,
      passwordStrength,
      togglePassword,
      checkCapsLock,
      checkPassword
    }
  }
}
</script>
