<template>
  <AdminLayout>

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">{{ admins.length }} administrateur(s)</p>
      <button
        @click="modalOuvert = true"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Ajouter un admin</span>
      </button>
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

    <!-- Chargement -->
    <div v-if="chargement" class="text-center py-16">
      <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p class="text-gray-600">Chargement...</p>
    </div>

    <!-- Liste admins -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div v-if="admins.length === 0" class="text-center py-16">
        <ShieldCheck class="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p class="text-gray-500">Aucun administrateur trouvé</p>
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Administrateur</th>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Inscription</th>
            <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="admin in admins" :key="admin.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">
                    {{ ((admin.nom?.charAt(0) || '') + (admin.prenoms?.charAt(0) || '')).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ admin.nom }} {{ admin.prenoms }}</p>
                  <p class="text-xs text-gray-400">{{ admin.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <Phone class="w-4 h-4 text-purple-400" />
                {{ admin.contact || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(admin.createdAt) }}
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="confirmerSuppression(admin)"
                :disabled="admin.id === authStore.user?.id"
                class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition mx-auto disabled:opacity-30 disabled:cursor-not-allowed"
                title="Supprimer"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal ajouter admin -->
    <Teleport to="body">
      <div
        v-if="modalOuvert"
        @click.self="modalOuvert = false"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 500px;">
          <div class="flex justify-between items-center p-6 border-b">
            <h3 class="text-xl font-bold text-gray-800">Ajouter un administrateur</h3>
            <button @click="modalOuvert = false" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom <span class="text-red-500">*</span></label>
                <input
                  v-model="formAdmin.nom"
                  type="text"
                  placeholder="Nom"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms <span class="text-red-500">*</span></label>
                <input
                  v-model="formAdmin.prenoms"
                  type="text"
                  placeholder="Prénoms"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact <span class="text-red-500">*</span></label>
              <input
                v-model="formAdmin.contact"
                type="tel"
                placeholder="+225 XX XX XX XX XX"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="formAdmin.email"
                type="email"
                placeholder="admin@email.com"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  v-model="formAdmin.password"
                  :type="voirPassword ? 'text' : 'password'"
                  placeholder="Mot de passe"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
                >
                <button
                  @click="voirPassword = !voirPassword"
                  type="button"
                  class="absolute right-3 top-3.5 text-gray-400"
                >
                  <Eye v-if="!voirPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 p-6 border-t">
            <button
              @click="modalOuvert = false"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              @click="ajouterAdmin"
              :disabled="chargementModal"
              class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader v-if="chargementModal" class="w-4 h-4 animate-spin" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal suppression -->
    <Teleport to="body">
      <div
        v-if="adminASupprimer"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 400px;" class="p-6 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
          <p class="text-gray-500 mb-6">
            Voulez-vous supprimer <strong>{{ adminASupprimer.nom }}</strong> des administrateurs ?
          </p>
          <div class="flex gap-3">
            <button
              @click="adminASupprimer = null"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              @click="supprimerAdmin"
              :disabled="chargementSuppression"
              class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader v-if="chargementSuppression" class="w-4 h-4 animate-spin" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/AdminLayout.vue'
import { useAuthStore } from '../../stores/authStore'
import {
  Plus, Trash2, Loader, X,
  CheckCircle, AlertCircle,
  ShieldCheck, Phone, Eye, EyeOff
} from 'lucide-vue-next'

export default {
  name: 'AdministrateursView',
  components: { AdminLayout, Plus, Trash2, Loader, X, CheckCircle, AlertCircle, ShieldCheck, Phone, Eye, EyeOff },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      admins: [],
      chargement: true,
      chargementModal: false,
      chargementSuppression: false,
      modalOuvert: false,
      voirPassword: false,
      adminASupprimer: null,
      formAdmin: { nom: '', prenoms: '', contact: '', email: '', password: '' },
      toast: { visible: false, message: '', succes: false }
    }
  },
  async mounted() {
    await this.chargerAdmins()
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async chargerAdmins() {
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/auth/getUsersByRole/admin',
          { headers: { 'Authorization': `Bearer ${this.authStore.token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          const liste = Array.isArray(data) ? data : data.users || []
          // Filtrer uniquement les admins
          this.admins = liste.filter(u => u.role === 'admin')
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    async ajouterAdmin() {
      if (!this.formAdmin.nom || !this.formAdmin.contact || !this.formAdmin.password) {
        this.afficherToast('Veuillez remplir tous les champs obligatoires')
        return
      }

      this.chargementModal = true

      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: this.formAdmin.nom,
            prenoms: this.formAdmin.prenoms,
            contact: this.formAdmin.contact,
            email: this.formAdmin.email,
            password: this.formAdmin.password,
            role: 'admin'
          })
        })

        if (response.ok) {
          this.afficherToast('Administrateur ajouté avec succès !', true)
          this.modalOuvert = false
          this.formAdmin = { nom: '', prenoms: '', contact: '', email: '', password: '' }
          await this.chargerAdmins()
        } else {
          const data = await response.json()
          this.afficherToast(data.error || 'Erreur lors de la création')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementModal = false
      }
    },

    confirmerSuppression(admin) { this.adminASupprimer = admin },

    async supprimerAdmin() {
      this.chargementSuppression = true

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/auth/delete_user/${this.adminASupprimer.id}`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${this.authStore.token}` } }
        )

        if (response.ok) {
          this.afficherToast('Administrateur supprimé !', true)
          this.adminASupprimer = null
          await this.chargerAdmins()
        } else {
          this.afficherToast('Erreur lors de la suppression')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementSuppression = false
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    }
  }
}
</script>
