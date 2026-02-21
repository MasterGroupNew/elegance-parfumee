<template>
  <div v-if="pubActive" class="relative overflow-hidden" :style="{ backgroundColor: pubActive.couleurFond }">

    <!-- Bandeau défilant -->
    <div class="py-2 px-4 flex items-center">

      <!-- Texte défilant -->
      <div class="flex-1 overflow-hidden">
        <div class="bandeau-scroll flex items-center gap-16 whitespace-nowrap">
          <span v-for="n in 4" :key="n" :style="{ color: pubActive.couleurTexte }"
            class="text-sm font-medium inline-flex items-center gap-2">
            <Megaphone class="w-4 h-4 flex-shrink-0" />
            {{ pubActive.texte }}
          </span>
        </div>
      </div>

      <!-- Bouton fermer -->
      <button @click="fermer" class="ml-4 flex-shrink-0 opacity-70 hover:opacity-100 transition"
        :style="{ color: pubActive.couleurTexte }">
        <X class="w-4 h-4" />
      </button>
    </div>

  </div>
</template>

<script>
import { Megaphone, X } from 'lucide-vue-next'

export default {
  name: 'BandeauPub',
  components: { Megaphone, X },
  data() {
    return {
      pubActive: null,
      fermé: false
    }
  },
  async mounted() {
    await this.chargerPub()
  },
  methods: {
    async chargerPub() {
      try {
        const response = await fetch(
          'https://luxeparfum-backend.onrender.com/api/publicites/get_publicites'
        )
        if (response.ok) {
          const data = await response.json()
          const liste = Array.isArray(data) ? data : data.publicites || []
          const aujourd_hui = new Date()
          this.pubActive = liste.find(pub => {
            if (!pub.actif) return false
            if (pub.dateDebut && new Date(pub.dateDebut) > aujourd_hui) return false
            if (pub.dateFin && new Date(pub.dateFin) < aujourd_hui) return false
            return true
          }) || null
        }
      } catch (error) {
        // Silencieux → adblocker ou endpoint pas encore créé
        this.pubActive = null
      }
    },

    fermer() {
      this.pubActive = null
    }
  }
}
</script>

<style scoped>
.bandeau-scroll {
  animation: scroll-infini 20s linear infinite;
  display: inline-flex;
}

.bandeau-scroll:hover {
  animation-play-state: paused;
}

@keyframes scroll-infini {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
