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
      const expiryTime = Date.now() + data.expires_in * 1000;
      const tokenData = decodeJWT(data.access_token);
      if (!tokenData) throw new Error('Error decoding token');

      // Extraer roles de resource_access (específicamente "audit-store")
      const clientRoles = tokenData.resource_access?.['audit-store']?.roles || [];
      const realmRoles = tokenData.realm_access?.roles || [];

      this.accessToken = data.access_token;
      this.tokenExpiry = expiryTime.toString();
      this.user = {
        id: tokenData.sub,
        username: tokenData.preferred_username,
        email: tokenData.email,
        name: tokenData.name || tokenData.preferred_username,
        givenName: tokenData.given_name,
        familyName: tokenData.family_name,
        emailVerified: tokenData.email_verified,
        role: this.extractUserRole(tokenData), // Usa la función modificada
        roles: clientRoles, // Asigna los roles del cliente ("audit-store")
        realmRoles: realmRoles, // Asigna los roles globales (realm_access)
      };

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_expiry', expiryTime.toString());
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    extractUserRole(tokenData: any): string {
      // 1. Extraer roles de resource_access (cliente "audit-store")
      const auditStoreRoles = tokenData.resource_access?.['audit-store']?.roles || [];
      
      // 2. Extraer roles de realm_access (roles globales)
      const realmRoles = tokenData.realm_access?.roles || [];

      // Combinar todos los roles en un solo array (sin duplicados)
      const allRoles = [...new Set([...auditStoreRoles, ...realmRoles])];

      // Definir prioridad de roles (de mayor a menor jerarquía)
      const priorityRoles = ['ADMIN', 'AUDITOR', 'JEFE_ZONAL', 'JEFE_TIENDA'];

      // Retornar el rol de mayor prioridad encontrado
      for (const role of priorityRoles) {
        if (allRoles.includes(role)) {
          return role;
        }
      }

      // Si no tiene ninguno de los roles definidos, retornar un rol por defecto
      return 'USER';
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
