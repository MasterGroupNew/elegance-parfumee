<template>
  <AdminLayout>

    <!-- Header + recherche -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input v-model="recherche" type="text" placeholder="Rechercher par nom, email ou contact..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
      </div>
      <div class="text-sm text-gray-500 flex items-center">
        {{ utilisateursFiltres.length }} utilisateur(s)
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible"
      :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
      class="border px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
      <CheckCircle v-if="toast.succes" class="w-5 h-5" />
      <AlertCircle v-else class="w-5 h-5" />
      <span>{{ toast.message }}</span>
    </div>

    <!-- Chargement -->
    <div v-if="chargement" class="text-center py-16">
      <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p class="text-gray-600">Chargement des utilisateurs...</p>
    </div>

    <!-- Aucun utilisateur -->
    <div v-else-if="utilisateursFiltres.length === 0" class="bg-white rounded-xl shadow-md p-16 text-center">
      <Users class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500">Aucun utilisateur trouvé</p>
    </div>

    <!-- Tableau utilisateurs -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Utilisateur</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rôle</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Inscription</th>
              <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in utilisateursFiltres" :key="user.id" class="hover:bg-gray-50 transition">
              <!-- Utilisateur -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-purple-600 font-bold text-sm">
                      {{ ((user.nom?.charAt(0) || '') + (user.prenoms?.charAt(0) || '')).toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-800 truncate">{{ user.nom }} {{ user.prenoms }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ user.email || '-' }}</p>
                  </div>
                </div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4">
                <p class="text-sm text-gray-600 flex items-center gap-2">
                  <Phone class="w-4 h-4 text-purple-400 flex-shrink-0" />
                  {{ user.contact || '-' }}
                </p>
              </td>

              <!-- Rôle -->
              <td class="px-6 py-4">
                <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'"
                  class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                </span>
              </td>

              <!-- Date inscription -->
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(user.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="ouvrirDetails(user)"
                    class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition"
                    title="Voir détails">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button @click="confirmerSuppression(user)" :disabled="user.role === 'admin'"
                    class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Supprimer">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal détails utilisateur -->
    <Teleport to="body">
      <div v-if="userSelectionne" @click.self="userSelectionne = null"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 480px;">

          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b">
            <h3 class="text-xl font-bold text-gray-800">Détails utilisateur</h3>
            <button @click="userSelectionne = null" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Contenu -->
          <div class="p-6">
            <!-- Avatar + nom -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 font-bold text-2xl">
                  {{ ((userSelectionne.nom?.charAt(0) || '') + (userSelectionne.prenoms?.charAt(0) || '')).toUpperCase()
                  }}
                </span>
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-800">{{ userSelectionne.nom }} {{ userSelectionne.prenoms }}</h4>
                <span
                  :class="userSelectionne.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'"
                  class="text-xs px-2 py-1 rounded-full">
                  {{ userSelectionne.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                </span>
              </div>
            </div>

            <!-- Infos -->
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail class="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p class="text-xs text-gray-400">Email</p>
                  <p class="font-medium text-gray-700">{{ userSelectionne.email || 'Non renseigné' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone class="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p class="text-xs text-gray-400">Téléphone</p>
                  <p class="font-medium text-gray-700">{{ userSelectionne.contact || 'Non renseigné' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar class="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p class="text-xs text-gray-400">Date d'inscription</p>
                  <p class="font-medium text-gray-700">{{ formatDate(userSelectionne.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t">
            <button @click="userSelectionne = null"
              class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
              Fermer
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Modal confirmation suppression -->
    <Teleport to="body">
      <div v-if="userASupprimer"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 400px;" class="p-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
            <p class="text-gray-500 mb-6">
              Voulez-vous supprimer <strong>{{ userASupprimer.nom }} {{ userASupprimer.prenoms }}</strong> ?
              Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button @click="userASupprimer = null"
                class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
                Annuler
              </button>
              <button @click="supprimerUtilisateur" :disabled="chargementSuppression"
                class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2">
                <Loader v-if="chargementSuppression" class="w-4 h-4 animate-spin" />
                Supprimer
              </button>
            </div>
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
  Loader,
  CheckCircle,
  AlertCircle,
  Users,
  Phone,
  Mail,
  Calendar,
  Eye,
  Trash2,
  X
} from 'lucide-vue-next'

export default {
  name: 'UtilisateursView',
  components: {
    AdminLayout,
    Loader,
    CheckCircle,
    AlertCircle,
    Users,
    Phone,
    Mail,
    Calendar,
    Eye,
    Trash2,
    X
  },
  data() {
    return {
      utilisateurs: [],
      chargement: true,
      chargementSuppression: false,
      recherche: '',
      userSelectionne: null,
      userASupprimer: null,
      toast: { visible: false, message: '', succes: false }
    }
  },
  computed: {
    utilisateursFiltres() {
      const q = this.recherche.toLowerCase()
      if (!q) return this.utilisateurs
      return this.utilisateurs.filter(u =>
        u.nom?.toLowerCase().includes(q) ||
        u.prenoms?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.contact?.includes(q)
      )
    }
  },
  async mounted() {
    await this.chargerUtilisateurs()
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async chargerUtilisateurs() {
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/auth/getUsersByRole/user'
        )
        if (response.ok) {
          const data = await response.json()
          this.utilisateurs = Array.isArray(data) ? data : []
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    ouvrirDetails(user) {
      this.userSelectionne = user
    },

    confirmerSuppression(user) {
      if (user.role === 'admin') return
      this.userASupprimer = user
    },

    async supprimerUtilisateur() {
      if (!this.utilisateurASupprimer) return
      this.chargementSuppression = true

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/auth/deleteUser/${this.utilisateurASupprimer.id}`,
          { method: 'DELETE' }
        )
        const data = await response.json()

        if (response.ok) {
          this.afficherToast('Utilisateur supprimé !', true)
          this.utilisateurASupprimer = null
          await this.chargerUtilisateurs()
        } else {
          this.afficherToast(data.message || 'Erreur lors de la suppression')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementSuppression = false
      }
    },
    async modifierUtilisateur() {
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/auth/updateUser/${this.form.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({
              nom: this.form.nom,
              prenoms: this.form.prenoms,
              contact: this.form.contact,
              email: this.form.email,
              role: this.form.role
            })
          }
        )
        if (response.ok) {
          this.afficherToast('Utilisateur modifié !', true)
          this.fermerModal()
          await this.chargerUtilisateurs()
        } else {
          const data = await response.json()
          this.afficherToast(data.message || 'Erreur modification')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
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
