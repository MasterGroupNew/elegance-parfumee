<template>
  <AdminLayout>

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">{{ categories.length }} catégories au total</p>
      <button
        @click="ouvrirModal()"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Ajouter une catégorie</span>
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
      <p class="text-gray-600">Chargement des catégories...</p>
    </div>

    <!-- Grille catégories -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-xl shadow-md p-5 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Tag class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ cat.nom }}</p>
            <p class="text-xs text-gray-400">ID : {{ cat.id }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="ouvrirModal(cat)"
            class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="confirmerSuppression(cat)"
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
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 450px;">
          <div class="flex justify-between items-center p-6 border-b">
            <h3 class="text-xl font-bold text-gray-800">
              {{ modeEdition ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}
            </h3>
            <button @click="fermerModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom de la catégorie <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formCategorie.nom"
                type="text"
                placeholder="Ex: Eau de parfum, Cologne..."
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="formCategorie.description"
                rows="3"
                placeholder="Description de la catégorie..."
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              ></textarea>
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
              @click="sauvegarderCategorie"
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
        v-if="categorieASupprimer"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 400px;" class="p-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
            <p class="text-gray-500 mb-6">
              Voulez-vous supprimer <strong>{{ categorieASupprimer.nom }}</strong> ? Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button
                @click="categorieASupprimer = null"
                class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Annuler
              </button>
              <button
                @click="supprimerCategorie"
                :disabled="chargementSuppression"
                class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
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
import { Plus, Pencil, Trash2, Loader, X, CheckCircle, AlertCircle, Tag } from 'lucide-vue-next'

export default {
  name: 'CategoriesView',
  components: { AdminLayout, Plus, Pencil, Trash2, Loader, X, CheckCircle, AlertCircle, Tag },
  data() {
    return {
      categories: [],
      chargement: true,
      chargementModal: false,
      chargementSuppression: false,
      modalOuvert: false,
      modeEdition: false,
      categorieASupprimer: null,
      formCategorie: { nom: '', description: '' },
      toast: { visible: false, message: '', succes: false }
    }
  },
  async mounted() {
    await this.chargerCategories()
  },
  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    async chargerCategories() {
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/categories/get_categories')
        if (response.ok) {
          const data = await response.json()
          this.categories = Array.isArray(data) ? data : data.categories || []
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    ouvrirModal(categorie = null) {
      if (categorie) {
        this.modeEdition = true
        this.formCategorie = { id: categorie.id, nom: categorie.nom, description: categorie.description || '' }
      } else {
        this.modeEdition = false
        this.formCategorie = { nom: '', description: '' }
      }
      this.modalOuvert = true
    },

    fermerModal() { this.modalOuvert = false },

    async sauvegarderCategorie() {
      if (!this.formCategorie.nom) {
        this.afficherToast('Veuillez entrer un nom de catégorie')
        return
      }

      this.chargementModal = true
      const authStore = useAuthStore()

      try {
        const url = this.modeEdition
          ? `https://luxeparfum-backend.onrender.com/api/categories/update_category/${this.formCategorie.id}`
          : 'https://luxeparfum-backend.onrender.com/api/categories/add_category'

        const response = await fetch(url, {
          method: this.modeEdition ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({
            nom: this.formCategorie.nom,
            description: this.formCategorie.description
          })
        })

        if (response.ok) {
          this.afficherToast(
            this.modeEdition ? 'Catégorie modifiée !' : 'Catégorie ajoutée !', true
          )
          this.fermerModal()
          await this.chargerCategories()
        } else {
          const data = await response.json()
          this.afficherToast(data.error || 'Erreur lors de la sauvegarde')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementModal = false
      }
    },

    confirmerSuppression(cat) { this.categorieASupprimer = cat },

    async supprimerCategorie() {
      this.chargementSuppression = true
      const authStore = useAuthStore()

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/categories/delete_category/${this.categorieASupprimer.id}`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${authStore.token}` } }
        )

        if (response.ok) {
          this.afficherToast('Catégorie supprimée !', true)
          this.categorieASupprimer = null
          await this.chargerCategories()
        } else {
          this.afficherToast('Erreur lors de la suppression')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
      } finally {
        this.chargementSuppression = false
      }
    }
  }
}
</script>
