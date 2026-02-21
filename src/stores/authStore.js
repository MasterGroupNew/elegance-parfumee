import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')
  }),

  getters: {
    estConnecte: (state) => !!state.token,
    nomUtilisateur: (state) => state.user?.nom || state.user?.prenoms || 'Utilisateur',
    estAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    connexion(token, user, remember = false) {
      this.token = token
      this.user = user

      if (remember) {
        // ✅ Persistant → reste après fermeture du navigateur
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        // ✅ Session → s'efface à la fermeture du navigateur
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('user', JSON.stringify(user))
      }
    },

    deconnexion() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      localStorage.removeItem('userId')
    }
  }
})