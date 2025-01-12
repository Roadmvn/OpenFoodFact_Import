<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nom du produit</label>
      <input
        type="text"
        id="name"
        v-model="formData.name"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="brand" class="block text-sm font-medium text-gray-700">Marque</label>
      <input
        type="text"
        id="brand"
        v-model="formData.brand"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
      <select
        id="category"
        v-model="formData.category"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">Sélectionner une catégorie</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div>
      <label for="price" class="block text-sm font-medium text-gray-700">Prix</label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">€</span>
        </div>
        <input
          type="number"
          id="price"
          v-model="formData.price"
          required
          min="0"
          step="0.01"
          class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
      <input
        type="number"
        id="stock"
        v-model="formData.stock"
        required
        min="0"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="barcode" class="block text-sm font-medium text-gray-700">Code-barres</label>
      <div class="flex space-x-2">
        <input
          type="text"
          id="barcode"
          v-model="formData.barcode"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <button
          type="button"
          @click="fetchOpenFoodFacts"
          :disabled="!formData.barcode"
          class="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ loading ? 'Chargement...' : 'Récupérer les infos Open Food Facts' }}
        </button>
      </div>
    </div>

    <!-- Prévisualisation de l'image -->
    <div v-if="formData.imageUrl" class="mt-4">
      <label class="block text-sm font-medium text-gray-700">Image du produit</label>
      <div class="mt-1">
        <img :src="formData.imageUrl" :alt="formData.name" class="h-32 w-32 object-cover rounded-md" />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ product ? 'Modifier' : 'Ajouter' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel', 'error', 'success'])

const categories = [
  'Alimentaire',
  'Boissons',
  'Hygiène',
  'Entretien',
  'Fruits & Légumes',
  'Surgelés'
]

const loading = ref(false)
const formData = ref({
  name: '',
  brand: '',
  category: '',
  price: 0,
  stock: 0,
  barcode: '',
  imageUrl: '',
  status: 'active'
})

onMounted(() => {
  if (props.product) {
    formData.value = { ...props.product }
  }
})

const fetchOpenFoodFacts = async () => {
  if (!formData.value.barcode) return

  loading.value = true
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${formData.value.barcode}.json`)
    const data = response.data
    
    if (data.status === 1) {
      const product = data.product
      formData.value = {
        ...formData.value,
        name: product.product_name || '',
        brand: product.brands || '',
        category: product.categories_tags?.[0] || '',
        imageUrl: product.image_url || product.image_front_url || product.image_thumb_url || '',
        nutriments: product.nutriments || {},
        ingredients: product.ingredients_text || '',
        quantity: product.quantity || '',
        packaging: product.packaging || ''
      }
    } else {
      emit('error', 'Produit non trouvé dans OpenFoodFacts')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    emit('error', 'Erreur lors de la récupération des données OpenFoodFacts')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    const productData = {
      name: formData.value.name,
      brand: formData.value.brand,
      category: formData.value.category,
      price: Number(formData.value.price),
      stock: Number(formData.value.stock),
      barcode: formData.value.barcode,
      imageUrl: formData.value.imageUrl
    }

    const response = await axios.post('/api/products', productData)
    
    if (response.data.success) {
      emit('success', 'Produit créé avec succès')
      emit('submit', response.data.data)
    } else {
      emit('error', response.data.message || 'Erreur lors de la création du produit')
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    emit('error', error.response?.data?.message || 'Erreur lors de la création du produit')
  }
}
</script>
