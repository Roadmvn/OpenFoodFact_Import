<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Produits</h1>
        <div class="space-x-4">
          <button 
            v-if="isManagerOrAdmin"
            @click="showOpenFoodFacts = true"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Importer depuis OpenFoodFacts
          </button>
          <button 
            v-if="isManagerOrAdmin"
            @click="openNewProductModal"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter un Produit
          </button>
        </div>
      </div>
    </div>

    <!-- Recherche OpenFoodFacts -->
    <div v-if="showOpenFoodFacts && isManagerOrAdmin" class="mb-8">
      <OpenFoodFactsSearch 
        @product-imported="handleProductImported"
        @success="showSuccess"
        @error="showError"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="py-4 space-y-4">
        <!-- Filtres avancés -->
        <AdvancedFilters
          :categories="categories"
          @filter="handleFilter"
          @export="handleExport"
        />

        <!-- Liste des produits -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="product in filteredProducts" :key="product.id" 
               class="bg-white rounded-lg shadow overflow-hidden">
            <img 
              :src="product.imageUrl || '/placeholder-product.png'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-xl font-semibold">{{ product.name }}</h3>
              <p class="text-gray-600">{{ product.brand }}</p>
              <p class="text-lg font-bold text-green-600">{{ formatPrice(product.price) }}</p>
              <p class="text-sm text-gray-500">Stock: {{ product.quantity }}</p>
              
              <div v-if="isManagerOrAdmin" class="mt-4 space-x-2">
                <button 
                  @click="handleEdit(product)"
                  class="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                >
                  Modifier
                </button>
                <button 
                  @click="updateStock(product)"
                  class="bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200"
                >
                  Stock
                </button>
                <button 
                  v-if="isAdmin"
                  @click="handleDelete(product)"
                  class="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <TablePagination
          v-if="totalItems > 0"
          v-model:currentPage="currentPage"
          :total-items="totalItems"
          :per-page="perPage"
        />
      </div>
    </div>

    <!-- Modal nouveau/édition produit -->
    <ProductForm
      v-if="showProductModal"
      :product="selectedProduct"
      @close="closeProductModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/outline'
import AdvancedFilters from '../components/AdvancedFilters.vue'
import ProductTable from '../components/ProductTable.vue'
import ProductForm from '../components/ProductForm.vue'
import TablePagination from '../components/TablePagination.vue'
import OpenFoodFactsSearch from '../components/OpenFoodFactsSearch.vue'
import { useNotificationStore } from '../stores/notifications'
import exportService from '../services/exportService'
import axios from 'axios'

const notificationStore = useNotificationStore()

// État
const products = ref([])
const loading = ref(true)
const showProductModal = ref(false)
const selectedProduct = ref(null)
const currentPage = ref(1)
const perPage = ref(10)
const filters = ref({})
const showOpenFoodFacts = ref(false)

// Catégories disponibles
const categories = [
  'Boissons',
  'Boulangerie',
  'Produits laitiers',
  'Fruits',
  'Confiserie'
]

// Produits filtrés et paginés
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Application des filtres
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.id.toLowerCase().includes(search)
    )
  }

  if (filters.value.category) {
    result = result.filter(product => product.category === filters.value.category)
  }

  if (filters.value.status?.length > 0) {
    result = result.filter(product => filters.value.status.includes(product.status))
  }

  if (filters.value.dateRange?.length === 2) {
    const [start, end] = filters.value.dateRange
    result = result.filter(product => {
      const createdAt = new Date(product.createdAt)
      return createdAt >= start && createdAt <= end
    })
  }

  // Pagination
  const start = (currentPage.value - 1) * perPage.value
  return result.slice(start, start + perPage.value)
})

const totalItems = computed(() => filteredProducts.value.length)

const isManagerOrAdmin = computed(() => {
  const role = 'manager' // TODO: get role from store
  return role === 'manager' || role === 'admin'
})

const isAdmin = computed(() => 'admin' === 'admin') // TODO: get role from store

// Gestionnaires d'événements
const handleFilter = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
}

const handleExport = async ({ type, filters }) => {
  try {
    const dataToExport = products.value.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock
    }))

    if (type === 'pdf') {
      await exportService.exportToPDF(dataToExport, filters)
    } else if (type === 'excel') {
      await exportService.exportToExcel(dataToExport, filters)
    }
  } catch (error) {
    notificationStore.error(`Erreur lors de l'export : ${error.message}`)
  }
}

const openNewProductModal = () => {
  selectedProduct.value = null
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

const handleEdit = (product) => {
  selectedProduct.value = { ...product }
  showProductModal.value = true
}

const handleDelete = async (product) => {
  try {
    // Appel API pour supprimer le produit
    await deleteProduct(product.id)
    products.value = products.value.filter(p => p.id !== product.id)
    notificationStore.success('Produit supprimé avec succès')
  } catch (error) {
    notificationStore.error(`Erreur lors de la suppression : ${error.message}`)
  }
}

const handleSubmit = async (productData) => {
  try {
    if (selectedProduct.value) {
      // Mise à jour d'un produit existant
      await updateProduct(productData)
      const index = products.value.findIndex(p => p.id === productData.id)
      if (index !== -1) {
        products.value[index] = productData
      }
      notificationStore.success('Produit mis à jour avec succès')
    } else {
      try {
        // Création d'un nouveau produit
        const response = await createProduct(productData)
        if (response && response.product) {
          products.value.unshift(response.product)
          notificationStore.success('Produit créé avec succès')
        }
      } catch (error) {
        if (error.response && error.response.status === 409 && error.response.data.product) {
          const existingProduct = error.response.data.product
          const exists = products.value.findIndex(p => p.id === existingProduct.id) !== -1
          if (!exists) {
            products.value.unshift(existingProduct)
          }
          notificationStore.info('Ce produit existe déjà dans la base de données')
        } else {
          throw error
        }
      }
    }
    closeProductModal()
  } catch (error) {
    console.error('Erreur:', error)
    notificationStore.error(`Erreur lors de l'enregistrement : ${error.message}`)
  }
}

const handleProductImported = (product) => {
  products.value.unshift(product);
  showOpenFoodFacts.value = false;
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

const showSuccess = (message) => {
  // Implémenter la notification de succès
}

const showError = (message) => {
  // Implémenter la notification d'erreur
}

// Chargement initial des données
onMounted(async () => {
  try {
    loading.value = true
    const response = await fetchProducts()
    products.value = response || []
  } catch (error) {
    console.error('Erreur:', error)
    notificationStore.error(`Erreur lors du chargement des produits : ${error.message}`)
    products.value = [] // Initialiser avec un tableau vide en cas d'erreur
  } finally {
    loading.value = false
  }
})

// Fonctions API simulées
const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    throw error
  }
}

const createProduct = async (product) => {
  try {
    const response = await axios.post('/api/products', product);
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création du produit');
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    throw error;
  }
};

const updateProduct = (product) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(product)
    }, 500)
  })
}

const deleteProduct = (id) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
</script>
