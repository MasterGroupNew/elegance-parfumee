<template>
  <div>
    <!-- Header masqué si admin -->
    <Header v-if="!estAdmin" @ouvrir-panier="panierOuvert = true" />
    
    <RouterView />  <!-- 👈 remplace HomeView, affiche la bonne page selon l'URL -->
    
    <!-- Footer masqué si admin -->
    <Footer v-if="!estAdmin" />
    
    <!-- CartSidebar masqué si admin -->
    <CartSidebar v-if="!estAdmin" :isOpen="panierOuvert" @fermer="panierOuvert = false" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import CartSidebar from './components/CartSidebar.vue'
import Footer from './components/Footer.vue'

export default {
  components: { Header, CartSidebar, Footer },
  data() {
    return {
      panierOuvert: false
    }
  },
  computed: {
    estAdmin() {
      // Vérifie si la route actuelle commence par /admin
      return this.$route.meta.requiresAdmin === true
    }
  }
}
</script>