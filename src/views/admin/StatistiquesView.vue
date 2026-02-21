<template>
  <AdminLayout>

    <!-- Chargement -->
    <div v-if="chargement" class="text-center py-16">
      <Loader class="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p class="text-gray-600">Chargement des statistiques...</p>
    </div>

    <div v-else class="space-y-6">

      <!-- Cards stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
          <div :class="stat.bg" class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <component :is="stat.icone" class="w-6 h-6 text-white" />
          </div>
          <div>
            <p class="text-xs text-gray-500">{{ stat.label }}</p>
            <p class="text-xl font-bold text-gray-800">{{ stat.valeur }}</p>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Commandes par statut (Doughnut) -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart class="w-5 h-5 text-purple-600" />
            Commandes par statut
          </h3>
          <div class="flex justify-center">
            <div style="width: 260px; height: 260px;">
              <Doughnut :data="doughnutData" :options="doughnutOptions" />
            </div>
          </div>
        </div>

        <!-- Produits par genre (Bar) -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 class="w-5 h-5 text-purple-600" />
            Produits par genre
          </h3>
          <Bar :data="barData" :options="barOptions" />
        </div>

      </div>

      <!-- Dernières commandes résumé -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-purple-600" />
          Chiffre d'affaires par commande (5 dernières)
        </h3>
        <Bar :data="caData" :options="caOptions" />
      </div>

    </div>

  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/AdminLayout.vue'
import { useAuthStore } from '../../stores/authStore'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js'
import {
  Loader, PieChart, BarChart2, TrendingUp,
  ShoppingBag, Droplets, Users, Coins
} from 'lucide-vue-next'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default {
  name: 'StatistiquesView',
  components: {
    AdminLayout, Doughnut, Bar,
    Loader, PieChart, BarChart2, TrendingUp,
    ShoppingBag, Droplets, Users, Coins
  },
  data() {
    return {
      chargement: true,
      stats: [
        { label: 'Commandes', valeur: 0, icone: 'ShoppingBag', bg: 'bg-purple-500' },
        { label: 'Produits', valeur: 0, icone: 'Droplets', bg: 'bg-blue-500' },
        { label: 'Utilisateurs', valeur: 0, icone: 'Users', bg: 'bg-green-500' },
        { label: "Chiffre d'affaires", valeur: '0 FCFA', icone: 'Coins', bg: 'bg-yellow-500' }
      ],
      doughnutData: { labels: [], datasets: [] },
      barData: { labels: [], datasets: [] },
      caData: { labels: [], datasets: [] },
      doughnutOptions: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      },
      barOptions: {
        responsive: true,
        plugins: { legend: { display: false } }
      },
      caOptions: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    }
  },
  async mounted() {
    await this.chargerStats()
  },
  methods: {
    async chargerStats() {
      const authStore = useAuthStore()
      const headers = { 'Authorization': `Bearer ${authStore.token}` }

      try {
        const [commandesRes, produitsRes, usersRes] = await Promise.all([
          fetch('https://luxeparfum-backend.onrender.com/api/orders/get_orders', { headers }),
          fetch('https://luxeparfum-backend.onrender.com/api/products/get_product', { headers }),
          fetch('https://luxeparfum-backend.onrender.com/api/auth/get_users', { headers })
        ])

        // Commandes
        if (commandesRes.ok) {
          const data = await commandesRes.json()
          const commandes = Array.isArray(data) ? data : data.orders || []
          this.stats[0].valeur = commandes.length

          // CA total
          const ca = commandes.reduce((s, c) => s + (c.total || 0), 0)
          this.stats[3].valeur = ca.toLocaleString('fr-FR') + ' FCFA'

          // Doughnut : statuts
          const statutsCount = {}
          commandes.forEach(c => {
            const s = c.status || 'inconnu'
            statutsCount[s] = (statutsCount[s] || 0) + 1
          })
          this.doughnutData = {
            labels: Object.keys(statutsCount),
            datasets: [{
              data: Object.values(statutsCount),
              backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#22c55e', '#ef4444'],
              borderWidth: 2
            }]
          }

          // Bar CA : 5 dernières commandes
          const cinqDernieres = commandes.slice(-5)
          this.caData = {
            labels: cinqDernieres.map(c => `#${c.id}`),
            datasets: [{
              label: 'Total (FCFA)',
              data: cinqDernieres.map(c => c.total || 0),
              backgroundColor: '#a855f7',
              borderRadius: 6
            }]
          }
        }

        // Produits
        if (produitsRes.ok) {
          const produits = await produitsRes.json()
          this.stats[1].valeur = produits.length

          // Bar genre
          const genres = {}
          produits.forEach(p => {
            const g = p.genre || 'Autre'
            genres[g] = (genres[g] || 0) + 1
          })
          this.barData = {
            labels: Object.keys(genres),
            datasets: [{
              data: Object.values(genres),
              backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
              borderRadius: 6
            }]
          }
        }

        // Utilisateurs
        if (usersRes.ok) {
          const data = await usersRes.json()
          const users = Array.isArray(data) ? data : data.users || []
          this.stats[2].valeur = users.length
        }

      } catch (error) {
        console.error('Erreur stats:', error)
      } finally {
        this.chargement = false
      }
    }
  }
}
</script>
