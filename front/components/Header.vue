<template>
  <header class="bg-white shadow-md p-4">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="text-lg font-bold text-gray-700">
        <a href="/" class="hover:text-blue-500">Trinity</a>
      </div>

      <!-- 搜索条 -->
      <div class="relative w-full max-w-lg mx-4">
        <input
            v-model="searchQuery"
            @input="searchProducts"
            type="text"
            placeholder="Rechercher des produits..."
            class="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- 下拉菜单显示搜索结果 -->
        <div v-if="searchResults.length > 0" class="absolute bg-white border border-gray-300 w-full mt-2 rounded-md shadow-lg z-50">
          <ul>
            <li
                v-for="result in searchResults"
                :key="result.id"
                class="flex items-center p-2 hover:bg-blue-50 cursor-pointer"
                @click="goToProduct(result.id)"
            >
              <img
                  :src="result.product.image_url || 'https://via.placeholder.com/50'"
                  alt="product image"
                  class="w-12 h-12 object-cover rounded-md mr-4"
              />
              <div>
                <p class="font-medium text-gray-700">{{ result.product.name }}</p>
                <p class="text-sm text-gray-500">Prix: {{ result.price }}€</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 导航菜单 (桌面端) -->
      <el-menu
          mode="horizontal"
          :ellipsis="false"
      >
        <el-menu-item index="1"><a href="/about">Qui somme nous</a></el-menu-item>
        <el-menu-item index="1"><a href="/nos-products">Nous Produits</a></el-menu-item>
        <el-menu-item index="1"><a href="/new-products">Nouveaux produits</a></el-menu-item>
        <el-menu-item index="1"><a href="/products/search">Recherche précise</a></el-menu-item>
        <el-menu-item index="1" v-if="!user"><a href="/login">Se connecter</a></el-menu-item>
        <el-sub-menu index="2" v-if="user?.role === 'buyer'">
          <template #title>{{ user.email }}</template>
          <el-menu-item index="2-1" @click="go_route('/user/profile')">Profile</el-menu-item>
          <el-menu-item index="2-2" @click="go_route('/commandes')">Commandes</el-menu-item>
          <el-menu-item index="2-3" @click="go_route('/factures')">Factures</el-menu-item>
          <el-menu-item index="2-4">
            <a href="/user/messages">Messages</a>
          </el-menu-item>
          <el-menu-item index="2-4" @click="logout()" v-if="user">Se déconnecter</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2-5" @click="drawer = true" v-if="user?.role === 'buyer'">
          <el-icon>
            <el-badge :value="cartItemCount"><ShoppingBag /></el-badge>
          </el-icon>
        </el-menu-item>
        <el-sub-menu index="2" v-if="user?.role === 'admin' || user?.role === 'seller'">
          <template #title>{{ user?.email }}</template>
          <el-menu-item index="2-1" @click="go_route('/admin')" v-if="user?.role === 'admin'">Tableau de bord</el-menu-item>
          <el-menu-item index="2-1" @click="go_route('/seller')" v-if="user?.role === 'seller'">Ma boutique</el-menu-item>
          <el-menu-item index="2-4" @click="logout()" v-if="user">Se déconnecter</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <!-- 移动端菜单按钮 -->
      <button
          @click="toggleMenu"
          class="block md:hidden text-gray-700 hover:text-blue-500 focus:outline-none"
      >
        <i class="el-icon-menu"></i>
      </button>

      <!-- 移动端菜单 -->
      <el-menu
          v-if="showMenu"
          class="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden"
          mode="vertical"
          background-color="#ffffff"
          text-color="#4b5563"
          active-text-color="#3b82f6"
      >
        <el-menu-item index="/about">
          <a href="/about" class="block hover:text-blue-500">À propos</a>
        </el-menu-item>
        <el-menu-item v-if="!user" index="/login">
          <a href="/login" class="block hover:text-blue-500">Connexion</a>
        </el-menu-item>
        <el-sub-menu v-else :index="'mobile-user-menu'">
          <template #title>
            <div class="flex items-center space-x-2">
              <i class="el-icon-user text-blue-500"></i>
              <span>{{ user.email }}</span>
            </div>
          </template>
          <el-menu-item index="/profile">
            <a href="/profile">Profil</a>
          </el-menu-item>
          <el-menu-item index="/orders">
            <a href="/orders">Commandes</a>
          </el-menu-item>
          <el-menu-item index="/invoices">
            <a href="/invoices">Factures</a>
          </el-menu-item>
          <el-menu-item index="/messages">
            <a href="/user/messages">Messages</a>
          </el-menu-item>
          <el-menu-item index="/logout" @click="logout" v-if="user">
            Déconnexion
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </header>
  <el-drawer title="Panier" v-model="drawer" direction="rtl">
    <div class="flex flex-col gap-4">
      <!-- Drawer cart content remains unchanged -->
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $axios } = useNuxtApp();
import { ShoppingBag, Shop } from '@element-plus/icons-vue';
import { useCartStore } from "~/stores/cartStore";

const user = useUserStore().user;

const cartStore = useCartStore();

// 搜索功能相关变量
const searchQuery = ref('');
const searchResults = ref([]);

// 搜索功能
const searchProducts = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await $axios.get('/api/internal-products/products_search', {
      params: { name: searchQuery.value },
    });
    searchResults.value = response.data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche des produits:', error);
  }
};

const goToProduct = (id: number) => {
  window.location.href = `/products/${id}`;
};

// 其他功能相关变量和方法
const drawer = ref(false);
const cartItemCount = computed(() => cartStore.cartTotalQuantity);
const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const go_route = (path) => {
  window.location.href = path;
}

const logout = () => {
  const userStores = useUserStore();
  userStores.logout();
  window.location.href = '/';
};

const to_route = (path) => {
  window.location.href = path;
}

const payer = () => {
  cartStore.payer();
  window.location.href = '/commandes';
}

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}

.el-menu {
  width: 50%;
}

.el-menu--horizontal {
  flex-direction: row;
  justify-content: end;
}
</style>