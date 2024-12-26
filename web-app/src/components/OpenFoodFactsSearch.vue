<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Recherche OpenFoodFacts</h2>
    
    <!-- Barre de recherche -->
    <div class="flex gap-2 mb-4">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un produit..."
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

    <!-- Résultats de recherche -->
    <div v-if="searchResults.length > 0" class="space-y-4">
      <div v-for="product in searchResults" :key="product.barcode" 
           class="border p-4 rounded flex items-center gap-4">
        <img 
          :src="product.imageUrl" 
          :alt="product.name"
          class="w-16 h-16 object-cover rounded"
          @error="handleImageError"
        />
        <div class="flex-1">
          <h3 class="font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.brand }}</p>
          <p class="text-sm text-gray-500">Code-barres: {{ product.barcode }}</p>
        </div>
        <button 
          @click="importProduct(product.barcode)"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          :disabled="importing === product.barcode"
        >
          <span v-if="importing === product.barcode">Import...</span>
          <span v-else>Importer</span>
        </button>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div v-else-if="hasSearched" class="text-center py-4 text-gray-600">
      Aucun produit trouvé
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-4">
      <button 
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded"
      >
        Précédent
      </button>
      <span class="px-3 py-1">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
      <button 
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded"
      >
        Suivant
      </button>
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
      searchResults: [],
      isLoading: false,
      importing: null,
      hasSearched: false,
      currentPage: 1,
      totalPages: 0,
      pageSize: 20
    };
  },
  methods: {
    async searchProducts() {
      if (!this.searchQuery.trim()) return;

      this.isLoading = true;
      this.hasSearched = true;

      try {
        const response = await axios.get('/api/products/openfoodfacts/search', {
          params: {
            query: this.searchQuery,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });

        this.searchResults = response.data.products;
        this.totalPages = Math.ceil(response.data.total / this.pageSize);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        this.$emit('error', 'Erreur lors de la recherche des produits');
      } finally {
        this.isLoading = false;
      }
    },

    async importProduct(barcode) {
      this.importing = barcode;

      try {
        const response = await axios.post(`/api/products/openfoodfacts/import/${barcode}`, {
          storeId: this.$store.state.user.storeId
        });

        this.$emit('product-imported', response.data);
        this.$emit('success', 'Produit importé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        this.$emit('error', 'Erreur lors de l\'import du produit');
      } finally {
        this.importing = null;
      }
    },

    async changePage(page) {
      this.currentPage = page;
      await this.searchProducts();
    },

    handleImageError(e) {
      e.target.src = '/placeholder-product.png'; // Image par défaut
    }
  }
};
</script>
