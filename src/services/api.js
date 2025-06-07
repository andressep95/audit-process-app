// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8090/api',
  timeout: 10000,
  withCredentials: true, // Para enviar cookies automáticamente
})

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta incluye un nuevo access_token, actualizarlo
    if (response.data && response.data.access_token) {
      const authStore = useAuthStore()
      authStore.setAuthData(response.data)
    }
    return response
  },
  async (error) => {
    const authStore = useAuthStore()

    // Si es 401, significa que el token expiró y el refresh falló
    if (error.response?.status === 401) {
      authStore.logout()
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export default apiClient
