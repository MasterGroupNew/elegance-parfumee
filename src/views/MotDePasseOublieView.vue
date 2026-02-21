<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4" style="background-color: #faf5f0;">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 md:p-12">

      <!-- Logo -->
      <div class="text-center mb-8">
        <Droplets class="w-10 h-10 text-purple-600 mx-auto mb-3" />
        <h2 class="text-3xl font-medium text-gray-800 mb-2">Mot de passe oublié</h2>
        <p class="text-gray-500 text-sm">{{ sousTitre }}</p>
      </div>

      <!-- Toast -->
      <div
        v-if="toast.visible"
        :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
        class="border px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
      >
        <CheckCircle v-if="toast.succes" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
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
              <User class="w-4 h-4 text-gray-400" />
            </div>
            <input
              v-model="form.identifier"
              type="text"
              placeholder="email@example.com ou 07 07 07 07 07"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
          </div>
          <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Info class="w-3 h-3" />
            Entrez l'email ou le contact associé à votre compte
          </p>
        </div>

        <button
          @click="verifierIdentifiant"
          :disabled="chargement"
          class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader v-if="chargement" class="w-4 h-4 animate-spin" />
          {{ chargement ? 'Vérification...' : 'Continuer' }}
        </button>
      </div>

      <!-- ETAPE 2 : Nouveau mot de passe -->
      <div v-if="etape === 2" class="space-y-5">

        <!-- Info compte trouvé -->
        <div class="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <UserCheck class="w-4 h-4 flex-shrink-0" />
          Compte trouvé pour <strong>{{ form.identifier }}</strong>
        </div>

        <!-- Nouveau mot de passe -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="w-4 h-4 text-gray-400" />
            </div>
            <input
              v-model="form.newPassword"
              :type="voirPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
            <button
              @click="voirPassword = !voirPassword"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!voirPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Confirmer mot de passe -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="w-4 h-4 text-gray-400" />
            </div>
            <input
              v-model="form.confirmPassword"
              :type="voirConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            >
            <button
              @click="voirConfirm = !voirConfirm"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!voirConfirm" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>

          <!-- Indicateur correspondance -->
          <p
            v-if="form.confirmPassword"
            :class="form.newPassword === form.confirmPassword ? 'text-green-600' : 'text-red-500'"
            class="text-xs mt-1 flex items-center gap-1"
          >
            <CheckCircle v-if="form.newPassword === form.confirmPassword" class="w-3 h-3" />
            <AlertCircle v-else class="w-3 h-3" />
            {{ form.newPassword === form.confirmPassword ? 'Les mots de passe correspondent' : 'Ne correspondent pas' }}
          </p>
        </div>

        <button
          @click="reinitialiser"
          :disabled="chargement"
          class="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader v-if="chargement" class="w-4 h-4 animate-spin" />
          {{ chargement ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
        </button>

        <button
          @click="etape = 1"
          class="w-full py-2 text-sm text-gray-500 hover:text-purple-600 transition flex items-center justify-center gap-1"
        >
          <ArrowLeft class="w-3 h-3" />Retour
        </button>
      </div>

      <!-- ETAPE 3 : Succès -->
      <div v-if="etape === 3" class="text-center space-y-4">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check class="w-10 h-10 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-800">Mot de passe réinitialisé !</h3>
        <p class="text-gray-500">Votre mot de passe a été modifié avec succès.</p>
        <RouterLink
          to="/login"
          class="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition"
        >
          <LogIn class="w-4 h-4" />Se connecter
        </RouterLink>
      </div>

      <!-- Retour connexion -->
      <div v-if="etape !== 3" class="mt-6 text-center">
        <RouterLink
          to="/login"
          class="text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1"
        >
          <ArrowLeft class="w-3 h-3" />Retour à la connexion
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script>
import {
  Droplets, User, UserCheck, Lock,
  Eye, EyeOff, Loader, CheckCircle,
  AlertCircle, ArrowLeft, Check, LogIn, Info
} from 'lucide-vue-next'

export default {
  name: 'MotDePasseOublieView',
  components: {
    Droplets, User, UserCheck, Lock,
    Eye, EyeOff, Loader, CheckCircle,
    AlertCircle, ArrowLeft, Check, LogIn, Info
  },
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
      toast: { visible: false, message: '', succes: false }
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

    // ✅ Vérifie si le compte existe
    async verifierIdentifiant() {
      if (!this.form.identifier) {
        this.afficherToast('Veuillez entrer votre email ou numéro de téléphone')
        return
      }

      this.chargement = true
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/auth/resetPassword',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: this.form.identifier,
              newPassword: 'CHECK_ONLY'
            })
          }
        )

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

    // ✅ Réinitialise le mot de passe
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
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/auth/resetPassword',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: this.form.identifier,  // ✅ un seul champ
              newPassword: this.form.newPassword
            })
          }
        )

        const data = await response.json()

        if (response.ok) {
          this.etape = 3
        } else {
          this.afficherToast(data.error || data.message || 'Erreur lors de la réinitialisation')
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
