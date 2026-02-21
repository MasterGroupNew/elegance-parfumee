<template>
  <div>
    <!-- Hero de la page -->
    <section class="text-white py-16"
      :style="{ background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ titre }}</h1>
        <p class="text-xl">{{ description }}</p>
      </div>
    </section>

    <!-- Produits -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">

        <!-- Chargement -->
        <div v-if="chargement" class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-3"></i>
          <p class="text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Aucun produit -->
        <div v-else-if="produits.length === 0" class="text-center py-8">
          <i class="fas fa-box-open text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">Aucun produit disponible dans cette catégorie</p>
        </div>

        <!-- Liste produits -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard v-for="product in produits" :key="product._id" :product="product"
            @ajouter-panier="ajouterAuPanier" @voir-details="voirDetails" />
        </div>

      </div>
    </section>


    <!-- Modal Détails Produit -->
    <div v-if="produitSelectionne" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style="z-index: 9999; top: 0; left: 0; right: 0; bottom: 0; display: flex;" @click.self="fermerModal">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-auto max-h-[90vh]">
        <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h3 class="text-2xl font-bold text-gray-800">Détails du produit</h3>
          <button @click="fermerModal" class="text-gray-500 hover:text-gray-700" type="button">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <img :src="produitSelectionne.imagePath || 'https://via.placeholder.com/400'" :alt="produitSelectionne.nom"
            class="w-full h-80 object-cover rounded-lg shadow-md">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ produitSelectionne.nom }}</h2>
            <p class="text-purple-600 font-medium mb-4">
              <i class="fas fa-tag mr-1"></i>
              {{ produitSelectionne.categorie?.nom || 'Non catégorisé' }}
            </p>
            <p class="text-3xl font-bold text-gray-800 mb-6">
              {{ produitSelectionne.prix.toLocaleString('fr-FR') }} FCFA
            </p>
            <p class="text-gray-600 leading-relaxed mb-6">
              {{ produitSelectionne.description || 'Une fragrance exceptionnelle qui révèle votre personnalité unique.'
              }}
            </p>
            <div class="flex gap-3">
              <button @click="ajouterAuPanierEtFermer"
                class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition"
                type="button">
                <i class="fas fa-cart-shopping mr-2"></i>Ajouter au panier
              </button>
              <button @click="fermerModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition"
                type="button">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'
import { useCartStore } from '../stores/cartStore'

export default {
  name: 'ProductsPage',
  components: { ProductCard },
  props: {
    titre: String,
    description: String,
    heroImage: String,
    genre: String  // 'Homme', 'Femme', 'Unisex', ou null pour tout
  },
  data() {
    return {
      produits: [],
      chargement: true,
      produitSelectionne: null
    }
  },
  async mounted() {
    await this.chargerProduits()
  },
  methods: {
    async chargerProduits() {
      try {
        let url = 'https://luxeparfum-backend.onrender.com/api/products/get_product'

        if (this.genre) {
          url = `https://luxeparfum-backend.onrender.com/api/products/genre/${this.genre}`
        }

        const response = await fetch(url)
        const data = await response.json()

        // 👇 Sécurisation : on vérifie que c'est bien un tableau
        if (Array.isArray(data)) {
          this.produits = data
        } else if (data.products) {
          this.produits = data.products
        } else if (data.data) {
          this.produits = data.data
        } else {
          this.produits = []
        }

      } catch (error) {
        console.error('Erreur:', error)
        this.produits = []
      } finally {
        this.chargement = false
      }
    },
    ajouterAuPanier(product) {
      const cartStore = useCartStore()
      cartStore.ajouterProduit(product)
    },
    voirDetails(product) {
      this.produitSelectionne = product
    },

    fermerModal() {
      this.produitSelectionne = null
    },
    ajouterAuPanierEtFermer() {
      if (this.produitSelectionne) {
        this.ajouterAuPanier(this.produitSelectionne)
        this.fermerModal()
      }
    }
  }
}
</script>