<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">

    <!-- Image -->
    <div class="overflow-hidden cursor-pointer h-24 sm:h-36 md:h-44" @click="$emit('voir-details', product)">
      <img
        :src="product.imagePath || 'https://via.placeholder.com/300'"
        :alt="product.nom"
        class="w-full h-full object-cover hover:scale-105 transition"
      >
    </div>

    <!-- Infos -->
    <div class="p-1.5 sm:p-2 md:p-3">
      <h3 class="font-bold text-gray-800 truncate text-xs sm:text-sm">{{ product.nom }}</h3>
      <p class="text-gray-500 mb-1 truncate text-xs hidden sm:block">
        {{ product.categorie?.nom || 'Non catégorisé' }}
      </p>

      <span class="block font-bold text-gray-800 mb-1.5 text-xs sm:text-sm md:text-base">
        {{ product.prix.toLocaleString('fr-FR') }} F
      </span>

      <!-- Boutons -->
      <div class="flex gap-1 sm:gap-2">
        <button
          @click="$emit('voir-details', product)"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition flex items-center justify-center gap-1
                 py-1 text-xs sm:py-1.5 sm:text-xs md:py-2"
        >
          <Eye class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span class="hidden sm:inline">Détails</span>
        </button>
        <button
          @click="$emit('ajouter-panier', product)"
          class="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-1
                 py-1 text-xs sm:py-1.5 sm:text-xs md:py-2"
        >
          <ShoppingCart class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span class="hidden sm:inline">Panier</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ShoppingCart, Eye } from 'lucide-vue-next'

export default {
  name: 'ProductCard',
  props: ['product'],
  components: { ShoppingCart, Eye }
}
</script>
