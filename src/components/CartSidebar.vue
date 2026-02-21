<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="$emit('fermer')"></div>

  <!-- Sidebar -->
  <div
    class="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 flex flex-col transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
    <!-- Header panier -->
    <div class="flex justify-between items-center p-6 border-b">
      <h3 class="text-xl font-bold">Votre Panier</h3>
      <button @click="$emit('fermer')" class="text-gray-500 hover:text-gray-700">
        <CircleX class="w-5 h-5 mr-1"></CircleX>
      </button>
    </div>

    <!-- Articles -->
    <div class="flex-grow overflow-y-auto p-6">
      <!-- Panier vide -->
      <div v-if="cartStore.items.length === 0" class="flex text-center py-8 text-gray-500">
        <ShoppingCart class="w-5 h-5 mr-1"></ShoppingCart>
        <p>Votre panier est vide</p>
      </div>

      <!-- Liste articles -->
      <div v-else class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.id"
          class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <img :src="item.image || 'https://via.placeholder.com/100'" :alt="item.name"
            class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
            <h4 class="font-medium text-sm">{{ item.name }}</h4>
            <p class="text-xs text-gray-500">{{ item.price.toLocaleString('fr-FR') }} FCFA</p>
            <p class="text-sm font-semibold text-purple-600">
              {{ (item.price * item.quantity).toLocaleString('fr-FR') }} FCFA
            </p>
          </div>

          <!-- Quantité -->
          <div class="flex items-center space-x-2">
            <button @click="cartStore.diminuer(item.id)"
              class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition">
              <Minus class="w-4 h-4"></Minus>
            </button>
            <span class="w-6 text-center font-medium">{{ item.quantity }}</span>
            <button @click="cartStore.augmenter(item.id)"
              class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition">
              <i class="fas fa-plus text-xs"></i>
            </button>
            <button @click="cartStore.supprimer(item.id)"
              class="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded transition">
              <Trash class="w-5 h-5 mr-1"></Trash>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Total + Bouton -->
    <div class="border-t p-6">
      <div class="flex justify-between mb-2">
        <span>Sous-total</span>
        <span class="font-medium">{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
      </div>
      <div class="flex justify-between mb-4">
        <span>Livraison</span>
        <span class="text-sm text-gray-500">Calculée à l'étape suivante</span>
      </div>
      <div class="flex justify-between text-lg font-bold mb-6">
        <span>Total</span>
        <span class="text-purple-600">{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
      </div>

      <button @click="passerCommande"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition">
        <ShoppingBag class="w-5 h-5 mr-2 inline"></ShoppingBag>Passer la commande
      </button>
    </div>
  </div>
</template>
<script>
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import{ShoppingCart,CircleX,Trash,Minus,ShoppingBag } from 'lucide-vue-next'

export default {
  name: 'CartSidebar',
  props: ['isOpen'],
  emits: ['fermer'],
  components: {ShoppingCart,CircleX,Trash,Minus,ShoppingBag },
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const router = useRouter()
    return { cartStore, authStore, router }
  },
  methods: {
    passerCommande() {
      // Panier vide ?
      if (this.cartStore.items.length === 0) {
        alert('Votre panier est vide !')
        return
      }

      // Non connecté ?
      if (!this.authStore.estConnecte) {
        this.$emit('fermer')
        this.router.push('/login')
        return
      }

      // Connecté → aller au checkout
      this.$emit('fermer')
      this.router.push('/checkout')
    }
  }
}
</script>
