<template>
  <ProductsPage
    titre="Parfums Femme"
    description="Des fragrances florales et fruitées pour la femme élégante"
    heroImage="https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
    genre="Femme"
  />
</template>

<script>
import ProductsPage from '../components/ProductsPage.vue'
export default {
  name: 'FemmeView',
  components: { ProductsPage }
}
</script>