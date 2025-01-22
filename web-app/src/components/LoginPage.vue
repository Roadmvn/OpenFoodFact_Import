<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-primary">Connexion</h2>
      <form>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Nom d'utilisateur
          </label>
          <input class="input" id="username" type="text" placeholder="Nom d'utilisateur">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input class="input" id="password" type="password" placeholder="Mot de passe">
        </div>
        <div class="flex items-center justify-between">
          <button class="button" type="button">
            Se connecter
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
};
</script>

<style scoped>
.input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary;
}
</style>
