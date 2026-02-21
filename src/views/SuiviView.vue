<template>
  <div class="min-h-screen bg-gray-50 py-6 md:py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">

        <!-- Retour historique -->
        <div class="mb-4">
          <RouterLink to="/historique"
            class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition">
            <ArrowLeft class="w-4 h-4" />
            <span class="text-sm md:text-base">Retour à l'historique</span>
          </RouterLink>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
          Suivi de votre commande
        </h1>

        <!-- Chargement -->
        <div v-if="chargement" class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 text-center py-8">
          <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
          <p class="text-gray-600">Chargement...</p>
        </div>

        <!-- Erreur -->
        <div v-else-if="erreur" class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 text-center py-8">
          <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p class="text-gray-600">Impossible de charger les détails de la commande</p>
          <RouterLink to="/historique" class="inline-block mt-4 text-purple-600 hover:text-purple-700">
            Retour à l'historique
          </RouterLink>
        </div>

        <!-- Détails commande -->
        <div v-else-if="commande" class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-3 sm:space-y-0">
            <div>
              <h2 class="text-lg md:text-xl font-semibold">Commande #{{ commande.id }}</h2>
              <p class="text-xs md:text-sm text-gray-500">Passée le {{ formatDate(commande.createdAt) }}</p>
            </div>
            <span
              :class="getStatusColor(commande.status)"
              class="px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium self-start"
            >
              {{ getStatusText(commande.status) }}
            </span>
          </div>

          <!-- Adresse livraison -->
          <div class="border-t border-gray-200 pt-4">
            <h3 class="font-medium mb-2 text-sm md:text-base">Adresse de livraison</h3>
            <p class="text-gray-600 text-sm md:text-base flex items-start gap-2">
              <MapPin class="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <span v-if="commande.shippingAddress">{{ commande.shippingAddress }}</span>
              <span v-else-if="commande.shippingInfo?.adresseLivraison">
                {{ commande.shippingInfo.adresseLivraison.commune }},
                {{ commande.shippingInfo.adresseLivraison.ville }}
              </span>
              <span v-else>Non spécifiée</span>
            </p>
          </div>

          <!-- Articles -->
          <div v-if="commande.items" class="border-t border-gray-200 pt-4 mt-4">
            <h3 class="font-medium mb-3 text-sm md:text-base">Articles commandés</h3>
            <div class="space-y-3">
              <div v-for="item in commande.items" :key="item.id" class="flex items-center gap-3">
                <img
                  :src="item.image || 'https://via.placeholder.com/100'"
                  :alt="item.name"
                  class="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm md:text-base truncate">{{ item.name }}</p>
                  <p class="text-xs md:text-sm text-gray-500">Qté: {{ item.quantity }}</p>
                </div>
                <p class="font-medium text-sm md:text-base whitespace-nowrap">
                  {{ ((item.price || 0) * (item.quantity || 1)).toLocaleString('fr-FR') }} FCFA
                </p>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span class="font-semibold text-sm md:text-base">Total</span>
              <span class="font-bold text-base md:text-lg text-purple-600">
                {{ (commande.total || 0).toLocaleString('fr-FR') }} FCFA
              </span>
            </div>
          </div>
        </div>

        <!-- Étapes de suivi -->
        <div v-if="commande" class="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-semibold mb-6">Statut de la livraison</h2>

          <!-- Version mobile (verticale) -->
          <div class="md:hidden space-y-4">
            <div v-for="(step, index) in etapes" :key="step.status" class="flex items-start gap-4">
              <div class="flex flex-col items-center">
                <div
                  :class="stepClass(step.status)"
                  class="step-icon w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <component :is="step.icon" class="w-5 h-5" />
                </div>
                <div
                  v-if="index < etapes.length - 1"
                  :class="isCompleted(step.status) ? 'bg-green-500' : 'bg-gray-200'"
                  class="w-0.5 h-12 transition-colors duration-500"
                ></div>
              </div>
              <div class="flex-1 pt-2">
                <p
                  :class="isCompleted(step.status) || isActive(step.status) ? 'text-gray-900' : 'text-gray-400'"
                  class="text-sm font-medium"
                >
                  {{ step.text }}
                </p>
                <p v-if="isActive(step.status)" class="text-xs text-purple-600 mt-1">En cours</p>
                <p v-if="isCompleted(step.status)" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check class="w-3 h-3" />Terminé
                </p>
              </div>
            </div>
          </div>

          <!-- Version desktop (horizontale) -->
          <div class="hidden md:block">
            <div class="flex items-start justify-between relative">
              <div
                v-for="step in etapes"
                :key="step.status"
                class="flex flex-col items-center relative z-10 flex-1"
              >
                <div
                  :class="stepClass(step.status)"
                  class="step-icon w-14 h-14 rounded-full flex items-center justify-center"
                >
                  <component :is="step.icon" class="w-6 h-6" />
                </div>
                <p
                  :class="isCompleted(step.status) || isActive(step.status) ? 'text-gray-900' : 'text-gray-400'"
                  class="text-sm font-medium mt-3 text-center"
                >
                  {{ step.text }}
                </p>
                <p v-if="isActive(step.status)" class="text-xs text-purple-600 mt-1">En cours</p>
                <p v-if="isCompleted(step.status)" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check class="w-3 h-3" />Terminé
                </p>
              </div>

              <!-- Ligne fond -->
              <div class="absolute left-0 right-0 h-1 bg-gray-200 top-7" style="margin: 0 7%;"></div>

              <!-- Ligne progression -->
              <div
                class="progress-line absolute left-0 h-1 bg-gradient-to-r from-green-400 to-green-500 top-7 shadow-md"
                :style="{ width: progressWidth, marginLeft: '7%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Message livreur -->
        <p v-if="commande" class="text-center mt-4 text-gray-600">
          Le livreur va vous appeler
        </p>

      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import {
  ArrowLeft, Loader, AlertCircle, MapPin,
  ShoppingCart, Box, Truck, CheckCircle, Check
} from 'lucide-vue-next'

export default {
  name: 'SuiviView',
  components: {
    ArrowLeft, Loader, AlertCircle, MapPin,
    ShoppingCart, Box, Truck, CheckCircle, Check
  },
  data() {
    return {
      commande: null,
      chargement: true,
      erreur: false,
      etapes: [
        { status: 'pending',    icon: 'ShoppingCart', text: 'Commande reçue' },
        { status: 'processing', icon: 'Box',          text: 'En préparation' },
        { status: 'shipped',    icon: 'Truck',        text: 'En livraison'   },
        { status: 'delivered',  icon: 'CheckCircle',  text: 'Livrée'         }
      ],
      statusMapping: {
        'en attente':    'pending',
        'pending':       'pending',
        'en cours':      'processing',
        'processing':    'processing',
        'en préparation':'processing',
        'expédiée':      'shipped',
        'shipped':       'shipped',
        'en livraison':  'shipped',
        'livrée':        'delivered',
        'delivered':     'delivered',
        'livré':         'delivered'
      }
    }
  },
  computed: {
    statutNormalise() {
      if (!this.commande) return 'pending'
      return this.statusMapping[this.commande.status?.toLowerCase()] || 'pending'
    },
    progressWidth() {
      const progress = {
        'pending':    '0%',
        'processing': '33%',
        'shipped':    '66%',
        'delivered':  '100%'
      }
      return progress[this.statutNormalise] || '0%'
    }
  },
  async mounted() {
    const orderId = new URLSearchParams(window.location.search).get('orderId')
    if (!orderId) {
      this.$router.push('/historique')
      return
    }
    await this.chargerCommande(orderId)
  },
  methods: {
    async chargerCommande(orderId) {
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/orders/get_order/${orderId}`,
          { headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )
        if (response.ok) {
          this.commande = await response.json()
        } else {
          this.erreur = true
        }
      } catch (error) {
        console.error('Erreur:', error)
        this.erreur = true
      } finally {
        this.chargement = false
      }
    },

    isCompleted(stepStatus) {
      const order = ['pending', 'processing', 'shipped', 'delivered']
      return order.indexOf(stepStatus) < order.indexOf(this.statutNormalise)
    },

    isActive(stepStatus) {
      return stepStatus === this.statutNormalise
    },

    stepClass(stepStatus) {
      if (this.isCompleted(stepStatus)) return 'bg-green-500 text-white shadow-lg completed'
      if (this.isActive(stepStatus))    return 'bg-purple-500 text-white shadow-lg ring-4 ring-purple-200'
      return 'bg-gray-200 text-gray-400'
    },

    formatDate(date) {
      if (!date) return 'Date inconnue'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    },

    getStatusColor(status) {
      const colors = {
        'pending':     'bg-yellow-100 text-yellow-800',
        'en attente':  'bg-yellow-100 text-yellow-800',
        'processing':  'bg-blue-100 text-blue-800',
        'en cours':    'bg-blue-100 text-blue-800',
        'shipped':     'bg-purple-100 text-purple-800',
        'en livraison':'bg-purple-100 text-purple-800',
        'delivered':   'bg-green-100 text-green-800',
        'livrée':      'bg-green-100 text-green-800',
        'cancelled':   'bg-red-100 text-red-800'
      }
      return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const texts = {
        'pending':    'En attente',
        'processing': 'En traitement',
        'shipped':    'En cours de livraison',
        'delivered':  'Livrée',
        'cancelled':  'Annulée'
      }
      return texts[status?.toLowerCase()] || status
    }
  }
}
</script>

<style scoped>
.progress-line {
  transition: width 0.8s ease-in-out;
}
.step-icon {
  transition: all 0.3s ease;
}
.step-icon.completed {
  animation: pulse 0.5s ease-in-out;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.1); }
}
</style>
