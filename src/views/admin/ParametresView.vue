<template>
  <AdminLayout>
    <div class="max-w-2xl mx-auto space-y-6">

      <!-- Toast -->
      <div
        v-if="toast.visible"
        :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
        class="border px-4 py-3 rounded-lg flex items-center space-x-2"
      >
        <CheckCircle v-if="toast.succes" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
        <span>{{ toast.message }}</span>
      </div>

      <!-- Modifier profil -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User class="w-6 h-6 text-purple-600" />
          Modifier mon profil
        </h2>

        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-2xl">{{ initiales }}</span>
          </div>
          <div>
            <p class="font-bold text-gray-800 text-lg">{{ authStore.user?.nom }} {{ authStore.user?.prenoms }}</p>
            <p class="text-sm text-purple-600">Administrateur</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="form.nom"
                type="text"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms</label>
              <input
                v-model="form.prenoms"
                type="text"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              v-model="form.contact"
              type="tel"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
          </div>

          <button
            @click="sauvegarderProfil"
            :disabled="chargementProfil"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Loader v-if="chargementProfil" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <!-- Changer mot de passe -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock class="w-6 h-6 text-purple-600" />
          Changer le mot de passe
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div class="relative">
              <input
                v-model="formPassword.nouveau"
                :type="voirPassword ? 'text' : 'password'"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
              >
              <button @click="voirPassword = !voirPassword" type="button" class="absolute right-3 top-3.5 text-gray-400">
                <Eye v-if="!voirPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              v-model="formPassword.confirmation"
              type="password"
              placeholder="Confirmer le mot de passe"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
            <!-- Indicateur correspondance -->
            <p
              v-if="formPassword.confirmation"
              :class="passwordMatch ? 'text-green-600' : 'text-red-500'"
              class="text-xs mt-1 flex items-center gap-1"
            >
              <CheckCircle v-if="passwordMatch" class="w-3 h-3" />
              <AlertCircle v-else class="w-3 h-3" />
              {{ passwordMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
            </p>
          </div>

          <button
            @click="changerPassword"
            :disabled="chargementPassword || !passwordMatch || !formPassword.nouveau"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Loader v-if="chargementPassword" class="w-4 h-4 animate-spin" />
            <Lock v-else class="w-4 h-4" />
            Changer le mot de passe
          </button>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/AdminLayout.vue'
import { useAuthStore } from '../../stores/authStore'
import {
  User, Lock, Save, Eye, EyeOff,
  Loader, CheckCircle, AlertCircle
} from 'lucide-vue-next'

export default {
  name: 'ParametresView',
  components: { AdminLayout, User, Lock, Save, Eye, EyeOff, Loader, CheckCircle, AlertCircle },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      form: { nom: '', prenoms: '', email: '', contact: '' },
      formPassword: { nouveau: '', confirmation: '' },
      chargementProfil: false,
      chargementPassword: false,
      voirPassword: false,
      toast: { visible: false, message: '', succes: false }
    }
  },
  computed: {
    initiales() {
      const user = this.authStore.user
      if (!user) return '?'
      return ((user.nom?.charAt(0) || '') + (user.prenoms?.charAt(0) || '')).toUpperCase()
    },
    passwordMatch() {
      return this.formPassword.nouveau === this.formPassword.confirmation
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

    async sauvegarderProfil() {
      this.chargementProfil = true
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authStore.token}`
          },
          body: JSON.stringify({
            nom: this.form.nom,
            prenoms: this.form.prenoms,
            email: this.form.email,
            contact: this.form.contact
          })
        })

        if (response.ok) {
          const data = await response.json()
          // Mettre à jour le store
          this.authStore.user = { ...this.authStore.user, ...this.form }
          this.afficherToast('Profil mis à jour avec succès !', true)
        } else {
          this.afficherToast('Erreur lors de la mise à jour')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementProfil = false
      }
    },

    async changerPassword() {
      if (this.formPassword.nouveau.length < 6) {
        this.afficherToast('Le mot de passe doit contenir au moins 6 caractères')
        return
      }

      this.chargementPassword = true
      const identifier = this.authStore.user?.email || this.authStore.user?.contact

      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/resetPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier,
            newPassword: this.formPassword.nouveau
          })
        })

        if (response.ok) {
          this.afficherToast('Mot de passe changé avec succès !', true)
          this.formPassword = { nouveau: '', confirmation: '' }
        } else {
          this.afficherToast('Erreur lors du changement de mot de passe')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementPassword = false
      }
    }
  }
}
</script>
