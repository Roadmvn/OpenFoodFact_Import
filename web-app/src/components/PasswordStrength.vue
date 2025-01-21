<template>
  <div class="mt-1">
    <div class="flex items-center">
      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="[
            { 'w-1/4 bg-red-500': strength === 'weak' },
            { 'w-2/4 bg-yellow-500': strength === 'medium' },
            { 'w-3/4 bg-blue-500': strength === 'strong' },
            { 'w-full bg-green-500': strength === 'very-strong' }
          ]"
        ></div>
      </div>
      <span class="ml-2 text-xs text-gray-500">{{ strengthText }}</span>
    </div>
    <ul class="mt-2 text-xs text-gray-500 space-y-1">
      <li :class="{ 'text-green-500': hasMinLength }">
        <span v-if="hasMinLength">✓</span>
        <span v-else>·</span>
        Au moins 8 caractères
      </li>
      <li :class="{ 'text-green-500': hasNumber }">
        <span v-if="hasNumber">✓</span>
        <span v-else>·</span>
        Au moins 1 chiffre
      </li>
      <li :class="{ 'text-green-500': hasSpecial }">
        <span v-if="hasSpecial">✓</span>
        <span v-else>·</span>
        Au moins 1 caractère spécial
      </li>
      <li :class="{ 'text-green-500': hasUppercase }">
        <span v-if="hasUppercase">✓</span>
        <span v-else>·</span>
        Au moins 1 majuscule
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PasswordStrength',
  props: {
    password: {
      type: String,
      required: true
    }
  },
  computed: {
    hasMinLength() {
      return this.password.length >= 8;
    },
    hasNumber() {
      return /\d/.test(this.password);
    },
    hasSpecial() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    },
    hasUppercase() {
      return /[A-Z]/.test(this.password);
    },
    strength() {
      const checks = [
        this.hasMinLength,
        this.hasNumber,
        this.hasSpecial,
        this.hasUppercase
      ];
      const passedChecks = checks.filter(Boolean).length;

      if (passedChecks === 0) return 'weak';
      if (passedChecks === 1) return 'weak';
      if (passedChecks === 2) return 'medium';
      if (passedChecks === 3) return 'strong';
      return 'very-strong';
    },
    strengthText() {
      const texts = {
        'weak': 'Faible',
        'medium': 'Moyen',
        'strong': 'Fort',
        'very-strong': 'Très fort'
      };
      return texts[this.strength];
    }
  }
}
</script>
