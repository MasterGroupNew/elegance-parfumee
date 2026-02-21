import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || []
  }),

  getters: {
    // Nombre total d'articles
    totalItems: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    // Prix total
    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },

  actions: {
    // Ajouter au panier
    ajouterProduit(product) {
      const id = String(product._id || product.id)
      const existant = this.items.find(i => i.id === id)

      if (existant) {
        existant.quantity++
      } else {
        this.items.push({
          id,
          name: product.nom,
          price: product.prix,
          image: product.imagePath || '',
          quantity: 1
        })
      }
      this.sauvegarder()
    },

    // Augmenter quantité
    augmenter(id) {
      const item = this.items.find(i => i.id === String(id))
      if (item) {
        item.quantity++
        this.sauvegarder()
      }
    },

    // Diminuer quantité
    diminuer(id) {
      const item = this.items.find(i => i.id === String(id))
      if (item) {
        if (item.quantity <= 1) {
          this.supprimer(id)
        } else {
          item.quantity--
          this.sauvegarder()
        }
      }
    },

    // Supprimer un article
    supprimer(id) {
      this.items = this.items.filter(i => i.id !== String(id))
      this.sauvegarder()
    },

    // Sauvegarder dans localStorage
    sauvegarder() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    viderPanier() {
      this.items = []
      this.sauvegarder()
    }
  }
})