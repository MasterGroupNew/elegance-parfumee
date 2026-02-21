<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4" style="background-color: #faf5f0;">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 md:p-12">

      <!-- Logo -->
      <div class="text-center mb-8">
        <i class="fas fa-bottle-droplet text-4xl text-purple-600 mb-3"></i>
        <h2 class="text-3xl font-medium text-gray-800 mb-2">Mot de passe oublié</h2>
        <p class="text-gray-500 text-sm">{{ sousTitre }}</p>
      </div>

      <!-- Toast -->
      <div
        v-if="toast.visible"
        :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
        class="border px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
      >
        <i :class="toast.succes ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        <span>{{ toast.message }}</span>
      </div>

      <!-- ETAPE 1 : Email ou téléphone -->
      <div v-if="etape === 1" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email ou numéro de téléphone
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-user text-gray-400"></i>
            </div>
            <input
              v-model="form.identifier"
              type="text"
              placeholder="email@example.com ou 07 07 07 07 07"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>
          <p class="text-xs text-gray-400 mt-1">
            <i class="fas fa-info-circle mr-1"></i>
            Entrez l'email ou le contact associé à votre compte
          </p>
        </div>

        <button
          @click="verifierIdentifiant"
          :disabled="chargement"
          class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center"
        >
          <i v-if="chargement" class="fas fa-spinner fa-spin mr-2"></i>
          {{ chargement ? 'Vérification...' : 'Continuer' }}
        </button>
      </div>

      <!-- ETAPE 2 : Nouveau mot de passe -->
      <div v-if="etape === 2" class="space-y-5">

        <!-- Info compte trouvé -->
        <div class="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm">
          <i class="fas fa-user-check mr-2"></i>
          Compte trouvé pour <strong>{{ form.identifier }}</strong>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-lock text-gray-400"></i>
            </div>
            <input
              v-model="form.newPassword"
              :type="voirPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
            <button @click="voirPassword = !voirPassword" type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i :class="voirPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-lock text-gray-400"></i>
            </div>
            <input
              v-model="form.confirmPassword"
              :type="voirConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
            <button @click="voirConfirm = !voirConfirm" type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i :class="voirConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>
          <!-- Indicateur de correspondance -->
          <p
            v-if="form.confirmPassword"
            :class="form.newPassword === form.confirmPassword ? 'text-green-600' : 'text-red-500'"
            class="text-xs mt-1"
          >
            <i :class="form.newPassword === form.confirmPassword ? 'fas fa-check' : 'fas fa-times'" class="mr-1"></i>
            {{ form.newPassword === form.confirmPassword ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
          </p>
        </div>

        <button
          @click="reinitialiser"
          :disabled="chargement"
          class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center"
        >
          <i v-if="chargement" class="fas fa-spinner fa-spin mr-2"></i>
          {{ chargement ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
        </button>

        <button @click="etape = 1" class="w-full py-2 text-sm text-gray-500 hover:text-purple-600 transition">
          <i class="fas fa-arrow-left mr-1"></i>Retour
        </button>
      </div>

      <!-- ETAPE 3 : Succès -->
      <div v-if="etape === 3" class="text-center space-y-4">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-check text-4xl text-green-600"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Mot de passe réinitialisé !</h3>
        <p class="text-gray-500">Votre mot de passe a été modifié avec succès.</p>
        <RouterLink
          to="/login"
          class="inline-block w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition text-center"
        >
          <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
        </RouterLink>
      </div>

      <!-- Retour connexion -->
      <div v-if="etape !== 3" class="mt-6 text-center">
        <RouterLink to="/login" class="text-sm text-purple-600 hover:text-purple-800">
          <i class="fas fa-arrow-left mr-1"></i>Retour à la connexion
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'MotDePasseOublieView',
  data() {
    return {
      etape: 1,
      form: {
        identifier: '',
        newPassword: '',
        confirmPassword: ''
      },
      chargement: false,
      voirPassword: false,
      voirConfirm: false,
      toast: {
        visible: false,
        message: '',
        succes: false
      }
    }
  },
  computed: {
    sousTitre() {
      if (this.etape === 1) return 'Entrez votre email ou numéro de téléphone'
      if (this.etape === 2) return 'Choisissez un nouveau mot de passe'
      return 'Opération réussie'
    }
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async verifierIdentifiant() {
      if (!this.form.identifier) {
        this.afficherToast('Veuillez entrer votre email ou numéro de téléphone')
        return
      }

      this.chargement = true

      try {
        // On envoie une requête pour vérifier si le compte existe
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/resetPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: this.form.identifier,
            newPassword: 'VERIFY_ONLY'
          })
        })

        if (response.status === 404) {
          this.afficherToast('Aucun compte associé à cet identifiant')
          return
        }

        // Compte trouvé → étape 2
        this.etape = 2
        this.afficherToast('Compte trouvé ! Choisissez un nouveau mot de passe', true)

      } catch (error) {
        this.afficherToast('Erreur réseau, réessayez plus tard')
      } finally {
        this.chargement = false
      }
    },

    async reinitialiser() {
      if (!this.form.newPassword) {
        this.afficherToast('Veuillez entrer un nouveau mot de passe')
        return
      }
      if (this.form.newPassword.length < 6) {
        this.afficherToast('Le mot de passe doit contenir au moins 6 caractères')
        return
      }
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.afficherToast('Les mots de passe ne correspondent pas')
        return
      }

      this.chargement = true

      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/resetPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: this.form.identifier,
            newPassword: this.form.newPassword
          })
        })

        const data = await response.json()

        if (response.ok) {
          this.etape = 3
        } else {
          this.afficherToast(data.error || 'Erreur lors de la réinitialisation')
        }

      } catch (error) {
        this.afficherToast('Erreur réseau, réessayez plus tard')
      } finally {
        this.chargement = false
      }
    }
  }
}
</script>