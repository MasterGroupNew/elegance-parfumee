<template>
  <AdminLayout>

    <!-- Filtres -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <select
        v-model="filtreStatut"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
      >
        <option value="">Tous les statuts</option>
        <option value="en attente">En attente</option>
        <option value="processing">En traitement</option>
        <option value="shipped">Expédiée</option>
        <option value="delivered">Livrée</option>
        <option value="cancelled">Annulée</option>
      </select>

      <div class="flex-1">
        <input
          v-model="recherche"
          type="text"
          placeholder="Rechercher par ID commande..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
      </div>

      <div class="text-sm text-gray-500 flex items-center">
        {{ commandesFiltrees.length }} commande(s)
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast.visible"
      :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
      class="border px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
    >
      <CheckCircle v-if="toast.succes" class="w-5 h-5" />
      <AlertCircle v-else class="w-5 h-5" />
      <span>{{ toast.message }}</span>
    </div>

    <!-- Chargement -->
    <div v-if="chargement" class="text-center py-16">
      <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p class="text-gray-600">Chargement des commandes...</p>
    </div>

    <!-- Aucune commande -->
    <div v-else-if="commandesFiltrees.length === 0" class="bg-white rounded-xl shadow-md p-16 text-center">
      <PackageOpen class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500">Aucune commande trouvée</p>
    </div>

    <!-- Liste commandes -->
    <div v-else class="space-y-4">
      <div
        v-for="commande in commandesFiltrees"
        :key="commande.id"
        class="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <!-- Header commande -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b bg-gray-50 gap-3">
          <div class="space-y-1">
            <div class="flex items-center space-x-3">
              <span class="font-bold text-gray-800">Commande #{{ commande.id }}</span>
              <span :class="getStatusColor(commande.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ getStatusText(commande.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-500 flex items-center gap-3">
              <span class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />{{ formatDate(commande.createdAt) }}
              </span>
              <span v-if="commande.shippingAddress" class="flex items-center gap-1">
                <MapPin class="w-4 h-4" />{{ commande.shippingAddress }}
              </span>
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-purple-600">
              {{ (commande.total || 0).toLocaleString('fr-FR') }} FCFA
            </span>
            <button
              @click="toggleDetails(commande.id)"
              class="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 border border-purple-200 px-3 py-1 rounded-lg"
            >
              <ChevronUp v-if="detailsOuverts === commande.id" class="w-4 h-4" />
              <ChevronDown v-else class="w-4 h-4" />
              {{ detailsOuverts === commande.id ? 'Masquer' : 'Détails' }}
            </button>
          </div>
        </div>

        <!-- Détails -->
        <div v-if="detailsOuverts === commande.id" class="p-5">

          <!-- Chargement détails -->
          <div v-if="chargementDetails === commande.id" class="text-center py-8">
            <Loader class="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
            <p class="text-gray-500 text-sm">Chargement des détails...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Articles -->
            <div>
              <h4 class="font-semibold text-gray-700 mb-3">Articles</h4>
              <div class="space-y-2">
                <div
                  v-for="item in (detailsCommandes[commande.id]?.items || commande.items || [])"
                  :key="item.id"
                  class="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                >
                  <img
                    :src="item.image || 'https://via.placeholder.com/50'"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded"
                  >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">
                      Qté: {{ item.quantity }} × {{ (item.price || 0).toLocaleString('fr-FR') }} FCFA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Infos client + Changer statut -->
            <div class="space-y-4">

              <!-- Infos client depuis détails -->
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Informations client</h4>
                <div class="bg-gray-50 rounded-lg p-3 space-y-2 text-sm text-gray-600">

                  <!-- Depuis customerInfo (endpoint get_order) -->
                  <template v-if="detailsCommandes[commande.id]?.customerInfo">
                    <p class="flex items-center gap-2">
                      <User class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ detailsCommandes[commande.id].customerInfo.nom }}
                      {{ detailsCommandes[commande.id].customerInfo.prenom }}
                    </p>
                    <p v-if="detailsCommandes[commande.id].customerInfo.email" class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ detailsCommandes[commande.id].customerInfo.email }}
                    </p>
                    <p v-if="detailsCommandes[commande.id].customerInfo.telephone" class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ detailsCommandes[commande.id].customerInfo.telephone }}
                    </p>
                  </template>

                  <!-- Fallback depuis shippingInfo -->
                  <template v-else-if="commande.shippingInfo">
                    <p v-if="commande.shippingInfo.nom" class="flex items-center gap-2">
                      <User class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ commande.shippingInfo.nom }} {{ commande.shippingInfo.prenom }}
                    </p>
                    <p v-if="commande.shippingInfo.telephone" class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ commande.shippingInfo.telephone }}
                    </p>
                    <p v-if="commande.shippingInfo.email" class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ commande.shippingInfo.email }}
                    </p>
                    <p v-if="commande.shippingInfo.modePaiement" class="flex items-center gap-2">
                      <CreditCard class="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {{ commande.shippingInfo.modePaiement === 'cash' ? 'Paiement à la livraison' : 'Mobile Money' }}
                    </p>
                  </template>

                  <!-- Adresse -->
                  <p v-if="detailsCommandes[commande.id]?.shippingAddress || commande.shippingAddress" class="flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-purple-400 flex-shrink-0" />
                    {{ detailsCommandes[commande.id]?.shippingAddress || commande.shippingAddress }}
                  </p>

                </div>
              </div>

              <!-- Changer statut -->
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Changer le statut</h4>
                <div class="flex gap-2">
                  <select
                    v-model="nouveauxStatuts[commande.id]"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="en attente">En attente</option>
                    <option value="en préparation">En préparation</option>
                    <option value="expédiée">Expédiée</option>
                    <option value="livrée">Livrée</option>
                    <option value="annulée">Annulée</option>
                  </select>
                  <button
                    @click="changerStatut(commande)"
                    :disabled="chargementStatut === commande.id"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Loader v-if="chargementStatut === commande.id" class="w-4 h-4 animate-spin" />
                    <span v-else>Valider</span>
                  </button>
                </div>
              </div>

            </div>
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
  Loader, CheckCircle, AlertCircle, PackageOpen,
  Calendar, MapPin, ChevronUp, ChevronDown,
  User, Phone, Mail, CreditCard
} from 'lucide-vue-next'

export default {
  name: 'CommandesView',
  components: {
    AdminLayout,
    Loader, CheckCircle, AlertCircle, PackageOpen,
    Calendar, MapPin, ChevronUp, ChevronDown,
    User, Phone, Mail, CreditCard
  },
  data() {
    return {
      commandes: [],
      detailsCommandes: {},   // stocke les détails chargés par get_order/:id
      chargement: true,
      chargementDetails: null,
      detailsOuverts: null,
      filtreStatut: '',
      recherche: '',
      nouveauxStatuts: {},
      chargementStatut: null,
      toast: { visible: false, message: '', succes: false }
    }
  },
  computed: {
    commandesFiltrees() {
      return this.commandes.filter(c => {
        const matchStatut = !this.filtreStatut || c.status?.toLowerCase() === this.filtreStatut
        const matchRecherche = !this.recherche || String(c.id).includes(this.recherche)
        return matchStatut && matchRecherche
      })
    }
  },
  async mounted() {
    await this.chargerCommandes()
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    // ✅ GET /api/orders/get_orders
    async chargerCommandes() {
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/orders/get_orders',
          { headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          this.commandes = Array.isArray(data) ? data : data.orders || []
          this.commandes.forEach(c => {
            this.nouveauxStatuts[c.id] = c.status || 'en attente'
          })
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    // ✅ GET /api/orders/get_order/:id → charge les détails complets
    async chargerDetailsCommande(id) {
      if (this.detailsCommandes[id]) return // déjà chargé
      const authStore = useAuthStore()
      this.chargementDetails = id
      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/orders/get_order/${id}`,
          { headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          this.detailsCommandes = { ...this.detailsCommandes, [id]: data }
        }
      } catch (error) {
        console.error('Erreur détails:', error)
      } finally {
        this.chargementDetails = null
      }
    },

    async toggleDetails(id) {
      if (this.detailsOuverts === id) {
        this.detailsOuverts = null
      } else {
        this.detailsOuverts = id
        await this.chargerDetailsCommande(id) // charge les détails via get_order/:id
      }
    },

    // ✅ PUT /api/orders/update_order_status/:id
    async changerStatut(commande) {
      const authStore = useAuthStore()
      const nouveauStatut = this.nouveauxStatuts[commande.id]

      if (nouveauStatut === commande.status) {
        this.afficherToast('Le statut est déjà le même')
        return
      }

      this.chargementStatut = commande.id

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/orders/update_order_status/${commande.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ status: nouveauStatut })
          }
        )

        if (response.ok) {
          commande.status = nouveauStatut
          this.afficherToast('Statut mis à jour avec succès !', true)
        } else {
          const data = await response.json()
          this.afficherToast(data.error || 'Erreur lors de la mise à jour')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementStatut = null
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    },

    getStatusColor(status) {
      const colors = {
        'en attente':    'bg-yellow-100 text-yellow-700',
        'pending':       'bg-yellow-100 text-yellow-700',
        'en préparation':'bg-orange-100 text-orange-700',
        'processing':    'bg-blue-100 text-blue-700',
        'expédiée':      'bg-purple-100 text-purple-700',
        'shipped':       'bg-purple-100 text-purple-700',
        'livrée':        'bg-green-100 text-green-700',
        'delivered':     'bg-green-100 text-green-700',
        'annulée':       'bg-red-100 text-red-700',
        'cancelled':     'bg-red-100 text-red-700'
      }
      return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
    },

    getStatusText(status) {
      const texts = {
        'en attente':    'En attente',
        'pending':       'En attente',
        'en préparation':'En préparation',
        'processing':    'En traitement',
        'expédiée':      'Expédiée',
        'shipped':       'Expédiée',
        'livrée':        'Livrée',
        'delivered':     'Livrée',
        'annulée':       'Annulée',
        'cancelled':     'Annulée'
      }
      return texts[status?.toLowerCase()] || status
    }
  }
}
</script>
