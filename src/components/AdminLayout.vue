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
          <!-- Badge commandes -->
          <span v-if="item.path === '/admin/commandes' && nouvellesCommandes > 0"
            class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {{ nouvellesCommandes }}
          </span>
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

        <div class="flex items-center space-x-4">

          <!-- 🔔 Cloche notifications -->
          <div class="relative">
            <button
              @click="notifOuvert = !notifOuvert"
              class="relative text-gray-600 hover:text-purple-600 transition"
            >
              <Bell class="w-6 h-6" />
              <span v-if="nouvellesCommandes > 0"
                class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {{ nouvellesCommandes > 9 ? '9+' : nouvellesCommandes }}
              </span>
            </button>

            <!-- Dropdown notifications -->
            <div v-if="notifOuvert"
              class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">

              <!-- Header dropdown -->
              <div class="flex items-center justify-between px-4 py-3 border-b">
                <h3 class="font-bold text-gray-800 flex items-center gap-2">
                  <Bell class="w-4 h-4 text-purple-600" />
                  Notifications
                </h3>
                <button
                  v-if="nouvellesCommandes > 0"
                  @click="toutMarquerLu"
                  class="text-xs text-purple-600 hover:text-purple-800"
                >
                  Tout marquer lu
                </button>
              </div>

              <!-- Chargement -->
              <div v-if="chargementNotif" class="text-center py-6">
                <Loader class="w-6 h-6 animate-spin text-purple-600 mx-auto" />
              </div>

              <!-- Aucune notification -->
              <div v-else-if="dernieresCommandes.length === 0" class="text-center py-8 text-gray-400">
                <BellOff class="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p class="text-sm">Aucune nouvelle commande</p>
              </div>

              <!-- Liste notifications -->
              <div v-else class="max-h-72 overflow-y-auto divide-y divide-gray-50">
                <div
                  v-for="commande in dernieresCommandes"
                  :key="commande.id"
                  @click="allerVersCommande(commande.id)"
                  class="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer transition"
                  :class="!commande.lue ? 'bg-purple-50' : ''"
                >
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShoppingBag class="w-4 h-4 text-purple-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800">
                      Commande #{{ commande.id }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ commande.customerInfo?.nom || commande.user?.nom || 'Client' }} —
                      {{ (commande.total || 0).toLocaleString('fr-FR') }} FCFA
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ formatDate(commande.createdAt) }}
                    </p>
                  </div>
                  <span v-if="!commande.lue"
                    class="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2">
                  </span>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t px-4 py-3">
                <RouterLink
                  to="/admin/commandes"
                  @click="notifOuvert = false"
                  class="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-1"
                >
                  Voir toutes les commandes
                  <ChevronRight class="w-4 h-4" />
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Avatar admin -->
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">{{ initiales }}</span>
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-gray-800">{{ authStore.user?.nom }}</p>
              <p class="text-xs text-purple-600">Administrateur</p>
            </div>
          </div>

        </div>
      </header>

      <!-- Contenu de la page -->
      <main class="flex-1 p-6">
        <slot />
      </main>

    </div>

    <!-- Overlay fermer notif en cliquant ailleurs -->
    <div v-if="notifOuvert" @click="notifOuvert = false" class="fixed inset-0 z-40"></div>

  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import {
  SprayCan, LayoutDashboard, ShoppingBag,
  Users, Store, LogOut, Menu, Droplets,
  Tag, ShieldCheck, BarChart2, Settings, Megaphone,
  Bell, BellOff, Loader, ChevronRight
} from 'lucide-vue-next'

export default {
  name: 'AdminLayout',
  components: {
    SprayCan, LayoutDashboard, ShoppingBag,
    Users, Store, LogOut, Menu, Droplets,
    Tag, ShieldCheck, BarChart2, Settings, Megaphone,
    Bell, BellOff, Loader, ChevronRight
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      sidebarOuvert: false,
      notifOuvert: false,
      chargementNotif: false,
      dernieresCommandes: [],
      intervalNotif: null,
      menuItems: [
        { path: '/admin',                label: 'Dashboard',      icone: 'LayoutDashboard' },
        { path: '/admin/produits',       label: 'Produits',       icone: 'Droplets'        },
        { path: '/admin/categories',     label: 'Catégories',     icone: 'Tag'             },
        { path: '/admin/commandes',      label: 'Commandes',      icone: 'ShoppingBag'     },
        { path: '/admin/utilisateurs',   label: 'Utilisateurs',   icone: 'Users'           },
        { path: '/admin/administrateurs',label: 'Administrateurs',icone: 'ShieldCheck'     },
        { path: '/admin/statistiques',   label: 'Statistiques',   icone: 'BarChart2'       },
        { path: '/admin/publicites',     label: 'Publicités',     icone: 'Megaphone'       },
        { path: '/admin/parametres',     label: 'Paramètres',     icone: 'Settings'        }
      ]
    }
  },
  computed: {
    initiales() {
      const user = this.authStore.user
      if (!user) return '?'
      return ((user.nom?.charAt(0) || '') + (user.prenoms?.charAt(0) || '')).toUpperCase()
    },
    titreActuel() {
      const titres = {
        '/admin':                 'Dashboard',
        '/admin/produits':        'Gestion des produits',
        '/admin/categories':      'Gestion des catégories',
        '/admin/commandes':       'Gestion des commandes',
        '/admin/utilisateurs':    'Gestion des utilisateurs',
        '/admin/administrateurs': 'Administrateurs',
        '/admin/statistiques':    'Statistiques',
        '/admin/publicites':      'Gestion des publicités',
        '/admin/parametres':      'Paramètres'
      }
      return titres[this.$route.path] || 'Admin'
    },
    nouvellesCommandes() {
      return this.dernieresCommandes.filter(c => !c.lue).length
    }
  },
  async mounted() {
    await this.chargerNotifications()
    // Rafraîchissement toutes les 60 secondes
    this.intervalNotif = setInterval(this.chargerNotifications, 60000)
  },
  beforeUnmount() {
    clearInterval(this.intervalNotif)
  },
  methods: {
    async chargerNotifications() {
      this.chargementNotif = true
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/orders/get_orders',
          { headers: { 'Authorization': `Bearer ${this.authStore.token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          const commandes = Array.isArray(data) ? data : data.orders || []

          // Récupère les IDs déjà lus depuis localStorage
          const lues = JSON.parse(localStorage.getItem('notif_lues') || '[]')

          // Garde les 10 dernières commandes + marque comme lues
          this.dernieresCommandes = commandes
            .slice(0, 10)
            .map(c => ({ ...c, lue: lues.includes(c.id) }))
        }
      } catch (error) {
        console.error('Erreur notifications:', error)
      } finally {
        this.chargementNotif = false
      }
    },

    toutMarquerLu() {
      const ids = this.dernieresCommandes.map(c => c.id)
      localStorage.setItem('notif_lues', JSON.stringify(ids))
      this.dernieresCommandes = this.dernieresCommandes.map(c => ({ ...c, lue: true }))
    },

    allerVersCommande(id) {
      // Marquer cette commande comme lue
      const lues = JSON.parse(localStorage.getItem('notif_lues') || '[]')
      if (!lues.includes(id)) {
        lues.push(id)
        localStorage.setItem('notif_lues', JSON.stringify(lues))
      }
      this.dernieresCommandes = this.dernieresCommandes.map(c =>
        c.id === id ? { ...c, lue: true } : c
      )
      this.notifOuvert = false
      this.$router.push('/admin/commandes')
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    },

    seDeconnecter() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.authStore.deconnexion()
        this.$router.push('/login')
      }
    }
  }
}
</script>
