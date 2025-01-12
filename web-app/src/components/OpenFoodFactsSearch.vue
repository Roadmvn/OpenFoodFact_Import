<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Recherche OpenFoodFacts</h2>
    
    <!-- Barre de recherche -->
    <div class="flex gap-2 mb-4">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Entrez un code-barres..."
        class="flex-1 p-2 border rounded"
        @keyup.enter="searchProducts"
      />
      <button 
        @click="searchProducts"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Recherche...</span>
        <span v-else>Rechercher</span>
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <!-- Résultat de la recherche -->
    <div v-if="product" class="border p-4 rounded">
      <div class="flex items-start gap-4">
        <!-- Image du produit -->
        <img 
          :src="product.imageUrl" 
          :alt="product.name"
          class="w-32 h-32 object-cover rounded"
          @error="handleImageError"
        />
        
        <!-- Informations du produit -->
        <div class="flex-1">
          <!-- Mode édition -->
          <div v-if="isEditing" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom du produit</label>
              <input 
                v-model="editedProduct.name"
                type="text"
                class="mt-1 p-2 w-full border rounded"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Prix</label>
              <input 
                v-model="editedProduct.price"
                type="number"
                step="0.01"
                class="mt-1 p-2 w-full border rounded"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input 
                v-model="editedProduct.stock"
                type="number"
                class="mt-1 p-2 w-full border rounded"
              />
            </div>

            <div class="flex gap-2">
              <button 
                @click="saveProduct"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                :disabled="importing"
              >
                <span v-if="importing">Import...</span>
                <span v-else>Valider et Importer</span>
              </button>
              <button 
                @click="cancelEdit"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>

          <!-- Mode affichage -->
          <div v-else>
            <h3 class="text-xl font-semibold">{{ product.name }}</h3>
            <p class="text-gray-600">{{ product.brand }}</p>
            <p class="text-sm text-gray-500">Code-barres: {{ product.barcode }}</p>
            <p v-if="product.categories" class="text-sm text-gray-500">Catégories: {{ product.categories }}</p>
            <p v-if="product.quantity" class="text-sm text-gray-500">Quantité: {{ product.quantity }}</p>
            
            <button 
              @click="startEdit"
              class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Modifier et Importer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div v-else-if="hasSearched" class="text-center py-4 text-gray-600">
      Aucun produit trouvé
    </div>

    <!-- Liste des produits -->
    <div class="mt-8">
      <h3 class="text-xl font-bold mb-4">Liste des produits</h3>
      <div class="grid gap-4">
        <div v-for="product in products" :key="product.id" class="border p-4 rounded flex items-start gap-4">
          <img 
            :src="product.imageUrl" 
            :alt="product.name"
            class="w-24 h-24 object-cover rounded"
            @error="handleImageError"
          />
          <div class="flex-1">
            <h4 class="font-semibold">{{ product.name }}</h4>
            <p class="text-gray-600">{{ product.brand }}</p>
            <p class="text-sm text-gray-500">Code-barres: {{ product.barcode }}</p>
            <div class="mt-2 flex items-center gap-4">
              <span class="text-green-600 font-semibold">{{ product.price }}€</span>
              <span class="text-gray-600">Stock: {{ product.stock }}</span>
              <span 
                :class="{
                  'bg-green-100 text-green-800': product.status === 'actif',
                  'bg-red-100 text-red-800': product.status === 'rupture',
                  'bg-gray-100 text-gray-800': product.status === 'arrete'
                }"
                class="px-2 py-1 rounded-full text-sm"
              >
                {{ product.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OpenFoodFactsSearch',
  
  data() {
    return {
      searchQuery: '',
      product: null,
      products: [],
      isLoading: false,
      importing: false,
      hasSearched: false,
      error: null,
      isEditing: false,
      editedProduct: {
        name: '',
        price: 0,
        stock: 0
      }
    };
  },

  async mounted() {
    await this.loadProducts();
  },

  methods: {
    async searchProducts() {
      if (!this.searchQuery.trim()) {
        this.error = 'Veuillez entrer un code-barres';
        return;
      }

      this.isLoading = true;
      this.hasSearched = true;
      this.error = null;
      this.product = null;
      this.isEditing = false;

      try {
        const barcode = this.searchQuery.trim();
        console.log('Recherche du code-barres:', barcode);
        
        const response = await axios.get(`/api/products/barcode/${barcode}`);
        console.log('Réponse de l\'API:', response.data);
        
        if (response.data.success && response.data.data) {
          this.product = response.data.data;
        } else {
          this.error = 'Aucun produit trouvé';
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        this.error = error.response?.data?.message || 'Erreur lors de la recherche du produit';
      } finally {
        this.isLoading = false;
      }
    },

    startEdit() {
      this.editedProduct = {
        name: this.product.name,
        price: 0,
        stock: 0
      };
      this.isEditing = true;
    },

    cancelEdit() {
      this.isEditing = false;
      this.editedProduct = {
        name: '',
        price: 0,
        stock: 0
      };
    },

    async saveProduct() {
      this.importing = true;
      this.error = null;

      try {
        const productData = {
          ...this.product,
          name: this.editedProduct.name,
          price: parseFloat(this.editedProduct.price),
          stock: parseInt(this.editedProduct.stock)
        };

        const response = await axios.post(`/api/products/import/${this.product.barcode}`, productData);
        
        if (response.data.success) {
          await this.loadProducts();
          this.product = null;
          this.searchQuery = '';
          this.isEditing = false;
        } else {
          this.error = response.data.message || 'Erreur lors de l\'import du produit';
        }
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        this.error = error.response?.data?.message || 'Erreur lors de l\'import du produit';
      } finally {
        this.importing = false;
      }
    },

    async loadProducts() {
      try {
        const response = await axios.get('/api/products');
        if (response.data.success) {
          this.products = response.data.data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    },

    handleImageError(e) {
      e.target.src = '/placeholder-image.png'; // Image par défaut si l'image du produit n'est pas disponible
    }
  }
};
</script>
