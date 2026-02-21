<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4" style="background-color: #faf5f0;">

    <div class="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:flex">

      <!-- Section image gauche -->
      <div class="md:w-1/2 hidden md:flex flex-col justify-center p-12 text-white parfum-bg">
        <h1 class="text-4xl font-serif mb-4">Élégance Parfumée</h1>
        <p class="text-lg mb-8">Rejoignez-nous et découvrez l'art subtil de la parfumerie</p>
        <div class="flex items-center mt-auto">
          <div class="w-12 h-12 rounded-full border-2 border-amber-100 flex items-center justify-center mr-4">
            <i class="fas fa-star text-amber-100 text-xl"></i>
          </div>
          <p class="text-sm font-light opacity-80">
            Créez votre compte pour accéder à des offres exclusives et suivre vos commandes
          </p>
        </div>
      </div>

      <!-- Formulaire droite -->
      <div class="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-medium text-gray-800 mb-2">Inscription</h2>
          <p class="text-gray-500">Entrez vos informations pour créer un compte</p>
        </div>

        <!-- Toast -->
        <div
          v-if="toast.visible"
          :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
          class="border px-6 py-3 rounded mb-6 text-center"
        >
          <i :class="toast.succes ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
          {{ toast.message }}
        </div>

        <!-- Formulaire -->
        <div class="space-y-5">

          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              v-model="form.nom"
              type="text"
              placeholder="Votre nom"
              class="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>

          <!-- Prénoms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms</label>
            <input
              v-model="form.prenoms"
              type="text"
              placeholder="Vos prénoms"
              class="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>

          <!-- Contact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              v-model="form.contact"
              type="text"
              placeholder="Numéro de téléphone"
              class="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-gray-400">(facultatif)</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              class="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="voirPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
              >
              <button
                @click="voirPassword = !voirPassword"
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="voirPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
          </div>

          <!-- Bouton inscription -->
          <button
            @click="sInscrire"
            :disabled="chargement"
            class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center"
          >
            <i v-if="chargement" class="fas fa-spinner fa-spin mr-2"></i>
            {{ chargement ? 'Inscription...' : "S'inscrire" }}
          </button>

        </div>

        <!-- Lien connexion -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            Vous avez déjà un compte ?
            <RouterLink to="/login" class="font-medium text-purple-700 hover:text-purple-800">
              Connectez-vous
            </RouterLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InscriptionView',
  data() {
    return {
      form: {
        nom: '',
        prenoms: '',
        contact: '',
        email: '',
        password: ''
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

    validerFormulaire() {
      if (!this.form.nom || !this.form.prenoms || !this.form.contact || !this.form.password) {
        this.afficherToast('Veuillez remplir tous les champs obligatoires')
        return false
      }
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.afficherToast('Adresse e-mail invalide')
        return false
      }
      return true
    },

    async sInscrire() {
      if (!this.validerFormulaire()) return

      this.chargement = true

      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: this.form.nom,
            prenoms: this.form.prenoms,
            contact: this.form.contact,
            email: this.form.email || null,
            password: this.form.password,
            role: 'user'
          })
        })

        const data = await response.json()

        if (response.ok) {
          this.afficherToast('Inscription réussie ! Redirection...', true)
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        } else {
          this.afficherToast(data.error || "Erreur lors de l'inscription")
        }

      } catch (err) {
        this.afficherToast('Erreur réseau ou serveur')
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
  background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
    url('https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
}
</style>