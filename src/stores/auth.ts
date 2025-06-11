import { defineStore } from 'pinia'
import apiClient from '@/services/api'
import router from '@/router/index'
import { decodeJWT } from '@/utils/jwt'

interface User {
  id: string
  username: string
  email?: string
  name?: string
  givenName?: string
  familyName?: string
  emailVerified?: boolean
  role: string
  roles: string[]
  realmRoles: string[]
}

interface AuthState {
  accessToken: string | null
  user: User | null
  tokenExpiry: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    tokenExpiry: localStorage.getItem('token_expiry'),
  }),

  getters: {
    isAuthenticated: (state): boolean => {
      if (!state.accessToken) return false
      if (state.tokenExpiry && Date.now() >= parseInt(state.tokenExpiry)) {
        return false
      }
      return true
    },
  },

  actions: {
    async login(credentials: { username: string; password: string }): Promise<any> {
      try {
        const response = await apiClient.post('/auth/login', credentials, {
          headers: { 'Content-Type': 'application/json' },
        })
        this.setAuthData(response.data)
        return response.data
      } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message)
        throw error
      }
    },

    setAuthData(data: { access_token: string; expires_in: number }): void {
      const expiryTime = Date.now() + data.expires_in * 1000
      const tokenData = decodeJWT(data.access_token)
      if (!tokenData) throw new Error('Error decoding token')

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

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('token_expiry', expiryTime.toString())
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    extractUserRole(tokenData: any): string {
      // Igual que tu función
      // ...
      return 'USER'
    },

    async logout(): Promise<void> {
      try {
        await apiClient.post('/auth/logout')
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.clearAuthData()
        router.push('/login')
      }
    },

    clearAuthData(): void {
      this.accessToken = null
      this.user = null
      this.tokenExpiry = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expiry')

      sessionStorage.removeItem('auditAccepted')
    },

    clearOldDrafts(): void {
      // Tu función igual
    },

    hasRole(role: string): boolean {
      if (!this.user) return false
      if (this.user.role === role) return true
      if (this.user.roles.includes(role)) return true
      if (this.user.realmRoles.includes(role)) return true
      return false
    },

    isAdmin(): boolean {
      return this.hasRole('ADMIN')
    },

    hasAnyRole(roles: string[]): boolean {
      return roles.some((role) => this.hasRole(role))
    },
  },
})
