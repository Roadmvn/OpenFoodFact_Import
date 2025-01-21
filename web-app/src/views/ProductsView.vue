<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Produits</h1>
        <div class="space-x-4">
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

    <!-- Modal d'ajout/modification de produit -->
    <ProductForm
      v-if="showProductModal"
      :product="selectedProduct"
      @submit="handleSubmit"
      @cancel="closeProductModal"
    />

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
               class="bg-white rounded-lg shadow overflow-hidden product-card">
            <img 
              :src="product.imageUrl || '/placeholder-product.png'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4 product-info">
              <h3 class="text-xl font-semibold">{{ product.name }}</h3>
              <p class="text-gray-600 brand">{{ product.brand }}</p>
              <p class="text-gray-600 category">{{ product.category }}</p>
              <div class="details">
                <span class="price">Prix: {{ formatPrice(product.price) }} €</span>
                <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
                  Stock: {{ product.stock }} unités
                </span>
              </div>
            </div>
            <div class="product-actions">
              <button 
                v-if="isManagerOrAdmin"
                @click="handleEdit(product)"
                class="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 btn btn-edit"
              >
                Modifier
              </button>
              <button 
                v-if="isManagerOrAdmin"
                @click="updateStock(product)"
                class="bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 btn btn-stock"
              >
                Stock
              </button>
              <button 
                v-if="isAdmin"
                @click="handleDelete(product)"
                class="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 btn btn-delete"
              >
                Supprimer
              </button>
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
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import AdvancedFilters from '../components/AdvancedFilters.vue'
import ProductForm from '../components/ProductForm.vue'
import TablePagination from '../components/TablePagination.vue'

export default {
  name: 'ProductsView',
  components: {
    AdvancedFilters,
    ProductForm,
    TablePagination
  },
  setup() {
    const products = ref([
      {
        id: 1,
        name: 'Ordinateur portable Pro',
        category: 'Électronique',
        brand: 'TechBrand',
        price: 1299.00,
        stock: 125,
        imageUrl: '/laptop.jpg'
      },
      {
        id: 2,
        name: 'Smartphone X',
        category: 'Électronique',
        brand: 'PhoneBrand',
        price: 899.00,
        stock: 98,
        imageUrl: '/phone.jpg'
      },
      {
        id: 3,
        name: 'Casque sans fil',
        category: 'Accessoires',
        brand: 'AudioBrand',
        price: 199.00,
        stock: 78,
        imageUrl: '/headphones.jpg'
      },
      {
        id: 4,
        name: 'Tablette Air',
        category: 'Électronique',
        brand: 'TechBrand',
        price: 649.00,
        stock: 65,
        imageUrl: '/tablet.jpg'
      }
    ])

    const loading = ref(false)
    const filters = ref({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null
    })

    const categories = computed(() => {
      const uniqueCategories = new Set(products.value.map(p => p.category))
      return Array.from(uniqueCategories)
    })

    const filteredProducts = computed(() => {
      let result = products.value

      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        result = result.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
        )
      }

      if (filters.value.category) {
        result = result.filter(p => p.category === filters.value.category)
      }

      if (filters.value.minPrice) {
        result = result.filter(p => p.price >= filters.value.minPrice)
      }

      if (filters.value.maxPrice) {
        result = result.filter(p => p.price <= filters.value.maxPrice)
      }

      return result
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }

    const isManagerOrAdmin = computed(() => {
      const role = 'manager' // TODO: get role from store
      return role === 'manager' || role === 'admin'
    })

    const isAdmin = computed(() => 'admin' === 'admin') // TODO: get role from store

    const showProductModal = ref(false)
    const selectedProduct = ref(null)
    const currentPage = ref(1)
    const perPage = ref(10)
    const totalItems = computed(() => filteredProducts.value.length)

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
          // await exportService.exportToPDF(dataToExport, filters)
        } else if (type === 'excel') {
          // await exportService.exportToExcel(dataToExport, filters)
        }
      } catch (error) {
        console.error('Erreur lors de l\'export :', error)
      }
    }

    const openNewProductModal = () => {
      selectedProduct.value = null;
      showProductModal.value = true;
    };

    const handleProductImported = (product) => {
      products.value.unshift(product);
      // notificationStore.success('Produit importé avec succès');
    };

    const closeProductModal = () => {
      showProductModal.value = false;
      selectedProduct.value = null;
    };

    const handleEdit = (product) => {
      selectedProduct.value = product;
      showProductModal.value = true;
    };

    const handleSubmit = async (productData) => {
      try {
        if (selectedProduct.value) {
          // Mise à jour d'un produit existant
          const updatedData = {
            id: selectedProduct.value.id,
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: Number(productData.price),
            stock: Number(productData.stock)
          };

          console.log('Données envoyées pour mise à jour:', updatedData);
          
          // await axios.put(`/api/products/${selectedProduct.value.id}`, updatedData);
          
          // if (response.data && response.data.product) {
          //   const index = products.value.findIndex(p => p.id === selectedProduct.value.id);
          //   if (index !== -1) {
          //     products.value[index] = response.data.product;
          //     // notificationStore.success('Produit mis à jour avec succès');
          //   }
          // }
          showProductModal.value = false;
        } else {
          // Création d'un nouveau produit
          const newProduct = {
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: Number(productData.price),
            stock: Number(productData.stock)
          };

          console.log('Données envoyées pour création:', newProduct);

          // try {
          //   const response = await axios.post('/api/products', newProduct);
            
          //   if (response.data && response.data.product) {
          //     // Vérifier si le produit n'existe pas déjà dans la liste
          //     const existingIndex = products.value.findIndex(p => p.id === response.data.product.id);
          //     if (existingIndex === -1) {
          //       products.value.unshift(response.data.product);
          //     }
          //     // notificationStore.success('Produit créé avec succès');
          //     showProductModal.value = false;
          //   }
          // } catch (error) {
          //   if (error.response && error.response.status === 409 && error.response.data.product) {
          //     // Le produit existe déjà
          //     const existingProduct = error.response.data.product;
          //     const existingIndex = products.value.findIndex(p => p.id === existingProduct.id);
              
          //     if (existingIndex === -1) {
          //       // Si le produit n'est pas dans la liste, l'ajouter
          //       products.value.unshift(existingProduct);
          //     } else {
          //       // Si le produit est déjà dans la liste, le mettre à jour
          //       products.value[existingIndex] = existingProduct;
          //     }
              
          //     // notificationStore.info('Ce produit existe déjà dans la base de données');
          //     showProductModal.value = false;
          //   } else {
          //     throw error;
          //   }
          // }
        }
      } catch (error) {
        console.error('Erreur:', error);
        // notificationStore.error(`Erreur lors de l'enregistrement : ${error.response?.data?.message || error.message}`);
      }
    };

    const handleDelete = async (product) => {
      try {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
          // await deleteProduct(product.id);
          products.value = products.value.filter(p => p.id !== product.id);
          // notificationStore.success('Produit supprimé avec succès');
        }
      } catch (error) {
        // notificationStore.error(`Erreur lors de la suppression : ${error.response?.data?.message || error.message}`);
      }
    };

    return {
      products,
      loading,
      filters,
      categories,
      filteredProducts,
      formatPrice,
      isManagerOrAdmin,
      isAdmin,
      showProductModal,
      selectedProduct,
      currentPage,
      perPage,
      totalItems,
      handleFilter,
      handleExport,
      openNewProductModal,
      handleProductImported,
      closeProductModal,
      handleEdit,
      handleSubmit,
      handleDelete
    }
  }
}
</script>

<style scoped>
.product-card {
  @apply transition-all duration-200;
}

.product-card:hover {
  @apply transform scale-[1.02] shadow-lg;
}

.product-info {
  @apply space-y-2;
}

.details {
  @apply flex justify-between items-center mt-4;
}

.price {
  @apply font-semibold text-purple-600;
}

.stock {
  @apply text-sm text-gray-600;
}

.low-stock {
  @apply text-red-500;
}

.product-actions {
  @apply p-4 bg-gray-50 flex justify-end space-x-2;
}

.btn {
  @apply text-sm font-medium transition-colors duration-200;
}
</style>
