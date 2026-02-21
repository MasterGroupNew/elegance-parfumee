import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/homme',
    name: 'homme',
    component: () => import('../views/HommeView.vue')
  },
  {
    path: '/femme',
    name: 'femme',
    component: () => import('../views/Femme.vue')
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import('../views/CollectionView.vue')
  },
  {
    path: '/apropos',
    name: 'apropos',
    component: () => import('../views/AproposView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/inscription',
    name: 'inscription',
    component: () => import('../views/InscriptionView.vue')
  },
  {
    path: '/mot-de-passe-oublie',
    name: 'motDePasseOublie',
    component: () => import('../views/MotDePasseOublieView.vue')
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('../views/ProfilView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historique',
    name: 'historique',
    component: () => import('../views/HistoriqueView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/suivi',
    name: 'suivi',
    component: () => import('../views/SuiviView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/produits',
    name: 'adminProduits',
    component: () => import('../views/admin/ProduitsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/commandes',
    name: 'adminCommandes',
    component: () => import('../views/admin/CommandesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/utilisateurs',
    name: 'adminUtilisateurs',
    component: () => import('../views/admin/UtilisateursView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'adminCategories',
    component: () => import('../views/admin/CategoriesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/administrateurs',
    name: 'adminAdministrateurs',
    component: () => import('../views/admin/AdministrateursView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/statistiques',
    name: 'adminStatistiques',
    component: () => import('../views/admin/StatistiquesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/publicites',
    name: 'adminPublicites',
    component: () => import('../views/admin/PublicitesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/parametres',
    name: 'adminParametres',
    component: () => import('../views/admin/ParametresView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 👇 Navigation guard — protège les routes qui nécessitent une auth
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next('/')
    return
  }

  next()
})

export default router
