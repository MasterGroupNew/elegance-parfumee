<template>
  <ProductsPage
    titre="Parfums Homme"
    description="Des fragrances boisées et épicées pour l'homme moderne"
    heroImage="https://images.unsplash.com/photo-1595425964073-0be69ec587b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
    genre="Homme"
  />
</template>

<script>
import ProductsPage from '../components/ProductsPage.vue'
export default {
  name: 'HommeView',
  components: { ProductsPage }
}
</script>