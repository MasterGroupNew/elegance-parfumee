<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container mx-auto max-w-4xl">

      <!-- Header profil -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-6">
        <div class="flex items-center space-x-6">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <User class="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ authStore.user?.nom }} {{ authStore.user?.prenoms }}
            </h1>
            <p class="text-gray-500 flex items-center gap-2 mt-1">
              <Mail class="w-4 h-4" />
              {{ authStore.user?.email || 'Email non renseigné' }}
            </p>
            <p class="text-gray-500 flex items-center gap-2 mt-1">
              <Phone class="w-4 h-4" />
              {{ authStore.user?.contact || 'Contact non renseigné' }}
            </p>
          </div>
        </div>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Modifier les infos -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Pencil class="w-5 h-5 text-purple-600" />
            Modifier mes informations
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="form.nom"
                type="text"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms</label>
              <input
                v-model="form.prenoms"
                type="text"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                v-model="form.contact"
                type="text"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>

            <button
              @click="mettreAJour"
              :disabled="chargement"
              class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader v-if="chargement" class="w-4 h-4 animate-spin" />
              {{ chargement ? 'Mise à jour...' : 'Enregistrer les modifications' }}
            </button>
          </div>
        </div>

        <!-- Changer mot de passe -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Lock class="w-5 h-5 text-purple-600" />
            Changer mon mot de passe
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <div class="relative">
                <input
                  v-model="password.nouveau"
                  :type="voirPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                <button
                  @click="voirPassword = !voirPassword"
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  <Eye v-if="!voirPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div class="relative">
                <input
                  v-model="password.confirm"
                  :type="voirConfirm ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                <button
                  @click="voirConfirm = !voirConfirm"
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  <Eye v-if="!voirConfirm" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>

              <p
                v-if="password.confirm"
                :class="password.nouveau === password.confirm ? 'text-green-600' : 'text-red-500'"
                class="text-xs mt-1 flex items-center gap-1"
              >
                <CheckCircle v-if="password.nouveau === password.confirm" class="w-3 h-3" />
                <AlertCircle v-else class="w-3 h-3" />
                {{ password.nouveau === password.confirm ? 'Les mots de passe correspondent' : 'Ne correspondent pas' }}
              </p>
            </div>

            <button
              @click="changerMotDePasse"
              :disabled="chargementPassword"
              class="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader v-if="chargementPassword" class="w-4 h-4 animate-spin" />
              {{ chargementPassword ? 'Modification...' : 'Changer le mot de passe' }}
            </button>
          </div>
        </div>

      </div>

      <!-- Déconnexion -->
      <div class="bg-white rounded-xl shadow-md p-6 mt-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-800">Déconnexion</h3>
            <p class="text-sm text-gray-500">Vous serez redirigé vers la page d'accueil</p>
          </div>
          <button
            @click="seDeconnecter"
            class="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            <LogOut class="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import {
  User, Mail, Phone,
  Pencil, Lock, LogOut,
  Eye, EyeOff, Loader,
  CheckCircle, AlertCircle
} from 'lucide-vue-next'

export default {
  name: 'ProfilView',
  components: {
    User, Mail, Phone,
    Pencil, Lock, LogOut,
    Eye, EyeOff, Loader,
    CheckCircle, AlertCircle
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      form: { nom: '', prenoms: '', email: '', contact: '' },
      password: { nouveau: '', confirm: '' },
      chargement: false,
      chargementPassword: false,
      voirPassword: false,
      voirConfirm: false,
      toast: { visible: false, message: '', succes: false }
    }
  },
  mounted() {
    const user = this.authStore.user
    if (user) {
      this.form.nom = user.nom || ''
      this.form.prenoms = user.prenoms || ''
      this.form.email = user.email || ''
      this.form.contact = user.contact || ''
    }
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async mettreAJour() {
      if (!this.form.nom || !this.form.prenoms) {
        this.afficherToast('Nom et prénoms sont obligatoires')
        return
      }

      this.chargement = true
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authStore.token}`
          },
          body: JSON.stringify(this.form)
        })

        const data = await response.json()

        if (response.ok) {
          this.authStore.connexion(this.authStore.token, { ...this.authStore.user, ...this.form })
          this.afficherToast('Profil mis à jour avec succès !', true)
        } else {
          this.afficherToast(data.error || 'Erreur lors de la mise à jour')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau, réessayez plus tard')
      } finally {
        this.chargement = false
      }
    },

    async changerMotDePasse() {
      if (!this.password.nouveau) {
        this.afficherToast('Veuillez entrer un nouveau mot de passe')
        return
      }
      if (this.password.nouveau.length < 6) {
        this.afficherToast('Le mot de passe doit contenir au moins 6 caractères')
        return
      }
      if (this.password.nouveau !== this.password.confirm) {
        this.afficherToast('Les mots de passe ne correspondent pas')
        return
      }

      this.chargementPassword = true
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/resetPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: this.authStore.user?.email || this.authStore.user?.contact,
            newPassword: this.password.nouveau
          })
        })

        const data = await response.json()

        if (response.ok) {
          this.afficherToast('Mot de passe modifié avec succès !', true)
          this.password.nouveau = ''
          this.password.confirm = ''
        } else {
          this.afficherToast(data.error || 'Erreur lors de la modification')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau, réessayez plus tard')
      } finally {
        this.chargementPassword = false
      }
    },

    seDeconnecter() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.authStore.deconnexion()
        this.$router.push('/')
      }
    }
  }
}
</script>
