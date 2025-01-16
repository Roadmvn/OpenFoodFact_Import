<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">Choisissez votre rôle</label>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Option Vendeur -->
      <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="{ 'border-purple-600': modelValue === 'seller' }">
        <input
          type="radio"
          name="role"
          value="seller"
          :checked="modelValue === 'seller'"
          @change="$emit('update:modelValue', 'seller')"
          class="sr-only"
        />
        <div class="flex items-center w-full">
          <div class="flex-shrink-0 mr-4">
            <i class="fas fa-store text-2xl text-purple-600"></i>
          </div>
          <div class="flex flex-col flex-grow">
            <span class="block text-sm font-medium text-gray-900">Vendeur</span>
            <span class="block text-sm text-gray-500">
              Créez votre boutique en ligne et gérez vos produits, stocks et commandes.
            </span>
          </div>
          <div class="ml-4 flex-shrink-0 text-purple-600" v-if="modelValue === 'seller'">
            <i class="fas fa-check-circle text-lg"></i>
          </div>
        </div>
      </label>

      <!-- Option Acheteur -->
      <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="{ 'border-purple-600': modelValue === 'buyer' }">
        <input
          type="radio"
          name="role"
          value="buyer"
          :checked="modelValue === 'buyer'"
          @change="$emit('update:modelValue', 'buyer')"
          class="sr-only"
        />
        <div class="flex items-center w-full">
          <div class="flex-shrink-0 mr-4">
            <i class="fas fa-shopping-cart text-2xl text-purple-600"></i>
          </div>
          <div class="flex flex-col flex-grow">
            <span class="block text-sm font-medium text-gray-900">Acheteur</span>
            <span class="block text-sm text-gray-500">
              Découvrez des produits uniques et effectuez vos achats en toute sécurité.
            </span>
          </div>
          <div class="ml-4 flex-shrink-0 text-purple-600" v-if="modelValue === 'buyer'">
            <i class="fas fa-check-circle text-lg"></i>
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
label:hover {
  @apply border-purple-300;
}

label:focus-within {
  @apply ring-2 ring-purple-500 ring-offset-2;
}
</style>
