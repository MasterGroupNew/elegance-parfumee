<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="container mx-auto max-w-5xl">

      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <ShoppingBag class="w-7 h-7 text-purple-600" />
        Finaliser la commande
      </h1>

      <!-- Toast -->
      <div
        v-if="toast.visible"
        :class="toast.succes ? 'border-green-500' : 'border-red-500'"
        class="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 bg-white border-l-4 p-4 shadow-lg rounded-lg"
      >
        <div class="flex items-center">
          <CheckCircle v-if="toast.succes" class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
          <AlertCircle v-else class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button @click="toast.visible = false" class="ml-3 text-gray-400 hover:text-gray-600">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Loader overlay -->
      <div
        v-if="chargement"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;"
      >
        <div class="bg-white rounded-lg p-6 flex flex-col items-center">
          <Loader class="w-10 h-10 animate-spin text-purple-600 mb-4" />
          <p class="text-gray-700 font-medium">Traitement de votre commande...</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Colonne gauche : Formulaire -->
        <div class="space-y-6">

          <!-- Infos personnelles -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User class="w-5 h-5 text-purple-600" />
              Informations personnelles
            </h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.nom"
                    type="text"
                    placeholder="Votre nom"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.prenom"
                    type="text"
                    placeholder="Votre prénom"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.telephone"
                  type="tel"
                  placeholder="+225 XX XX XX XX XX"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
            </div>
          </div>

          <!-- Adresse livraison -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin class="w-5 h-5 text-purple-600" />
              Adresse de livraison
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ville <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.ville"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Sélectionner une ville</option>
                  <option value="Abidjan">Abidjan</option>
                  <option value="Yamoussoukro">Yamoussoukro</option>
                  <option value="Bouaké">Bouaké</option>
                  <option value="Daloa">Daloa</option>
                  <option value="Korhogo">Korhogo</option>
                  <option value="San-Pédro">San-Pédro</option>
                  <option value="Man">Man</option>
                  <option value="Divo">Divo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Commune <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.commune"
                  type="text"
                  placeholder="Ex: Cocody, Yopougon..."
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Point de repère</label>
                <input
                  v-model="form.pointRepere"
                  type="text"
                  placeholder="Ex: près du marché de X, face à l'école Y..."
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                <p class="text-xs text-gray-400 mt-1">Pour faciliter la livraison</p>
              </div>
            </div>
          </div>

          <!-- Mode paiement -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-purple-600" />
              Mode de paiement
            </h2>
            <div class="space-y-3">

              <!-- Mobile Money -->
              <label
                :class="form.paiement === 'momo' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'"
                class="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-purple-300 transition"
              >
                <input v-model="form.paiement" type="radio" value="momo" class="mt-1 h-4 w-4 text-purple-600 flex-shrink-0">
                <div class="ml-3 flex-1">
                  <span class="block font-medium text-gray-700">Mobile Money</span>
                  <span class="block text-xs text-gray-500 mt-1">Orange Money, MTN Money, Moov Money, Wave</span>
                </div>
                <Smartphone class="w-5 h-5 text-purple-600 ml-2 flex-shrink-0" />
              </label>

              <!-- Cash -->
              <label
                :class="form.paiement === 'cash' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'"
                class="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-purple-300 transition"
              >
                <input v-model="form.paiement" type="radio" value="cash" class="mt-1 h-4 w-4 text-purple-600 flex-shrink-0">
                <div class="ml-3 flex-1">
                  <span class="block font-medium text-gray-700">Paiement à la livraison</span>
                  <span class="block text-xs text-gray-500 mt-1">Paiement en espèces à la réception</span>
                </div>
                <Banknote class="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />
              </label>

            </div>
          </div>

        </div>

        <!-- Colonne droite : Récapitulatif -->
        <div>
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Receipt class="w-5 h-5 text-purple-600" />
              Récapitulatif
            </h2>

            <!-- Panier vide -->
            <div v-if="cartStore.items.length === 0" class="text-center py-8">
              <ShoppingCart class="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 mb-4">Votre panier est vide</p>
              <RouterLink to="/" class="text-purple-600 hover:text-purple-700">
                Continuer vos achats
              </RouterLink>
            </div>

            <!-- Articles -->
            <div v-else>
              <div class="space-y-3 mb-6">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex items-center space-x-3"
                >
                  <img
                    :src="item.image || 'https://via.placeholder.com/60'"
                    :alt="item.name"
                    class="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  >
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
                  </div>
                  <p class="font-medium text-sm whitespace-nowrap">
                    {{ (item.price * item.quantity).toLocaleString('fr-FR') }} FCFA
                  </p>
                </div>
              </div>

              <!-- Totaux -->
              <div class="border-t pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Sous-total</span>
                  <span>{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Livraison</span>
                  <span class="text-green-600 font-medium">Calculée selon commune</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span class="text-purple-600">{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
                </div>
              </div>

              <!-- Bouton commander -->
              <button
                @click="passerCommande"
                :disabled="chargement"
                class="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Loader v-if="chargement" class="w-5 h-5 animate-spin" />
                <Lock v-else class="w-5 h-5" />
                {{ chargement ? 'Traitement...' : 'Confirmer la commande' }}
              </button>

              <p class="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck class="w-3 h-3" />
                Vos informations sont sécurisées
              </p>

              <button
                @click="$router.push('/')"
                class="w-full mt-3 text-sm text-gray-500 hover:text-purple-600 transition flex items-center justify-center gap-1"
              >
                <ArrowLeft class="w-3 h-3" />Continuer mes achats
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import {
  ShoppingBag, ShoppingCart, User, MapPin,
  CreditCard, Smartphone, Banknote, Receipt,
  Loader, Lock, ShieldCheck, ArrowLeft,
  CheckCircle, AlertCircle, X
} from 'lucide-vue-next'

export default {
  name: 'CheckoutView',
  components: {
    ShoppingBag, ShoppingCart, User, MapPin,
    CreditCard, Smartphone, Banknote, Receipt,
    Loader, Lock, ShieldCheck, ArrowLeft,
    CheckCircle, AlertCircle, X
  },
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    return { cartStore, authStore }
  },
  data() {
    return {
      form: {
        nom: '', prenom: '', telephone: '',
        email: '', ville: '', commune: '',
        pointRepere: '', paiement: 'cash'
      },
      chargement: false,
      toast: { visible: false, message: '', succes: false }
    }
  },
  mounted() {
    const user = this.authStore.user
    if (user) {
      this.form.nom = user.nom || ''
      this.form.prenom = user.prenoms || ''
      this.form.telephone = user.contact || ''
      this.form.email = user.email || ''
    }
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 4000)
    },

    validerFormulaire() {
      if (!this.form.nom)       { this.afficherToast('Veuillez entrer votre nom');       return false }
      if (!this.form.prenom)    { this.afficherToast('Veuillez entrer votre prénom');    return false }
      if (!this.form.telephone) { this.afficherToast('Veuillez entrer votre téléphone'); return false }
      if (!this.form.email)     { this.afficherToast('Veuillez entrer votre email');     return false }
      if (!this.form.ville)     { this.afficherToast('Veuillez sélectionner une ville'); return false }
      if (!this.form.commune)   { this.afficherToast('Veuillez entrer votre commune');   return false }
      if (!this.form.paiement)  { this.afficherToast('Veuillez choisir un mode de paiement'); return false }
      return true
    },

    async passerCommande() {
      if (this.cartStore.items.length === 0) {
        this.afficherToast('Votre panier est vide')
        return
      }
      if (!this.validerFormulaire()) return

      this.chargement = true

      try {
        const orderData = {
          items: this.cartStore.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingInfo: {
            nom: this.form.nom,
            prenom: this.form.prenom,
            telephone: this.form.telephone,
            email: this.form.email,
            adresseLivraison: {
              ville: this.form.ville,
              commune: this.form.commune,
              pointRepere: this.form.pointRepere || ''
            },
            modePaiement: this.form.paiement
          }
        }

        const response = await fetch('https://luxeparfum-backend.onrender.com/api/orders/add_order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authStore.token}`
          },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        this.cartStore.viderPanier()
        this.afficherToast('Commande passée avec succès !', true)

        setTimeout(() => {
          const orderId = data.orderId || data.order?.id || data.id
          if (orderId) {
            this.$router.push(`/suivi?orderId=${orderId}`)
          } else {
            this.$router.push('/historique')
          }
        }, 1500)

      } catch (error) {
        console.error('Erreur:', error)
        let message = 'Erreur de connexion au serveur'
        if (error.message.includes('Failed to fetch')) {
          message = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
        } else if (error.message) {
          message = error.message
        }
        this.afficherToast(message, false)
      } finally {
        this.chargement = false
      }
    }
  }
}
</script>
