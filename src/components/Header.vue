<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">

      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <SprayCan class="w-6 h-6 text-purple-600"></SprayCan>
        <h1 class="text-xl font-bold text-gray-800">Élégance Parfumée</h1>
      </div>

      <!-- Navigation desktop -->
      <nav class="hidden md:flex space-x-8 items-center">
        <RouterLink to="/" class="flex items-center text-gray-700 hover:text-purple-600 font-semibold">
          <Home class="w-4 h-4 mr-1"></Home>Accueil
        </RouterLink>
        <RouterLink to="/homme" class="flex items-center text-gray-700 hover:text-purple-600">
          <Mars class="w-4 h-4 mr-1"></Mars>Homme
        </RouterLink>
        <RouterLink to="/femme" class="flex items-center text-gray-700 hover:text-purple-600">
          <Venus class="w-4 h-4 mr-1"></Venus>Femme
        </RouterLink>
        <RouterLink to="/collections" class="flex items-center text-gray-700 hover:text-purple-600">
          <Grid class="w-4 h-4 mr-1"></Grid>Collections
        </RouterLink>
        <RouterLink to="/apropos" class="flex items-center text-gray-700 hover:text-purple-600">
          <Info class="w-4 h-4 mr-1"></Info>À propos
        </RouterLink>

        <!-- Liens si connecté -->
        <template v-if="estConnecte">
          <RouterLink to="/profil" class="flex items-center text-gray-700 hover:text-purple-600">
            <User class="w-4 h-4 mr-1"></User>Profil
          </RouterLink>
          <RouterLink to="/historique" class="flex items-center text-gray-700 hover:text-purple-600">
            <Clock class="w-4 h-4 mr-1"></Clock>Historique
          </RouterLink>
          <button @click="seDeconnecter" class="flex items-center text-gray-700 hover:text-red-600">
            <LogOut class="w-4 h-4 mr-1"></LogOut>Déconnexion
          </button>
        </template>

        <!-- Lien si non connecté -->
        <template v-else>
          <RouterLink to="/login" class="flex items-center text-gray-700 hover:text-purple-600">
            <LogIn class="w-4 h-4 mr-1"></LogIn>Connexion
          </RouterLink>
        </template>
      </nav>

      <!-- Icônes à droite -->
      <div class="flex items-center space-x-4">

        <!-- Infos utilisateur connecté -->
        <div v-if="estConnecte" class="hidden md:flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
          <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">{{ initiales }}</span>
          </div>
          <span class="text-sm font-medium text-purple-700">{{ nomUtilisateur }}</span>
        </div>

        <!-- Bouton panier -->
        <button @click="$emit('ouvrir-panier')" class="relative text-gray-600 hover:text-purple-600">
          <ShoppingCart class="w-5 h-5 mr-1"></ShoppingCart>
          <span
            class="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartCount }}
          </span>
        </button>

        <!-- Bouton menu mobile -->
        <button @click="toggleMenu()" class="md:hidden text-gray-600">
          <Menu class="w-5 h-5"></Menu>
        </button>

      </div>

    </div>

    <!-- Menu mobile -->
    <div v-if="menuOuvert" class="md:hidden bg-white py-2 px-4 shadow-md space-y-2">
      <RouterLink to="/" class="flex items-center text-gray-700 hover:text-purple-600 font-semibold">
        <Home class="w-4 h-4 mr-1"></Home>Accueil
      </RouterLink>
      <RouterLink to="/homme" class="flex items-center text-gray-700 hover:text-purple-600">
        <Mars class="w-4 h-4 mr-1"></Mars>Homme
      </RouterLink>
      <RouterLink to="/femme" class="flex items-center text-gray-700 hover:text-purple-600">
        <Venus class="w-4 h-4 mr-1"></Venus>Femme
      </RouterLink>
      <RouterLink to="/collections" class="flex items-center text-gray-700 hover:text-purple-600">
        <Grid class="w-4 h-4 mr-1"></Grid>Collections
      </RouterLink>
      <RouterLink to="/apropos" class="flex items-center text-gray-700 hover:text-purple-600">
        <Info class="w-4 h-4 mr-1"></Info>À propos
      </RouterLink>

      <!-- Liens si connecté -->
      <template v-if="estConnecte">
        <RouterLink to="/profil" class="flex items-center text-gray-700 hover:text-purple-600">
          <User class="w-4 h-4 mr-1"></User>Profil
        </RouterLink>
        <RouterLink to="/historique" class="flex items-center text-gray-700 hover:text-purple-600">
          <Clock class="w-4 h-4 mr-1"></Clock>Historique
        </RouterLink>
        <button @click="seDeconnecter" class="flex items-center text-gray-700 hover:text-red-600">
          <LogOut class="w-4 h-4 mr-1"></LogOut>Déconnexion
        </button>
      </template>

      <!-- Lien si non connecté -->
      <template v-else>
        <RouterLink to="/login" class="flex items-center text-gray-700 hover:text-purple-600">
          <LogIn class="w-4 h-4 mr-1"></LogIn>Connexion
        </RouterLink>
      </template>


    </div>

  </header>
</template>

<script>
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { Home, User, ShoppingCart, Info, Menu, LogOut, LogIn, Mars, Venus, Grid, Clock, SprayCan } from 'lucide-vue-next'

export default {
  name: 'Header',
  components: {
    Home, User, ShoppingCart, Info, Menu, LogOut, LogIn,
    Mars, Venus, Grid, Clock, SprayCan
  },
  emits: ['ouvrir-panier'],
  data() {
    return {
      menuOuvert: false
    }
  },
  computed: {
    cartCount() {
      return useCartStore().totalItems
    },
    estConnecte() {
      return useAuthStore().estConnecte
    },
    nomUtilisateur() {
      const user = useAuthStore().user
      return user?.nom || user?.prenoms || 'Utilisateur'
    },
    initiales() {
      const user = useAuthStore().user
      if (!user) return '?'
      const nom = user.nom?.charAt(0) || ''
      const prenom = user.prenoms?.charAt(0) || ''
      return (nom + prenom).toUpperCase() || '?'
    }
  },
  methods: {
    toggleMenu() {
      this.menuOuvert = !this.menuOuvert
    },
    seDeconnecter() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        useAuthStore().deconnexion()
        this.$router.push('/')
      }
    }
  },

}
</script>
