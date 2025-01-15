<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Centre d'aide SuperMarché
        </h1>
        <p class="text-lg text-gray-600">
          Comment pouvons-nous vous aider aujourd'hui ?
        </p>
      </div>

      <!-- Recherche -->
      <div class="mb-12">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher une aide..."
            class="w-full py-3 px-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div class="absolute left-4 top-3.5 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>

      <!-- Sections d'aide -->
      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <!-- Premiers pas -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="text-purple-600 mb-4">
            <i class="fas fa-rocket text-2xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Premiers pas</h2>
          <ul class="space-y-3 text-gray-600">
            <li>
              <a href="#" class="hover:text-accent">Comment créer un compte ?</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Configuration initiale</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Guide de démarrage rapide</a>
            </li>
          </ul>
        </div>

        <!-- Gestion du compte -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="text-purple-600 mb-4">
            <i class="fas fa-user-cog text-2xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Gestion du compte</h2>
          <ul class="space-y-3 text-gray-600">
            <li>
              <a href="#" class="hover:text-accent">Modifier mon profil</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Changer mon mot de passe</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Paramètres de sécurité</a>
            </li>
          </ul>
        </div>

        <!-- Fonctionnalités -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="text-purple-600 mb-4">
            <i class="fas fa-tools text-2xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Fonctionnalités</h2>
          <ul class="space-y-3 text-gray-600">
            <li>
              <a href="#" class="hover:text-accent">Gestion des produits</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Gestion des stocks</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Rapports et statistiques</a>
            </li>
          </ul>
        </div>

        <!-- Support technique -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="text-purple-600 mb-4">
            <i class="fas fa-headset text-2xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Support technique</h2>
          <ul class="space-y-3 text-gray-600">
            <li>
              <a href="#" class="hover:text-accent">Signaler un problème</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">FAQ technique</a>
            </li>
            <li>
              <a href="#" class="hover:text-accent">Contacter le support</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contact direct -->
      <div class="bg-purple-50 p-6 rounded-lg border border-purple-100">
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Besoin d'aide supplémentaire ?
          </h2>
          <p class="text-gray-600 mb-6">
            Notre équipe de support est disponible 24/7 pour vous aider
          </p>
          <div class="space-x-4">
            <a
              href="mailto:support@supermarche.com"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <i class="fas fa-envelope mr-2"></i>
              Contacter par email
            </a>
            <a
              href="tel:+33123456789"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <i class="fas fa-phone mr-2"></i>
              Appeler le support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SupportView',
  setup() {
    const searchQuery = ref('')

    return {
      searchQuery
    }
  }
}
</script>
