// src/stores/auth.js
import { defineStore } from 'pinia'
import apiClient from '@/services/api'
import router from '@/router'
import { decodeJWT } from '@/utils/jwt'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    tokenExpiry: localStorage.getItem('token_expiry') || null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.accessToken) return false
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

    setAuthData(data) {
      const expiryTime = Date.now() + data.expires_in * 1000
      const tokenData = decodeJWT(data.access_token)

      // Debug: verificar qué contiene el token
      //console.log('Token decoded:', tokenData)

      this.accessToken = data.access_token
      this.tokenExpiry = expiryTime.toString()
      this.user = {
        id: tokenData.sub,
        username: tokenData.preferred_username,
        email: tokenData.email,
        name: tokenData.name || tokenData.preferred_username,
        givenName: tokenData.given_name,
        familyName: tokenData.family_name,
        emailVerified: tokenData.email_verified,
        role: this.extractUserRole(tokenData),
        roles: tokenData.roles || [],
        realmRoles: tokenData.realm_access?.roles || [],
      }

      // Debug: verificar el usuario extraído
      //console.log('User extracted:', this.user)

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('token_expiry', expiryTime.toString())
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    extractUserRole(tokenData) {
      // 1. Primero verificar si hay roles directos en el token (como en tu caso)
      if (tokenData.roles && Array.isArray(tokenData.roles)) {
        if (tokenData.roles.includes('ADMIN')) return 'ADMIN'
        //if (tokenData.roles.includes('MODERATOR')) return 'MODERATOR' puede añadir mas
        if (tokenData.roles.includes('USER')) return 'USER'
      }

      // 2. Verificar realm_access roles
      if (tokenData.realm_access && tokenData.realm_access.roles) {
        const realmRoles = tokenData.realm_access.roles
        if (realmRoles.includes('ADMIN')) return 'ADMIN'
        //if (realmRoles.includes('MODERATOR')) return 'MODERATOR' puede añadir mas
        if (realmRoles.includes('USER')) return 'USER'
      }

      // 3. Verificar resource_access roles (si necesario)
      if (tokenData.resource_access) {
        // Buscar en todos los clientes/recursos
        for (const [clientId, clientData] of Object.entries(tokenData.resource_access)) {
          if (clientData.roles) {
            if (clientData.roles.includes('admin') || clientData.roles.includes('ADMIN'))
              return 'ADMIN'
            //if (clientData.roles.includes('moderator') || clientData.roles.includes('MODERATOR'))
            //return 'MODERATOR'
            if (clientData.roles.includes('user') || clientData.roles.includes('USER'))
              return 'USER'
          }
        }
      }

      // Rol por defecto
      return 'USER'
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

    // Modificamos el método clearAuthData para que solo limpie lo relacionado con autenticación
    clearAuthData() {
      // Limpiar el estado
      this.accessToken = null
      this.user = null
      this.tokenExpiry = null

      // Limpiar solo los items de autenticación del localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expiry')

      // Limpiar sessionStorage por si acaso (opcional)
      sessionStorage.removeItem('auditAccepted')
    },

    // Añadimos un método nuevo para limpiar drafts antiguos
    clearOldDrafts() {
      try {
        const hoy = new Date().toLocaleDateString('es-CL')
        const hoyISO = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD

        // Limpiar auditDraft
        const draft = localStorage.getItem('auditDraft')
        if (draft) {
          const parsed = JSON.parse(draft)
          const draftDate = parsed.fechaAuditoria // Formato DD/MM/YYYY

          // Convertir a formato comparable
          const [day, month, year] = draftDate.split('/')
          const draftISODate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

          if (draftISODate !== hoyISO) {
            localStorage.removeItem('auditDraft')
          }
        }

        // Limpiar moduloDraft si existe
        const moduloDraft = localStorage.getItem('moduloDraft')
        if (moduloDraft) {
          const parsed = JSON.parse(moduloDraft)
          const draftDate = parsed.fechaAuditoria || parsed.fechaVenta

          if (draftDate) {
            const [day, month, year] = draftDate.split('/')
            const draftISODate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

            if (draftISODate !== hoyISO) {
              localStorage.removeItem('moduloDraft')
            }
          }
        }
      } catch (error) {
        console.error('Error clearing old drafts:', error)
        localStorage.removeItem('auditDraft')
        localStorage.removeItem('moduloDraft')
      }
    },

    // Método para verificar si el usuario tiene un rol específico
    hasRole(role) {
      if (!this.user) return false

      // Verificar rol principal
      if (this.user.role === role) return true

      // Verificar en el array de roles
      if (this.user.roles && this.user.roles.includes(role)) return true

      // Verificar en realm roles
      if (this.user.realmRoles && this.user.realmRoles.includes(role)) return true

      return false
    },

    // Método para verificar si es admin
    isAdmin() {
      return this.hasRole('ADMIN')
    },

    // Método para verificar múltiples roles
    hasAnyRole(roles) {
      return roles.some((role) => this.hasRole(role))
    },
  },
})
