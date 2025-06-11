// src/services/api.ts
import axios, { AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8090/api',
  timeout: 10000,
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      // Asegurar que headers existe (es un objeto mutable)
      if (!config.headers) {
        config.headers = new AxiosHeaders()
      }

      config.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.access_token) {
      const authStore = useAuthStore()
      authStore.setAuthData(response.data)
    }
    return response
  },
  async (error: AxiosError) => {
    const authStore = useAuthStore()
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      await authStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default apiClient
