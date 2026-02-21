<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
    
    <!-- Image -->
    <div class="h-64 overflow-hidden cursor-pointer" @click="$emit('voir-details', product)">
      <img 
        :src="product.imagePath || 'https://via.placeholder.com/300'" 
        :alt="product.nom" 
        class="w-full h-full object-cover hover:scale-105 transition"
      >
    </div>

    <!-- Infos -->
    <div class="p-4">
      <h3 class="font-bold text-gray-800 mb-1 truncate">{{ product.nom }}</h3>
      <p class="text-sm text-gray-500 mb-3">{{ product.categorie?.nom || 'Non catégorisé' }}</p>
      
      <div class="flex justify-between items-center mb-3">
        <span class="text-lg font-bold text-gray-800">
          {{ product.prix.toLocaleString('fr-FR') }} FCFA
        </span>
      </div>

      <!-- Boutons -->
      <div class="flex gap-2">
        <button 
          @click="$emit('voir-details', product)"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition">
          <i class="fas fa-eye mr-1"></i>Détails
        </button>
        <button 
          @click="$emit('ajouter-panier', product)"
          class="flex flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
          <ShoppingCart class="w-5 h-5 mr-1"></ShoppingCart>Panier
        </button>
      </div>
    </div>

  </div>
</template>
  
<script>
import { ShoppingCart } from 'lucide-vue-next'

export default {
  name: 'ProductCard',
  props: ['product'],
  components: {
    ShoppingCart
  }
}
</script>