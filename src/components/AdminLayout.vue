<template>
  <div class="min-h-screen bg-gray-100 flex">

    <!-- Sidebar -->
    <aside :class="sidebarOuvert ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <SprayCan class="w-6 h-6 text-purple-400" />
          <div>
            <h1 class="font-bold text-lg">Élégance</h1>
            <p class="text-xs text-purple-400">Panel Admin</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="sidebarOuvert = false"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition" :class="$route.path === item.path
            ? 'bg-purple-600 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <component :is="item.icone" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Bas sidebar -->
      <div class="p-4 border-t border-gray-700">
        <RouterLink to="/"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
          <Store class="w-5 h-5" />
          <span>Voir la boutique</span>
        </RouterLink>
        <button @click="seDeconnecter"
          class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition mt-1">
          <LogOut class="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="sidebarOuvert" @click="sidebarOuvert = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Header -->
      <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <button @click="sidebarOuvert = !sidebarOuvert" class="md:hidden text-gray-600 hover:text-purple-600">
          <Menu class="w-6 h-6" />
        </button>

        <h2 class="text-lg font-bold text-gray-800">{{ titreActuel }}</h2>

        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-bold">{{ initiales }}</span>
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-800">{{ authStore.user?.nom }}</p>
            <p class="text-xs text-purple-600">Administrateur</p>
          </div>
        </div>
      </header>

      <!-- Contenu de la page -->
      <main class="flex-1 p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import {
  SprayCan, LayoutDashboard, ShoppingBag,
  Users, Store, LogOut, Menu, Droplets,
  Tag, ShieldCheck, BarChart2, Settings,Megaphone   // ← nouveaux
} from 'lucide-vue-next'

export default {
  name: 'AdminLayout',
  components: {
    SprayCan,
    LayoutDashboard,
    ShoppingBag,
    Users,
    Store,
    LogOut,
    Menu,
    Droplets,
    Tag,
    ShieldCheck,
    BarChart2,
    Settings,
    Megaphone
  },
  data() {
    return {
      sidebarOuvert: false,
      menuItems: [
        { path: '/admin', label: 'Dashboard', icone: 'LayoutDashboard' },
        { path: '/admin/produits', label: 'Produits', icone: 'Droplets' },
        { path: '/admin/categories', label: 'Catégories', icone: 'Tag' },
        { path: '/admin/commandes', label: 'Commandes', icone: 'ShoppingBag' },
        { path: '/admin/utilisateurs', label: 'Utilisateurs', icone: 'Users' },
        { path: '/admin/administrateurs', label: 'Administrateurs', icone: 'ShieldCheck' },
        { path: '/admin/statistiques', label: 'Statistiques', icone: 'BarChart2' },
        { path: '/admin/publicites', label: 'Publicités', icone: 'Megaphone' },
        { path: '/admin/parametres', label: 'Paramètres', icone: 'Settings' }
      ]
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    initiales() {
      const user = this.authStore.user
      if (!user) return '?'
      return ((user.nom?.charAt(0) || '') + (user.prenoms?.charAt(0) || '')).toUpperCase()
    },
    titreActuel() {
      const titres = {
        '/admin': 'Dashboard',
        '/admin/produits': 'Gestion des produits',
        '/admin/categories': 'Gestion des catégories',
        '/admin/commandes': 'Gestion des commandes',
        '/admin/utilisateurs': 'Gestion des utilisateurs',
        '/admin/administrateurs': 'Administrateurs',
        '/admin/statistiques': 'Statistiques',
        '/admin/publicites': 'Gestion des publicités',
        '/admin/parametres': 'Paramètres'
      }
      return titres[this.$route.path] || 'Admin'
    }
  },
  methods: {
    seDeconnecter() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.authStore.deconnexion()
        this.$router.push('/login')
      }
    }
  }
}
</script>
