<template>
  <header class="bg-white shadow-md p-4">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="text-lg font-bold text-gray-700">
        <a href="/" class="hover:text-blue-500">Trinity</a>
      </div>

      <!-- 导航菜单 (桌面端) -->

      <el-menu
          mode="horizontal"
          :ellipsis="false"
      >
        <el-menu-item index="1"><a href="/about">Qui somme nous</a></el-menu-item>
        <el-menu-item index="1"><a href="/products">Nous Produits</a></el-menu-item>
        <el-menu-item index="1"><a href="/products/new-product">Nouveaux produits</a></el-menu-item>
        <el-menu-item index="1" v-if="!user"><a href="/login">Se connecter</a></el-menu-item>
        <el-sub-menu index="2" v-if="user?.role === 'buyer'">
          <template #title>{{ user.email }}</template>
          <el-menu-item index="2-1" @click="go_route('/user/profile')">Profile</el-menu-item>
          <el-menu-item index="2-2" @click="go_route('/commandes')">Commandes</el-menu-item>
          <el-menu-item index="2-3" @click="go_route('/factures')">Factures</el-menu-item>
          <el-menu-item index="2-4" @click="logout()"  v-if="user">Se déconnecter</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2-5" @click="drawer = true"  v-if="user?.role === 'buyer'">
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
          <el-menu-item index="/logout" @click="logout"  v-if="user">
            Déconnexion
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </header>
  <el-drawer title="Panier" v-model="drawer" direction="rtl">
    <div class="flex flex-col gap-4">
      <el-card v-for="item in cartStore.items" :key="item.id">
        <div style="display: flex; justify-content: center; align-items: center; max-height: 200px; max-width: 100%; overflow: hidden;">
          <img
              :src="item.image"
              alt="product-image"
              style="max-height: 100%; max-width: 100%; object-fit: contain;" />
        </div>
        <div class="flex flex-col gap-2">
          <el-text style="width: 100%;" tag="b">{{ item.name }}</el-text>
          <el-text style="width: 100%;">Qte: {{ item.quantity }}</el-text>
          <el-tag type="danger" class="mt-2 mb-2 w-30" size="large">
            <el-text tag="b" type="danger">TTC: {{ item.total }} €</el-text>
          </el-tag>
        </div>
        <div class="flex flex-row justify-between gap-2">
          <div class="flex flex-row gap-2">
            <el-button type="success" @click="cartStore.updateCartItem(item.id, item.quantity + 1)">+</el-button>
            <el-button type="success" @click="cartStore.updateCartItem(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</el-button>
          </div>
          <el-button type="danger" @click="cartStore.removeCartItem(item.id)">Delete</el-button>
        </div>
      </el-card>

      <div class="cart-footer flex flex-row justify-between items-center">
        <div class="flex flex-col space-y-2 gap-4" v-if="cartStore.totalQuantity === 0">
          <el-icon size="50" color="#3393ff"><Shop /></el-icon>
          <el-text tag="b" style="font-size: 1.2rem">
            Vous n'avez pas trouvé le produit que vous recherchiez ?
          </el-text>
          <el-button type="primary" size="large" @click="to_route('/products')">Trouver des produits</el-button>
        </div>
        <div class="flex flex-col space-y-2 gap-4" style="width: 100%;">
          <el-tag type="success" size="large" v-if="cartStore.totalQuantity > 0">
            <el-text type="success" style="font-size: 1rem;">Total TTC: {{ cartStore.cartTotalPrice }}€</el-text>
          </el-tag>
          <div class="flex flex-row justify-between">
            <el-button type="danger" @click="cartStore.clearCart()" v-if="cartStore.totalQuantity > 0">Vider le panier</el-button>
            <el-button type="success" @click="payer()">Payer</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingBag, Shop } from '@element-plus/icons-vue';
import { useCartStore } from "~/stores/cartStore";

const user = useUserStore().user;

const cartStore = useCartStore();

// 路由路径，用于高亮菜单项
const router = useRouter();
const currentPath = ref('/');

const drawer = ref(false);

const cartItemCount = computed(() => cartStore.cartTotalQuantity);

// 获取当前路由，用于默认高亮
onMounted(async () => {
  currentPath.value = router.currentRoute.value.path;
  await cartStore.fetchCart();
});

// 控制移动端菜单是否显示
const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const go_route = (path) => {
  window.location.href = path;
}

// 退出登录方法
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
}

</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}

.el-menu{
  width: 50%;
}

.el-menu--horizontal{
  flex-direction: row;
  justify-content: end;
}
</style>