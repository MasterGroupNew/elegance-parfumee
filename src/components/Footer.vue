<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

        <!-- Logo + Réseaux -->
        <div>
          <div class="flex items-center mb-4">
            <SprayCan class="w-6 h-6 text-purple-600"></SprayCan>
            <h3 class="text-xl font-bold">Élégance <span class="text-purple-400">Parfumée</span></h3>
          </div>
          <p class="text-gray-400 mb-4">Votre destination premium pour des fragrances exceptionnelles.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-pinterest"></i></a>
          </div>
        </div>

        <!-- Boutique -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Boutique</h4>
          <ul class="space-y-2">
            <li><RouterLink to="/" class="text-gray-400 hover:text-white transition">Nouveautés</RouterLink></li>
            <li><RouterLink to="/femme" class="text-gray-400 hover:text-white transition">Parfums Femmes</RouterLink></li>
            <li><RouterLink to="/homme" class="text-gray-400 hover:text-white transition">Parfums Hommes</RouterLink></li>
            <li><RouterLink to="/collections" class="text-gray-400 hover:text-white transition">Collections</RouterLink></li>
          </ul>
        </div>

        <!-- Informations -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Informations</h4>
          <ul class="space-y-2">
            <li><RouterLink to="/apropos" class="text-gray-400 hover:text-white transition">À propos</RouterLink></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Contact</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Livraison</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Retours</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">FAQ</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <MapPin class="w-4 h-4 mr-2 text-gray-400"></MapPin>
              <span>Cocody, Abidjan, Côte d'Ivoire</span>
            </li>
            <li class="flex items-center">
              <Phone class="w-4 h-4 mr-2 text-gray-400"></Phone>
              <span>+225 07 07 07 07 07</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              <span>contact@luxeparfum.ci</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bas de page -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 mb-4 md:mb-0">© 2024 Élégance Parfumée. Tous droits réservés.</p>
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-white transition">Mentions légales</a>
          <a href="#" class="text-gray-400 hover:text-white transition">Politique de confidentialité</a>
          <a href="#" class="text-gray-400 hover:text-white transition">Conditions générales</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script>
import{SprayCan,Phone,MapPin}from 'lucide-vue-next'
export default {
  name: 'Footer',
  components: {
    SprayCan,Phone,MapPin
  }
}
</script>
