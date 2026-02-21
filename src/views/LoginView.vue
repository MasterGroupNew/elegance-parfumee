<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4" style="background-color: #faf5f0;">

    <div class="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden md:flex">

      <!-- Section image gauche -->
      <div class="hidden md:block md:w-1/2 text-white p-8 parfum-bg">
        <div class="h-full flex flex-col justify-center">
          <h1 class="text-4xl font-serif mb-4">Élégance Parfumée</h1>
          <p class="text-lg mb-8">Découvrez l'art subtil de la parfumerie</p>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <i class="fas fa-check-circle text-purple-400"></i>
              <span>Fragrances d'exception</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="fas fa-check-circle text-purple-400"></i>
              <span>Livraison gratuite</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="fas fa-check-circle text-purple-400"></i>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire droite -->
      <div class="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-medium text-gray-800 mb-2">Bienvenue</h2>
          <p class="text-gray-500 text-sm md:text-base">Connectez-vous à votre compte</p>
        </div>

        <!-- Toast -->
        <div v-if="toast.visible"
          :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
          class="border px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <i :class="toast.succes ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          <span>{{ toast.message }}</span>
        </div>

        <!-- Formulaire -->
        <div class="space-y-4 md:space-y-6">

          <!-- Identifiant -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email ou Contact</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-user text-gray-400"></i>
              </div>
              <input v-model="form.identifier" type="text" placeholder="email@example.com ou 0123456789"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400">
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole class="text-gray-400" size="16" />
              </div>
              <input v-model="form.password" :type="voirPassword ? 'text' : 'password'" placeholder="••••••••"
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400">
              <button @click="voirPassword = !voirPassword" type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i :class="voirPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
          </div>

          <!-- Se souvenir + mot de passe oublié -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input v-model="form.remember" type="checkbox" class="h-4 w-4 text-purple-600 border-gray-300 rounded">
              <label class="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
            </div>
            <RouterLink to="/mot-de-passe-oublie" class="text-sm text-purple-600 hover:text-purple-800">
              Mot de passe oublié ?
            </RouterLink>
          </div>

          <!-- Bouton connexion -->
          <button @click="seConnecter" :disabled="chargement"
            class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center"
            style="transition: transform 0.2s;">
            <span>{{ chargement ? 'Connexion...' : 'Se connecter' }}</span>
            <Loader v-if="chargement" class="ml-2 animate-spin" size="16" />
          </button>

        </div>

        <!-- Lien inscription -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Nouveau client ?
            <RouterLink to="/inscription" class="font-medium text-purple-700 hover:text-purple-800">
              Créez un compte
            </RouterLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { LockKeyhole,Loader } from 'lucide-vue-next'

export default {
  name: 'LoginView',
  components: {
    LockKeyhole,Loader
  },
  data() {
    return {
      form: {
        identifier: '',
        password: '',
        remember: false
      },
      chargement: false,
      voirPassword: false,
      toast: {
        visible: false,
        message: '',
        succes: false
      }
    }
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async syncCartToDB(token) {
      try {
        const cartStore = useCartStore()
        const localCart = cartStore.items

        if (localCart.length === 0) return

        const produits = localCart.map(item => ({
          produitId: item.id,
          quantite: item.quantity
        }))

        const response = await fetch('https://luxeparfum-backend.onrender.com/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ produits })
        })

        if (response.ok) {
          console.log('Panier synchronisé avec succès')
        }
      } catch (error) {
        console.error('Erreur synchronisation panier:', error)
      }
    },

    async seConnecter() {
      if (!this.form.identifier || !this.form.password) {
        this.afficherToast('Veuillez remplir tous les champs', false)
        return
      }

      this.chargement = true

      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: this.form.identifier,
            password: this.form.password
          })
        })

        const data = await response.json()

        if (response.ok) {
          this.afficherToast('Connexion réussie ! Synchronisation...', true)

          // Extraire userId depuis le token
          let userId = null
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]))
            userId = payload.id || payload.userId
            if (userId) localStorage.setItem('userId', userId)
          } catch (err) {
            console.error('Erreur décodage token :', err)
          }

          // Sauvegarder dans le store Auth
          const authStore = useAuthStore()
          authStore.connexion(data.token, data.user, this.form.remember)

          // Synchroniser le panier
          await this.syncCartToDB(data.token)

          // Redirection selon le rôle
          setTimeout(() => {
            if (data.user.role === 'admin') {
              this.$router.push('/admin')
            } else {
              this.$router.push('/')
            }
          }, 1500)

        } else {
          this.afficherToast(data.error || 'Identifiants incorrects', false)
        }

      } catch (err) {
        this.afficherToast('Erreur réseau. Veuillez réessayer.', false)
        console.error(err)
      } finally {
        this.chargement = false
      }
    }
  }
}
</script>

<style scoped>
.parfum-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
}
</style>
