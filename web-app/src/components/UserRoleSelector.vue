<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">Choisissez votre rôle</label>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Option Vendeur -->
      <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
        <input
          type="radio"
          name="role"
          value="seller"
          v-model="modelValue"
          class="sr-only"
          aria-labelledby="role-seller-label"
          @change="$emit('update:modelValue', $event.target.value)"
        />
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p id="role-seller-label" class="font-medium text-gray-900">
                <i class="fas fa-store mr-2 text-purple-600"></i>
                Vendeur
              </p>
              <p class="text-gray-500">Gérez votre boutique et vos produits</p>
            </div>
          </div>
          <div class="shrink-0 text-white">
            <div :class="[
              modelValue === 'seller' ? 'bg-purple-600' : 'bg-gray-200',
              'h-6 w-6 rounded-full flex items-center justify-center transition-colors'
            ]">
              <i class="fas fa-check text-sm" v-if="modelValue === 'seller'"></i>
            </div>
          </div>
        </div>
      </label>

      <!-- Option Acheteur -->
      <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
        <input
          type="radio"
          name="role"
          value="buyer"
          v-model="modelValue"
          class="sr-only"
          aria-labelledby="role-buyer-label"
          @change="$emit('update:modelValue', $event.target.value)"
        />
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p id="role-buyer-label" class="font-medium text-gray-900">
                <i class="fas fa-shopping-cart mr-2 text-purple-600"></i>
                Acheteur
              </p>
              <p class="text-gray-500">Découvrez et achetez des produits</p>
            </div>
          </div>
          <div class="shrink-0 text-white">
            <div :class="[
              modelValue === 'buyer' ? 'bg-purple-600' : 'bg-gray-200',
              'h-6 w-6 rounded-full flex items-center justify-center transition-colors'
            ]">
              <i class="fas fa-check text-sm" v-if="modelValue === 'buyer'"></i>
            </div>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
label:focus-within {
  @apply ring-2 ring-purple-500 ring-offset-2;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>
