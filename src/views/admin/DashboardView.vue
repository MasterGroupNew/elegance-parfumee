<template>
  <AdminLayout>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4"
      >
        <div :class="stat.bg" class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
          <component :is="stat.icone" class="w-7 h-7 text-white" />
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-800">
            <Loader v-if="chargement" class="w-5 h-5 animate-spin text-gray-300" />
            <span v-else>{{ stat.valeur }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Dernières commandes -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center">
            <ShoppingBag class="w-5 h-5 text-purple-600 mr-2" />
            Dernières commandes
          </h3>
          <RouterLink to="/admin/commandes" class="text-sm text-purple-600 hover:underline">
            Voir tout
          </RouterLink>
        </div>

        <div v-if="chargement" class="text-center py-8">
          <Loader class="w-8 h-8 animate-spin text-purple-600 mx-auto" />
        </div>

        <div v-else-if="dernieresCommandes.length === 0" class="text-center py-8 text-gray-400">
          <PackageOpen class="w-10 h-10 mx-auto mb-2" />
          <p>Aucune commande</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="commande in dernieresCommandes"
            :key="commande.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-sm text-gray-800">#{{ commande.id }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(commande.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-sm text-purple-600">
                {{ (commande.total || 0).toLocaleString('fr-FR') }} FCFA
              </p>
              <span :class="getStatusColor(commande.status)" class="text-xs px-2 py-1 rounded-full">
                {{ getStatusText(commande.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Derniers utilisateurs -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center">
            <Users class="w-5 h-5 text-purple-600 mr-2" />
            Derniers utilisateurs
          </h3>
          <RouterLink to="/admin/utilisateurs" class="text-sm text-purple-600 hover:underline">
            Voir tout
          </RouterLink>
        </div>

        <div v-if="chargement" class="text-center py-8">
          <Loader class="w-8 h-8 animate-spin text-purple-600 mx-auto" />
        </div>

        <div v-else-if="derniersUtilisateurs.length === 0" class="text-center py-8 text-gray-400">
          <Users class="w-10 h-10 mx-auto mb-2" />
          <p>Aucun utilisateur</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="user in derniersUtilisateurs"
            :key="user.id"
            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-purple-600 font-bold text-sm">
                {{ ((user.nom?.charAt(0) || '') + (user.prenoms?.charAt(0) || '')).toUpperCase() || '?' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-gray-800 truncate">{{ user.nom }} {{ user.prenoms }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user.email || user.contact }}</p>
            </div>
            <span
              :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'"
              class="text-xs px-2 py-1 rounded-full flex-shrink-0"
            >
              {{ user.role || 'user' }}
            </span>
          </div>
        </div>
      </div>

    </div>

  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/AdminLayout.vue'
import { useAuthStore } from '../../stores/authStore'
import {
  ShoppingBag,
  Droplets,
  Users,
  Coins,
  Loader,
  PackageOpen
} from 'lucide-vue-next'

export default {
  name: 'DashboardView',
  components: {
    AdminLayout,
    ShoppingBag,
    Droplets,
    Users,
    Coins,
    Loader,
    PackageOpen
  },
  data() {
    return {
      chargement: true,
      dernieresCommandes: [],
      derniersUtilisateurs: [],
      stats: [
        { label: 'Total commandes', valeur: 0, icone: 'ShoppingBag', bg: 'bg-purple-500' },
        { label: 'Total produits', valeur: 0, icone: 'Droplets', bg: 'bg-blue-500' },
        { label: 'Utilisateurs', valeur: 0, icone: 'Users', bg: 'bg-green-500' },
        { label: "Chiffre d'affaires", valeur: '0 FCFA', icone: 'Coins', bg: 'bg-yellow-500' }
      ]
    }
  },
  async mounted() {
    await this.chargerDonnees()
  },
  methods: {
    async chargerDonnees() {
      const authStore = useAuthStore()
      const headers = { 'Authorization': `Bearer ${authStore.token}` }

      try {
        const [commandesRes, produitsRes, usersRes] = await Promise.all([
          fetch('https://luxeparfum-backend.onrender.com/api/orders/get_orders', { headers }),
          fetch('https://luxeparfum-backend.onrender.com/api/products/get_product', { headers }),
          fetch('https://luxeparfum-backend.onrender.com/api/auth/getUsersByRole/user', { headers })
        ])

        if (commandesRes.ok) {
          const commandes = await commandesRes.json()
          const liste = Array.isArray(commandes) ? commandes : commandes.orders || []
          this.dernieresCommandes = liste.slice(0, 5)
          this.stats[0].valeur = liste.length
          const ca = liste.reduce((sum, c) => sum + (c.total || 0), 0)
          this.stats[3].valeur = ca.toLocaleString('fr-FR') + ' FCFA'
        }

        if (produitsRes.ok) {
          const produits = await produitsRes.json()
          this.stats[1].valeur = Array.isArray(produits) ? produits.length : 0
        }

        if (usersRes.ok) {
          const users = await usersRes.json()
          const liste = Array.isArray(users) ? users : users.users || []
          this.derniersUtilisateurs = liste.slice(0, 5)
          this.stats[2].valeur = liste.length
        }

      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      } finally {
        this.chargement = false
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    },

    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-700',
        'en attente': 'bg-yellow-100 text-yellow-700',
        'processing': 'bg-blue-100 text-blue-700',
        'shipped': 'bg-purple-100 text-purple-700',
        'delivered': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700'
      }
      return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
    },

    getStatusText(status) {
      const texts = {
        'pending': 'En attente',
        'en attente': 'En attente',
        'processing': 'En traitement',
        'shipped': 'Expédiée',
        'delivered': 'Livrée',
        'cancelled': 'Annulée'
      }
      return texts[status?.toLowerCase()] || status
    }
  }
}
</script>
