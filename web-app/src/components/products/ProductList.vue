<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Search Bar -->
    <div class="mb-6">
      <input
        type="text"
        v-model="search"
        @input="handleSearch"
        placeholder="Rechercher des produits..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <i class="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in displayedProducts" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          :src="product.image_url || '/placeholder.png'"
          :alt="product.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">{{ product.price }} €</span>
            <button
              @click="addToCart(product)"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              <i class="fas fa-cart-plus mr-2"></i>
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <div class="flex space-x-2">
        <button
          v-for="pageNum in totalPages"
          :key="pageNum"
          @click="page = pageNum"
          :class="[
            'px-4 py-2 rounded',
            page === pageNum
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ pageNum }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductList',
  setup() {
    const productStore = useProductStore()
    const cartStore = useCartStore()
    
    const search = ref('')
    const page = ref(1)
    const itemsPerPage = 12

    const loading = computed(() => productStore.loading)
    const error = computed(() => productStore.error)
    const products = computed(() => productStore.products)
    
    const totalPages = computed(() => {
      return Math.ceil(products.value.length / itemsPerPage)
    })

    const displayedProducts = computed(() => {
      const start = (page.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return products.value.slice(start, end)
    })

    const handleSearch = async () => {
      page.value = 1
      await productStore.fetchProducts(search.value)
    }

    const addToCart = (product) => {
      cartStore.addItem(product)
    }

    onMounted(async () => {
      await productStore.fetchProducts()
    })

    return {
      search,
      page,
      loading,
      error,
      displayedProducts,
      totalPages,
      handleSearch,
      addToCart
    }
  }
}
</script>
