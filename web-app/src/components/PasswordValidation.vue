<template>
  <div class="space-y-1 text-sm">
    <div class="flex items-center" :class="hasMinLength ? 'text-green-600' : 'text-gray-500'">
      <i class="fas fa-check-circle mr-2" v-if="hasMinLength"></i>
      <i class="fas fa-circle mr-2" v-else></i>
      Au moins 8 caractères
    </div>
    <div class="flex items-center" :class="hasNumber ? 'text-green-600' : 'text-gray-500'">
      <i class="fas fa-check-circle mr-2" v-if="hasNumber"></i>
      <i class="fas fa-circle mr-2" v-else></i>
      Au moins 1 chiffre
    </div>
    <div class="flex items-center" :class="hasSpecial ? 'text-green-600' : 'text-gray-500'">
      <i class="fas fa-check-circle mr-2" v-if="hasSpecial"></i>
      <i class="fas fa-circle mr-2" v-else></i>
      Au moins 1 caractère spécial
    </div>
    <div class="flex items-center" :class="hasUppercase ? 'text-green-600' : 'text-gray-500'">
      <i class="fas fa-check-circle mr-2" v-if="hasUppercase"></i>
      <i class="fas fa-circle mr-2" v-else></i>
      Au moins 1 majuscule
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordValidation',
  props: {
    password: {
      type: String,
      required: true
    }
  },
  computed: {
    hasMinLength() {
      return this.password.length >= 8
    },
    hasNumber() {
      return /\d/.test(this.password)
    },
    hasSpecial() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password)
    },
    hasUppercase() {
      return /[A-Z]/.test(this.password)
    },
    isValid() {
      return this.hasMinLength && this.hasNumber && this.hasSpecial && this.hasUppercase
    }
  }
}
</script>
