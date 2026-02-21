<template>
  <div>

    <!-- Hero -->
    <section
      class="text-white py-20"
      style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1595425970377-2f8ded5e803a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'); background-size: cover; background-position: center;"
    >
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">À Propos</h1>
        <p class="text-xl md:text-2xl max-w-2xl mx-auto">
          Découvrez l'histoire et les valeurs d'Élégance Parfumée
        </p>
      </div>
    </section>

    <!-- Notre Histoire -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Notre Histoire</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              Fondée en 2020 à Cocody, Abidjan, Élégance Parfumée est née d'une passion profonde
              pour l'art de la parfumerie. Notre fondatrice, inspirée par les senteurs exotiques
              de la Côte d'Ivoire, a voulu créer un espace où chaque fragrance raconte une histoire.
            </p>
            <p class="text-gray-600 leading-relaxed mb-4">
              Aujourd'hui, nous proposons une sélection soigneuse des plus grandes maisons de
              parfumerie mondiales, adaptée aux goûts et aux préférences de notre clientèle africaine.
            </p>
            <p class="text-gray-600 leading-relaxed">
              Notre mission est simple : vous aider à trouver votre signature olfactive,
              ce parfum unique qui vous ressemble et vous accompagne au quotidien.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
              alt="Notre boutique"
              class="w-full h-96 object-cover rounded-lg shadow-lg"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Valeurs -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Nos Valeurs</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="valeur in valeurs"
            :key="valeur.titre"
            class="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition"
          >
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <component :is="valeur.icone" class="w-7 h-7 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">{{ valeur.titre }}</h3>
            <p class="text-gray-600">{{ valeur.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Chiffres -->
    <section class="py-16 bg-purple-600 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="chiffre in chiffres" :key="chiffre.label">
            <p class="text-4xl md:text-5xl font-bold mb-2">{{ chiffre.valeur }}</p>
            <p class="text-purple-200">{{ chiffre.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Nous Contacter</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin class="w-7 h-7 text-purple-600" />
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Adresse</h3>
            <p class="text-gray-600">Cocody, Abidjan<br>Côte d'Ivoire</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone class="w-7 h-7 text-purple-600" />
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Téléphone</h3>
            <p class="text-gray-600">+225 07 07 07 07 07</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail class="w-7 h-7 text-purple-600" />
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Email</h3>
            <p class="text-gray-600">contact@luxeparfum.ci</p>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { Star, BadgeCheck, Heart, Truck, MapPin, Phone, Mail } from 'lucide-vue-next'

export default {
  name: 'AProposView',
  components: { Star, BadgeCheck, Heart, Truck, MapPin, Phone, Mail },
  data() {
    return {
      valeurs: [
        {
          titre: 'Qualité',
          icone: 'Star',
          description: 'Nous sélectionnons uniquement les meilleures fragrances des grandes maisons mondiales.'
        },
        {
          titre: 'Authenticité',
          icone: 'BadgeCheck',
          description: 'Tous nos parfums sont 100% authentiques et certifiés par les marques.'
        },
        {
          titre: 'Service',
          icone: 'Heart',
          description: 'Notre équipe est à votre disposition pour vous guider dans votre choix.'
        },
        {
          titre: 'Livraison',
          icone: 'Truck',
          description: 'Livraison rapide et sécurisée partout à Abidjan et dans toute la Côte d\'Ivoire.'
        }
      ],
      chiffres: [
        { valeur: '500+', label: 'Parfums disponibles' },
        { valeur: '2000+', label: 'Clients satisfaits' },
        { valeur: '50+', label: 'Grandes marques' },
        { valeur: '4', label: 'Années d\'expérience' }
      ]
    }
  }
}
</script>
