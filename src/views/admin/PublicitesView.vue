<template>
  <AdminLayout>

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">{{ publicites.length }} publicité(s)</p>
      <button
        @click="ouvrirModal()"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Ajouter une pub
      </button>
    </div>

    <!-- Toast -->
    <div
      v-if="toast.visible"
      :class="toast.succes ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
      class="border px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
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

    <!-- Liste pubs -->
    <div v-else class="space-y-4">

      <div v-if="publicites.length === 0" class="bg-white rounded-xl shadow-md p-16 text-center">
        <Megaphone class="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p class="text-gray-500">Aucune publicité créée</p>
      </div>

      <div
        v-for="pub in publicites"
        :key="pub.id"
        class="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <!-- Aperçu couleur/texte -->
        <div
          class="w-full sm:w-48 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          :style="{ backgroundColor: pub.couleurFond || '#7c3aed' }"
        >
          <p class="text-white font-bold text-sm text-center px-2 truncate">
            {{ pub.texte }}
          </p>
        </div>

        <!-- Infos -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 truncate">{{ pub.texte }}</p>
          <p v-if="pub.lien" class="text-xs text-purple-500 truncate">{{ pub.lien }}</p>
          <p class="text-xs text-gray-400 mt-1">
            Du {{ formatDate(pub.dateDebut) }} au {{ formatDate(pub.dateFin) }}
          </p>
        </div>

        <!-- Statut toggle -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <button
            @click="toggleActif(pub)"
            :class="pub.actif ? 'bg-green-500' : 'bg-gray-300'"
            class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
          >
            <span
              :class="pub.actif ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
            ></span>
          </button>
          <span class="text-xs" :class="pub.actif ? 'text-green-600' : 'text-gray-400'">
            {{ pub.actif ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <button
            @click="ouvrirModal(pub)"
            class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="confirmerSuppression(pub)"
            class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>

    <!-- Modal Ajouter/Modifier -->
    <Teleport to="body">
      <div
        v-if="modalOuvert"
        @click.self="fermerModal"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;">

          <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
            <h3 class="text-xl font-bold text-gray-800">
              {{ modeEdition ? 'Modifier la pub' : 'Ajouter une pub' }}
            </h3>
            <button @click="fermerModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">

            <!-- Texte -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Texte de la pub <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.texte"
                type="text"
                placeholder="Ex: 🎉 Soldes -30% sur tous les parfums !"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>

            <!-- Lien -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lien (optionnel)</label>
              <input
                v-model="form.lien"
                type="text"
                placeholder="Ex: /collections ou https://..."
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>

            <!-- Couleur fond -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Couleur du bandeau</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="form.couleurFond"
                  type="color"
                  class="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                >
                <div class="flex gap-2">
                  <button
                    v-for="couleur in couleursSuggérées"
                    :key="couleur"
                    @click="form.couleurFond = couleur"
                    :style="{ backgroundColor: couleur }"
                    class="w-8 h-8 rounded-full border-2 transition"
                    :class="form.couleurFond === couleur ? 'border-gray-800 scale-110' : 'border-transparent'"
                  ></button>
                </div>
              </div>
            </div>

            <!-- Couleur texte -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Couleur du texte</label>
              <div class="flex gap-3">
                <button
                  @click="form.couleurTexte = '#ffffff'"
                  :class="form.couleurTexte === '#ffffff' ? 'ring-2 ring-purple-500' : ''"
                  class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm"
                >
                  Blanc
                </button>
                <button
                  @click="form.couleurTexte = '#1f2937'"
                  :class="form.couleurTexte === '#1f2937' ? 'ring-2 ring-purple-500' : ''"
                  class="flex items-center gap-2 px-4 py-2 bg-white border text-gray-800 rounded-lg text-sm"
                >
                  Noir
                </button>
              </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input
                  v-model="form.dateDebut"
                  type="date"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  v-model="form.dateFin"
                  type="date"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
            </div>

            <!-- Aperçu -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Aperçu du bandeau</label>
              <div
                class="w-full py-3 px-4 rounded-lg text-center font-medium text-sm transition"
                :style="{ backgroundColor: form.couleurFond, color: form.couleurTexte }"
              >
                {{ form.texte || 'Texte de votre publicité...' }}
              </div>
            </div>

            <!-- Actif -->
            <div class="flex items-center gap-3">
              <button
                @click="form.actif = !form.actif"
                :class="form.actif ? 'bg-green-500' : 'bg-gray-300'"
                class="relative w-12 h-6 rounded-full transition-colors focus:outline-none"
              >
                <span
                  :class="form.actif ? 'translate-x-6' : 'translate-x-1'"
                  class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform"
                ></span>
              </button>
              <span class="text-sm text-gray-700">
                {{ form.actif ? 'Pub active (visible sur le site)' : 'Pub inactive (masquée)' }}
              </span>
            </div>

          </div>

          <div class="flex gap-3 p-6 border-t">
            <button
              @click="fermerModal"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              @click="sauvegarder"
              :disabled="chargementModal"
              class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader v-if="chargementModal" class="w-4 h-4 animate-spin" />
              {{ modeEdition ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Modal suppression -->
    <Teleport to="body">
      <div
        v-if="pubASupprimer"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 400px;" class="p-6 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer cette pub ?</h3>
          <p class="text-gray-500 mb-6">Cette action est irréversible.</p>
          <div class="flex gap-3">
            <button
              @click="pubASupprimer = null"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              @click="supprimerPub"
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
import { Plus, Pencil, Trash2, Loader, X, CheckCircle, AlertCircle, Megaphone } from 'lucide-vue-next'

export default {
  name: 'PublicitesView',
  components: { AdminLayout, Plus, Pencil, Trash2, Loader, X, CheckCircle, AlertCircle, Megaphone },
  data() {
    return {
      publicites: [],
      chargement: true,
      chargementModal: false,
      chargementSuppression: false,
      modalOuvert: false,
      modeEdition: false,
      pubASupprimer: null,
      couleursSuggérées: ['#7c3aed', '#dc2626', '#ea580c', '#16a34a', '#0284c7', '#db2777'],
      form: {
        texte: '',
        lien: '',
        couleurFond: '#7c3aed',
        couleurTexte: '#ffffff',
        dateDebut: '',
        dateFin: '',
        actif: true
      },
      toast: { visible: false, message: '', succes: false }
    }
  },
  async mounted() {
    await this.chargerPublicites()
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async chargerPublicites() {
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/publicites/get_publicites',
          { headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          this.publicites = Array.isArray(data) ? data : data.publicites || []
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    ouvrirModal(pub = null) {
      if (pub) {
        this.modeEdition = true
        this.form = {
          id: pub.id,
          texte: pub.texte,
          lien: pub.lien || '',
          couleurFond: pub.couleurFond || '#7c3aed',
          couleurTexte: pub.couleurTexte || '#ffffff',
          dateDebut: pub.dateDebut?.split('T')[0] || '',
          dateFin: pub.dateFin?.split('T')[0] || '',
          actif: pub.actif ?? true
        }
      } else {
        this.modeEdition = false
        this.form = {
          texte: '', lien: '',
          couleurFond: '#7c3aed', couleurTexte: '#ffffff',
          dateDebut: '', dateFin: '', actif: true
        }
      }
      this.modalOuvert = true
    },

    fermerModal() { this.modalOuvert = false },

    async sauvegarder() {
      if (!this.form.texte) {
        this.afficherToast('Le texte de la pub est obligatoire')
        return
      }

      this.chargementModal = true
      const authStore = useAuthStore()

      try {
        const url = this.modeEdition
          ? `https://luxeparfum-backend.onrender.com/api/publicites/update_publicite/${this.form.id}`
          : 'https://luxeparfum-backend.onrender.com/api/publicites/add_publicite'

        const response = await fetch(url, {
          method: this.modeEdition ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({
            texte: this.form.texte,
            lien: this.form.lien,
            couleurFond: this.form.couleurFond,
            couleurTexte: this.form.couleurTexte,
            dateDebut: this.form.dateDebut,
            dateFin: this.form.dateFin,
            actif: this.form.actif
          })
        })

        if (response.ok) {
          this.afficherToast(
            this.modeEdition ? 'Pub modifiée !' : 'Pub ajoutée !', true
          )
          this.fermerModal()
          await this.chargerPublicites()
        } else {
          this.afficherToast('Erreur lors de la sauvegarde')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementModal = false
      }
    },

    async toggleActif(pub) {
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/publicites/update_publicite/${pub.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ ...pub, actif: !pub.actif })
          }
        )
        if (response.ok) {
          pub.actif = !pub.actif
          this.afficherToast(pub.actif ? 'Pub activée !' : 'Pub désactivée !', true)
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      }
    },

    confirmerSuppression(pub) { this.pubASupprimer = pub },

    async supprimerPub() {
      this.chargementSuppression = true
      const authStore = useAuthStore()
      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/publicites/delete_publicite/${this.pubASupprimer.id}`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )
        if (response.ok) {
          this.afficherToast('Pub supprimée !', true)
          this.pubASupprimer = null
          await this.chargerPublicites()
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementSuppression = false
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  }
}
</script>
