<template>
  <ProductsPage
    titre="Toutes nos Collections"
    description="Découvrez l'ensemble de nos fragrances d'exception"
    heroImage="https://images.unsplash.com/photo-1615368144592-84ff1454233b?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
  />
</template>

<script>
import ProductsPage from '../components/ProductsPage.vue'
export default {
  name: 'CollectionsView',
  components: { ProductsPage }
}
</script>