<template>
  <AdminLayout>

    <!-- Header + Bouton ajouter -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-gray-500 text-sm">{{ produits.length }} produits au total</p>
      </div>
      <button
        @click="ouvrirModal()"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center space-x-2"
      >
        <Plus class="w-4 h-4" />
        <span>Ajouter un produit</span>
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
      <p class="text-gray-600">Chargement des produits...</p>
    </div>

    <!-- Tableau produits -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Produit</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Catégorie</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Genre</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Prix</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
              <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="produit in produits"
              :key="produit.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <img
                    :src="produit.imagePath || 'https://via.placeholder.com/50'"
                    :alt="produit.nom"
                    class="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    @error="$event.target.src = 'https://via.placeholder.com/50'"
                  >
                  <div class="min-w-0">
                    <p class="font-medium text-gray-800 truncate max-w-[180px]">{{ produit.nom }}</p>
                    <p class="text-xs text-gray-400 truncate max-w-[180px]">{{ produit.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ produit.categorie?.nom || produit.Category?.nom || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  :class="produit.genre === 'Homme' ? 'bg-blue-100 text-blue-700' : produit.genre === 'Femme' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ produit.genre }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">
                {{ produit.prix.toLocaleString('fr-FR') }} FCFA
              </td>
              <td class="px-6 py-4">
                <span
                  :class="produit.quantite > 10 ? 'bg-green-100 text-green-700' : produit.quantite > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ produit.quantite > 0 ? produit.quantite + ' en stock' : 'Rupture' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="ouvrirModal(produit)"
                    class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmerSuppression(produit)"
                    class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Ajouter/Modifier -->
    <Teleport to="body">
      <div
        v-if="modalOuvert"
        @click.self="fermerModal"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;">

          <!-- Header modal -->
          <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
            <h3 class="text-xl font-bold text-gray-800">
              {{ modeEdition ? 'Modifier le produit' : 'Ajouter un produit' }}
            </h3>
            <button @click="fermerModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Formulaire -->
          <div class="p-6 space-y-4">

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formProduit.nom"
                type="text"
                placeholder="Ex: Dior Sauvage"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="formProduit.description"
                rows="3"
                placeholder="Description du produit..."
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Prix (FCFA) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formProduit.prix"
                  type="number"
                  placeholder="Ex: 15000"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quantité <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formProduit.quantite"
                  type="number"
                  placeholder="Ex: 50"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Genre <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formProduit.genre"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Unisexe">Unisexe</option>
                </select>
              </div>

              <!-- ✅ NOUVEAU : Select catégorie dynamique -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formProduit.categorie"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">
                    {{ chargementCategories ? 'Chargement...' : 'Sélectionner une catégorie' }}
                  </option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.nom"
                  >
                    {{ cat.nom }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>

              <!-- Tabs URL / Upload -->
              <div class="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
                <button
                  @click="modeImage = 'url'; sourceChoisie = null; aperçuUpload = null"
                  :class="modeImage === 'url' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'"
                  class="flex-1 py-2 text-sm font-medium transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <LinkIcon class="w-4 h-4" />URL
                </button>
                <button
                  @click="modeImage = 'upload'"
                  :class="modeImage === 'upload' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'"
                  class="flex-1 py-2 text-sm font-medium transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <Upload class="w-4 h-4" />Upload
                </button>
              </div>

              <!-- Mode URL -->
              <div v-if="modeImage === 'url'">
                <input
                  v-model="formProduit.imagePath"
                  type="text"
                  placeholder="https://..."
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                <div v-if="formProduit.imagePath" class="mt-2">
                  <img
                    :src="formProduit.imagePath"
                    alt="Aperçu"
                    class="w-20 h-20 object-cover rounded-lg border"
                    @error="formProduit.imagePath = ''"
                  >
                </div>
              </div>

              <!-- Mode Upload -->
              <div v-else>

                <!-- ÉTAPE 1 : Choisir la source -->
                <div v-if="!sourceChoisie && !aperçuUpload">
                  <p class="text-sm text-gray-500 text-center mb-3">Comment voulez-vous ajouter l'image ?</p>
                  <div class="grid grid-cols-2 gap-3">

                    <!-- Galerie -->
                    <button
                      @click="sourceChoisie = 'galerie'"
                      type="button"
                      class="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition"
                    >
                      <ImagePlus class="w-7 h-7 text-gray-400 mb-2" />
                      <p class="text-sm font-medium text-gray-600">Galerie</p>
                      <p class="text-xs text-gray-400 mt-1">Depuis mes photos</p>
                    </button>

                    <!-- Caméra -->
                    <button
                      @click="ouvrirCameraModal"
                      type="button"
                      class="flex flex-col items-center justify-center h-28 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
                    >
                      <Camera class="w-7 h-7 text-purple-400 mb-2" />
                      <p class="text-sm font-medium text-purple-600">Caméra</p>
                      <p class="text-xs text-gray-400 mt-1">Prendre une photo</p>
                    </button>

                  </div>
                </div>

                <!-- ÉTAPE 2 : Input Galerie -->
                <div v-if="sourceChoisie === 'galerie' && !aperçuUpload">
                  <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-400 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition overflow-hidden">
                    <ImagePlus class="w-7 h-7 text-purple-500 mb-2" />
                    <p class="text-sm font-medium text-purple-600">Appuyez pour ouvrir la galerie</p>
                    <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 2MB)</p>
                    <input
                      ref="inputGalerie"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onImageSelected"
                    >
                  </label>
                  <button
                    @click="sourceChoisie = null"
                    type="button"
                    class="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
                  >
                    <X class="w-3 h-3" />Revenir au choix
                  </button>
                </div>

                <!-- ÉTAPE 3 : Aperçu après sélection (galerie ou caméra) -->
                <div v-if="aperçuUpload">
                  <div class="relative mb-3">
                    <img
                      :src="aperçuUpload"
                      alt="Aperçu"
                      class="w-full h-40 object-contain rounded-lg border bg-gray-50"
                    >
                    <button
                      @click="aperçuUpload = null; fichierImage = null; sourceChoisie = null; formProduit.imagePath = ''"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      type="button"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </div>

                  <!-- Changer / Reprendre -->
                  <div class="grid grid-cols-2 gap-3">
                    <label class="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 transition">
                      <ImagePlus class="w-4 h-4" />Changer
                      <input type="file" accept="image/*" class="hidden" @change="onImageSelected">
                    </label>
                    <button
                      @click="ouvrirCameraModal"
                      type="button"
                      class="flex items-center justify-center gap-2 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 text-sm text-purple-600 transition"
                    >
                      <Camera class="w-4 h-4" />Reprendre
                    </button>
                  </div>
                </div>

                <p class="text-xs text-gray-400 mt-2 text-center">Max 2MB • PNG, JPG, WEBP</p>
              </div>

            </div>
          </div>

          <!-- Footer modal -->
          <div class="flex gap-3 p-6 border-t">
            <button
              @click="fermerModal"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              @click="sauvegarderProduit"
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

    <!-- Modal confirmation suppression -->
    <Teleport to="body">
      <div
        v-if="produitASupprimer"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 400px;" class="p-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
            <p class="text-gray-500 mb-6">
              Voulez-vous supprimer <strong>{{ produitASupprimer.nom }}</strong> ? Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button
                @click="produitASupprimer = null"
                class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Annuler
              </button>
              <button
                @click="supprimerProduit"
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

    <!-- Modal Caméra en direct -->
    <Teleport to="body">
      <div
        v-if="cameraOuverte"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;"
      >
        <div style="background: white; border-radius: 0.75rem; width: 100%; max-width: 500px; overflow: hidden;">

          <!-- Header -->
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Camera class="w-5 h-5 text-purple-600" />
              Prendre une photo
            </h3>
            <button @click="fermerCamera" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Vidéo en direct -->
          <div class="relative bg-black">
            <video
              ref="videoCamera"
              autoplay
              playsinline
              muted
              style="width: 100%; height: 300px; object-fit: cover; display: block;"
            ></video>

            <!-- Indicateur d'enregistrement -->
            <div class="absolute top-3 left-3 flex items-center gap-2 bg-black bg-opacity-50 px-2 py-1 rounded-full">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-white text-xs">En direct</span>
            </div>
          </div>

          <!-- Boutons -->
          <div class="p-4 flex gap-3">
            <button
              @click="fermerCamera"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <X class="w-4 h-4" />Annuler
            </button>

            <button
              @click="changerCamera"
              class="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition flex items-center justify-center gap-2"
              title="Changer de caméra"
            >
              <RefreshCw class="w-4 h-4" />
            </button>

            <button
              @click="prendrePhoto"
              class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Camera class="w-4 h-4" />Capturer
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
  Plus, Pencil, Trash2, Loader, X,
  CheckCircle, AlertCircle,
  Link as LinkIcon, Upload, ImagePlus,
  Camera, RefreshCw
} from 'lucide-vue-next'

export default {
  name: 'ProduitsView',
  components: {
    AdminLayout,
    Plus, Pencil, Trash2, Loader, X,
    CheckCircle, AlertCircle,
    LinkIcon, Upload, ImagePlus,
    Camera, RefreshCw
  },
  data() {
    return {
      produits: [],
      // ✅ NOUVEAU : liste des catégories
      categories: [],
      chargement: true,
      chargementModal: false,
      chargementSuppression: false,
      // ✅ NOUVEAU : état de chargement des catégories
      chargementCategories: false,
      modalOuvert: false,
      modeEdition: false,
      modeImage: 'url',
      sourceChoisie: null,
      aperçuUpload: null,
      fichierImage: null,
      produitASupprimer: null,
      formProduit: {
        nom: '', description: '', prix: '',
        quantite: '', genre: '', categorie: '', imagePath: ''
      },
      toast: { visible: false, message: '', succes: false },
      // Caméra
      cameraOuverte: false,
      streamCamera: null,
      facingMode: 'environment'
    }
  },

  async mounted() {
    // ✅ Chargement en parallèle : produits + catégories
    await Promise.all([this.chargerProduits(), this.chargerCategories()])
  },

  beforeUnmount() {
    this.arreterStream()
  },

  methods: {
    afficherToast(message, succes = false) {
      this.toast = { visible: true, message, succes }
      setTimeout(() => { this.toast.visible = false }, 3500)
    },

    // ─── CATÉGORIES ────────────────────────────────────────────
    // ✅ NOUVELLE MÉTHODE : charge les catégories depuis l'API
    async chargerCategories() {
      this.chargementCategories = true
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/categories/get_categories')
        if (response.ok) {
          const data = await response.json()
          this.categories = Array.isArray(data) ? data : []
        } else {
          console.error('Erreur chargement catégories:', response.status)
        }
      } catch (error) {
        console.error('Erreur réseau catégories:', error)
      } finally {
        this.chargementCategories = false
      }
    },

    // ─── CAMÉRA ────────────────────────────────────────────────
    async ouvrirCameraModal() {
      this.cameraOuverte = true
      await this.$nextTick()
      await this.demarrerStream()
    },

    async demarrerStream() {
      try {
        this.arreterStream()
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: this.facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        this.streamCamera = stream
        if (this.$refs.videoCamera) {
          this.$refs.videoCamera.srcObject = stream
        }
      } catch (error) {
        console.error('Erreur caméra:', error)
        this.afficherToast('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
        this.cameraOuverte = false
      }
    },

    async changerCamera() {
      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment'
      await this.demarrerStream()
    },

    prendrePhoto() {
      try {
        const video = this.$refs.videoCamera
        if (!video) return

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')

        if (this.facingMode === 'user') {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        }

        ctx.drawImage(video, 0, 0)

        const photoBase64 = canvas.toDataURL('image/jpeg', 0.9)
        this.aperçuUpload = photoBase64
        this.formProduit.imagePath = photoBase64

        canvas.toBlob((blob) => {
          this.fichierImage = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
        }, 'image/jpeg', 0.9)

        this.fermerCamera()
        this.afficherToast('Photo capturée !', true)

      } catch (error) {
        console.error('Erreur capture:', error)
        this.afficherToast('Erreur lors de la capture')
      }
    },

    arreterStream() {
      if (this.streamCamera) {
        this.streamCamera.getTracks().forEach(track => track.stop())
        this.streamCamera = null
      }
    },

    fermerCamera() {
      this.arreterStream()
      this.cameraOuverte = false
    },

    // ─── PRODUITS ──────────────────────────────────────────────
    async chargerProduits() {
      try {
        const response = await fetch('https://luxeparfum-backend.onrender.com/api/products/get_product')
        if (response.ok) {
          const data = await response.json()
          this.produits = Array.isArray(data) ? data : []
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        this.chargement = false
      }
    },

    ouvrirModal(produit = null) {
      if (produit) {
        this.modeEdition = true
        this.formProduit = {
          id: produit.id,
          nom: produit.nom,
          description: produit.description || '',
          prix: produit.prix,
          quantite: produit.quantite,
          genre: produit.genre,
          // ✅ Supporte categorie.nom direct ou via l'objet Category associé
          categorie: produit.categorie?.nom || produit.Category?.nom || '',
          imagePath: produit.imagePath || ''
        }
      } else {
        this.modeEdition = false
        this.formProduit = {
          nom: '', description: '', prix: '',
          quantite: '', genre: '', categoryId: '', imagePath: ''
        }
      }
      this.modeImage = 'url'
      this.sourceChoisie = null
      this.aperçuUpload = null
      this.fichierImage = null
      this.modalOuvert = true
    },

    fermerModal() {
      this.modalOuvert = false
      this.sourceChoisie = null
      this.aperçuUpload = null
      this.fichierImage = null
    },

    onImageSelected(event) {
      const fichier = event.target.files[0]
      if (!fichier) return

      if (fichier.size > 2 * 1024 * 1024) {
        this.afficherToast('Image trop lourde (max 2MB)')
        return
      }

      this.fichierImage = fichier

      const reader = new FileReader()
      reader.onload = (e) => {
        this.aperçuUpload = e.target.result
        this.formProduit.imagePath = e.target.result
      }
      reader.readAsDataURL(fichier)
    },

    async sauvegarderProduit() {
      // ✅ Validation complète incluant categoryId
      if (
        !this.formProduit.nom ||
        !this.formProduit.prix ||
        !this.formProduit.quantite ||
        !this.formProduit.genre ||
        !this.formProduit.categorie
      ) {
        this.afficherToast('Veuillez remplir tous les champs obligatoires')
        return
      }

      this.chargementModal = true
      const authStore = useAuthStore()

      try {
        const url = this.modeEdition
          ? `https://luxeparfum-backend.onrender.com/api/products/update_product/${this.formProduit.id}`
          : 'https://luxeparfum-backend.onrender.com/api/products/add_product'

        const method = this.modeEdition ? 'PUT' : 'POST'
        let response

        // Si image uploadée (galerie ou caméra) → FormData
        if (this.modeImage === 'upload' && this.fichierImage) {
          const formData = new FormData()
          formData.append('nom', this.formProduit.nom)
          formData.append('description', this.formProduit.description || '')
          formData.append('prix', Number(this.formProduit.prix))
          formData.append('quantite', Number(this.formProduit.quantite))
          formData.append('genre', this.formProduit.genre)
          // ✅ categoryId garanti non vide grâce à la validation au-dessus
          formData.append('categorie', this.formProduit.categorie)
          formData.append('image', this.fichierImage)

          response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${authStore.token}` },
            body: formData
          })

        // URL → JSON
        } else {
          response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({
              nom: this.formProduit.nom,
              description: this.formProduit.description,
              prix: Number(this.formProduit.prix),
              quantite: Number(this.formProduit.quantite),
              genre: this.formProduit.genre,
              // ✅ envoie le nom de la catégorie, le backend fait findOrCreate
              categorie: this.formProduit.categorie,
              imagePath: this.formProduit.imagePath
            })
          })
        }

        if (response.ok) {
          this.afficherToast(
            this.modeEdition ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès !',
            true
          )
          this.fermerModal()
          await this.chargerProduits()
        } else {
          const data = await response.json()
          this.afficherToast(data.error || 'Erreur lors de la sauvegarde')
        }

      } catch (error) {
        this.afficherToast('Erreur réseau')
        console.error('Erreur sauvegarde:', error)
      } finally {
        this.chargementModal = false
      }
    },

    confirmerSuppression(produit) {
      this.produitASupprimer = produit
    },

    async supprimerProduit() {
      if (!this.produitASupprimer) return

      this.chargementSuppression = true
      const authStore = useAuthStore()

      try {
        const response = await fetch(
          `https://luxeparfum-backend.onrender.com/api/products/delete_product/${this.produitASupprimer.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authStore.token}` }
          }
        )

        if (response.ok) {
          this.afficherToast('Produit supprimé avec succès !', true)
          this.produitASupprimer = null
          await this.chargerProduits()
        } else {
          this.afficherToast('Erreur lors de la suppression')
        }
      } catch (error) {
        this.afficherToast('Erreur réseau')
        console.error('Erreur suppression:', error)
      } finally {
        this.chargementSuppression = false
      }
    }
  }
}
</script>
