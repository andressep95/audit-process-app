// src/stores/auth.js
import { defineStore } from 'pinia'
import apiClient from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    tokenExpiry: localStorage.getItem('token_expiry') || null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.accessToken) return false

      // Verificar si el token ha expirado
      if (state.tokenExpiry && Date.now() >= parseInt(state.tokenExpiry)) {
        return false
      }

      return true
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await apiClient.post(
          '/auth/login',
          {
            username: credentials.username,
            password: credentials.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        this.setAuthData(response.data)
        return response.data
      } catch (error) {
        console.error('Login error:', error.response?.data)
        throw error
      }
    },

    async logout() {
      try {
        // Llamar al endpoint de logout para limpiar la cookie
        await apiClient.post('/auth/logout')
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.clearAuthData()
        router.push('/login')
      }
    },

    async fetchUserInfo() {
      try {
        const response = await apiClient.get('/user/profile')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        console.error('Error fetching user info:', error)
        throw error
      }
    },

    setAuthData(data) {
      const expiryTime = Date.now() + data.expires_in * 1000

      this.accessToken = data.access_token
      this.tokenExpiry = expiryTime.toString()

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('token_expiry', expiryTime.toString())
    },

    clearAuthData() {
      this.accessToken = null
      this.user = null
      this.tokenExpiry = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expiry')
    },
  },
})
