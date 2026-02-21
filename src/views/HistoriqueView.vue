<template>
  <div class="min-h-screen bg-gray-50 py-6 md:py-8">
    <div class="container mx-auto px-4">

      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Historique des commandes
      </h1>

      <!-- Chargement -->
      <div v-if="chargement" class="text-center py-12 bg-white rounded-lg shadow">
        <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
        <p class="text-gray-600">Chargement de vos commandes...</p>
      </div>

      <!-- Aucune commande -->
      <div v-else-if="commandes.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <PackageOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Aucune commande trouvée</p>
        <RouterLink
          to="/collections"
          class="inline-flex items-center gap-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
        >
          <ShoppingBag class="w-4 h-4" />Découvrir nos produits
        </RouterLink>
      </div>

      <!-- Liste commandes -->
      <div v-else class="space-y-4 md:space-y-6">
        <div
          v-for="commande in commandes"
          :key="commande.id"
          class="bg-white rounded-lg shadow-md p-4 md:p-6"
        >
          <!-- Header commande -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <div>
              <h2 class="text-base md:text-lg font-semibold">Commande #{{ commande.id }}</h2>
              <p class="text-xs md:text-sm text-gray-500">
                {{ formatDate(commande.createdAt) }}
              </p>
            </div>
            <span
              :class="getStatusColor(commande.status)"
              class="px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm self-start sm:self-auto"
            >
              {{ getStatusText(commande.status) }}
            </span>
          </div>

          <!-- Articles -->
          <div class="divide-y divide-gray-200">
            <div
              v-for="item in commande.items"
              :key="item.id"
              class="py-3 md:py-4 flex justify-between items-start sm:items-center gap-3"
            >
              <div class="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <img
                  :src="item.image || 'https://via.placeholder.com/80'"
                  :alt="item.name"
                  class="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                >
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-sm md:text-base truncate">{{ item.name }}</h3>
                  <p class="text-xs md:text-sm text-gray-500">Qté: {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-medium text-sm md:text-base whitespace-nowrap">
                {{ (item.price * item.quantity).toLocaleString('fr-FR') }} F
              </p>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-sm md:text-base">Total</span>
              <span class="font-bold text-base md:text-lg text-purple-600">
                {{ commande.total.toLocaleString('fr-FR') }} FCFA
              </span>
            </div>
          </div>

          <!-- Bouton suivi -->
          <div class="mt-4 md:mt-6">
            <RouterLink
              :to="`/suivi?orderId=${commande.id}`"
              class="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-purple-700 transition text-sm md:text-base"
            >
              <Truck class="w-4 h-4" />Suivre la commande
            </RouterLink>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import { Loader, PackageOpen, ShoppingBag, Truck } from 'lucide-vue-next'

export default {
  name: 'HistoriqueView',
  components: { Loader, PackageOpen, ShoppingBag, Truck },
  data() {
    return {
      commandes: [],
      chargement: true
    }
  },
  async mounted() {
    await this.chargerCommandes()
  },
  methods: {
    async chargerCommandes() {
      const authStore = useAuthStore()
      const userId = localStorage.getItem('userId')

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/orders/user/${userId}`,
          { headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )

        if (response.ok) {
          const data = await response.json()
          this.commandes = Array.isArray(data) ? data : []
        } else {
          this.commandes = []
        }
      } catch (error) {
        console.error('Erreur:', error)
        this.commandes = []
      } finally {
        this.chargement = false
      }
    },

    formatDate(date) {
      if (!date) return 'Date inconnue'
      return new Date(date).toLocaleDateString('fr-FR')
    },

    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-green-100 text-green-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const texts = {
        'pending': 'En attente',
        'processing': 'En traitement',
        'shipped': 'Expédiée',
        'delivered': 'Livrée',
        'cancelled': 'Annulée'
      }
      return texts[status] || status
    }
  }
}
</script>
