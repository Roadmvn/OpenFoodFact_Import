<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="space-y-4">
      <!-- Barre de recherche principale -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Recherche</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="search"
            id="search"
            v-model="searchQuery"
            class="focus:ring-purple-500 focus:border-purple-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="Rechercher un produit..."
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Filtres avancés -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            id="category"
            v-model="filters.category"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            @change="handleSearch"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label for="priceRange" class="block text-sm font-medium text-gray-700">Prix</label>
          <div class="mt-1 grid grid-cols-2 gap-2">
            <input
              type="number"
              v-model.number="filters.minPrice"
              placeholder="Min"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              @input="handleSearch"
            />
            <input
              type="number"
              v-model.number="filters.maxPrice"
              placeholder="Max"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              @input="handleSearch"
            />
          </div>
        </div>

        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
          <select
            id="stock"
            v-model="filters.stock"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            @change="handleSearch"
          >
            <option value="">Tous</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture de stock</option>
          </select>
        </div>
      </div>

      <!-- Tri -->
      <div class="flex justify-between items-center">
        <div class="flex-1 max-w-xs">
          <label for="sortBy" class="block text-sm font-medium text-gray-700">Trier par</label>
          <select
            id="sortBy"
            v-model="sorting.field"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            @change="handleSearch"
          >
            <option value="name">Nom</option>
            <option value="price">Prix</option>
            <option value="stock">Stock</option>
            <option value="created_at">Date d'ajout</option>
          </select>
        </div>
        <div class="ml-4">
          <button
            @click="toggleSortOrder"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg
              :class="[sorting.order === 'asc' ? 'rotate-180' : '', 'h-4 w-4']"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { debounce } from 'lodash'

export default {
  name: 'ProductSearch',
  props: {
    categories: {
      type: Array,
      default: () => ['Alimentaire', 'Boissons', 'Hygiène', 'Entretien']
    }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const filters = reactive({
      category: '',
      minPrice: null,
      maxPrice: null,
      stock: ''
    })
    const sorting = reactive({
      field: 'name',
      order: 'asc'
    })

    const handleSearch = debounce(() => {
      emit('search', {
        query: searchQuery.value,
        filters,
        sorting
      })
    }, 300)

    const toggleSortOrder = () => {
      sorting.order = sorting.order === 'asc' ? 'desc' : 'asc'
      handleSearch()
    }

    return {
      searchQuery,
      filters,
      sorting,
      handleSearch,
      toggleSortOrder
    }
  }
}
</script>
