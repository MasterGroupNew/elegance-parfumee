<template>
  <div>

    <!-- Hero -->
    <section class="hero-bg text-white py-20 md:py-32">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl md:text-6xl font-bold mb-4">Découvrez votre signature olfactive</h2>
        <p class="text-xl md:text-2xl mb-8">Des fragrances uniques qui racontent votre histoire</p>
        <a href="/collections"
          class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition">
          Explorer la collection
        </a>
      </div>
    </section>

    <!-- Produits -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Nos best-sellers</h2>

        <!-- Chargement -->
        <div v-if="chargement" class="text-center py-8">
          <Loader class="animate-spin w-12 h-12 text-gray-500 mx-auto mb-4"></Loader>
          <p class="text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Produits -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard v-for="product in products" :key="product._id" :product="product"
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
            <X class="w-5 h-5 mr-1"></X>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <img :src="produitSelectionne.imagePath || 'https://via.placeholder.com/400'" :alt="produitSelectionne.nom"
            class="w-full h-80 object-cover rounded-lg shadow-md">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ produitSelectionne.nom }}</h2>
            <p class=" flex text-purple-600 font-medium mb-4">
              <Tag class="w-5 h-5 mr-1"></Tag>
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
                class="flex flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition"
                type="button">
                <ShoppingCart class="w-5 h-5 mr-1"></ShoppingCart>Ajouter au panier
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
    <!-- Catégories -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Nos Catégories</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="categorie in categories" :key="categorie.nom"
            class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
            <div class="h-48 bg-cover bg-center" :style="{ backgroundImage: `url(${categorie.image})` }"></div>
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ categorie.titre }}</h3>
              <p class="text-gray-600 mb-3">{{ categorie.description }}</p>
              <RouterLink :to="categorie.lien" class="text-purple-600 font-medium hover:underline">
                Voir collection →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-12 bg-purple-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
        <p class="mb-8 max-w-2xl mx-auto">
          Recevez en exclusivité nos offres spéciales, nouveautés et conseils parfum.
        </p>
        <div class="max-w-md mx-auto flex">
          <input v-model="email" type="email" placeholder="Votre email"
            class="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-gray-800">
          <button @click="sAbonner"
            class="bg-purple-800 hover:bg-purple-900 px-6 py-3 rounded-r-lg font-medium transition duration-300">
            S'abonner
          </button>
        </div>
        <p v-if="messageNewsletter" class="mt-4 text-white font-medium">
          {{ messageNewsletter }}
        </p>
      </div>
    </section>
  </div>
</template>


<script>
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cartStore'

import {Loader, ShoppingCart,X,Tag} from 'lucide-vue-next'

export default {
  name: 'HomeView',
  components: { ProductCard,  ShoppingCart,Loader,X,Tag},
  data() {
    return {
      products: [],
      chargement: true,
      produitSelectionne: null,
      email: '',
      messageNewsletter: '',
      categories: [
        {
          nom: 'femme',
          titre: 'Parfums Femmes',
          description: 'Fragrances florales et fruitées',
          image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
          lien: '/femme'
        },
        {
          nom: 'homme',
          titre: 'Parfums Hommes',
          description: 'Fragrances boisées et épicées',
          image: 'https://images.unsplash.com/photo-1595425964073-0be69ec587b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
          lien: '/homme'
        },
        {
          nom: 'unisexe',
          titre: 'Parfums Unisexes',
          description: 'Fragrances universelles',
          image: 'https://images.unsplash.com/photo-1615368144592-84ff1454233b?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
          lien: '/collections'
        },
        {
          nom: 'limitee',
          titre: 'Collections Limitées',
          description: 'Éditions exclusives',
          image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
          lien: '/collections'
        }
      ]
    }
  },
  async mounted() {
    await this.chargerProduits()
  },
  methods: {
    async chargerProduits() {
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/products/get_product')
        const data = await response.json()
        this.products = data.slice(0, 8)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },
    ajouterAuPanier(product) {
      const cartStore = useCartStore()
      cartStore.ajouterProduit(product)
      //alert(`✅ ${product.nom} ajouté au panier !`)
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
    },
    sAbonner() {
      if (!this.email) {
        this.messageNewsletter = '⚠️ Veuillez entrer votre email !'
        return
      }
      if (!this.email.includes('@')) {
        this.messageNewsletter = '⚠️ Email invalide !'
        return
      }
      this.messageNewsletter = `✅ Merci ! ${this.email} a bien été enregistré.`
      this.email = ''
      setTimeout(() => {
        this.messageNewsletter = ''
      }, 4000)
    }

  }
}
</script>


<style>
.hero-bg {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1595425970377-2f8ded5e803a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80');
  background-size: cover;
  background-position: center;
}
</style>
