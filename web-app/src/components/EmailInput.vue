<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative">
      <!-- Icône à gauche -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="fas fa-envelope text-gray-400"></i>
      </div>

      <!-- Champ de saisie -->
      <input
        :id="id"
        type="email"
        :value="modelValue"
        @input="handleInput"
        class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        :class="{ 'border-red-300': error }"
        :placeholder="placeholder"
      />

      <!-- Icône de validation -->
      <div v-if="modelValue" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <i
          v-if="isValid"
          class="fas fa-check-circle text-green-500"
          aria-hidden="true"
        ></i>
        <i
          v-else
          class="fas fa-exclamation-circle text-red-500"
          aria-hidden="true"
        ></i>
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'EmailInput',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Adresse email'
    },
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: 'votre@email.com'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const error = ref('')
    const isValid = ref(false)

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const handleInput = (e) => {
      const value = e.target.value
      emit('update:modelValue', value)
      
      if (!value) {
        error.value = 'L\'adresse email est requise'
        isValid.value = false
      } else if (!validateEmail(value)) {
        error.value = 'L\'adresse email n\'est pas valide'
        isValid.value = false
      } else {
        error.value = ''
        isValid.value = true
      }
    }

    watch(() => props.modelValue, (newValue) => {
      if (!newValue) {
        error.value = ''
        isValid.value = false
      }
    })

    return {
      error,
      isValid,
      handleInput
    }
  }
}
</script>
