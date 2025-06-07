# Estructura de Carpetas para Sistema de Auditorías

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes comunes (botones, modales, etc.)
│   │   ├── AppButton.vue
│   │   ├── AppModal.vue
│   │   ├── AppDataTable.vue
│   │   └── AppLoader.vue
│   ├── forms/           # Componentes de formularios
│   │   ├── LoginForm.vue
│   │   ├── CheckListForm.vue
│   │   └── StoreForm.vue
│   └── layout/          # Componentes de layout
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       ├── AppFooter.vue
│       └── MainLayout.vue
│
├── views/               # Páginas/Vistas principales
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── LogoutView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   ├── audits/          # Módulo de auditorías
│   │   ├── AuditListView.vue
│   │   ├── AuditDetailView.vue
│   │   ├── AuditCreateView.vue
│   │   └── AuditEditView.vue
│   ├── checklists/      # Módulo de checklists
│   │   ├── CheckListView.vue
│   │   ├── CheckListDetailView.vue
│   │   └── CheckListFormView.vue
│   └── stores/          # Módulo de tiendas
│       ├── StoreListView.vue
│       ├── StoreDetailView.vue
│       └── StoreFormView.vue
│
├── services/            # Servicios y API calls
│   ├── api.js          # Cliente axios configurado
│   ├── authService.js  # Servicios de autenticación
│   ├── auditService.js # Servicios de auditorías
│   ├── checklistService.js
│   └── storeService.js
│
├── stores/              # Stores de Pinia
│   ├── auth.js         # Store de autenticación
│   ├── audit.js        # Store de auditorías
│   ├── checklist.js    # Store de checklists
│   └── store.js        # Store de tiendas
│
├── router/              # Configuración de rutas
│   ├── index.js        # Router principal
│   ├── guards.js       # Guards de autenticación
│   └── routes/         # Definición de rutas por módulo
│       ├── auth.js
│       ├── audit.js
│       └── dashboard.js
│
├── composables/         # Composables de Vue 3
│   ├── useAuth.js      # Lógica reutilizable de auth
│   ├── useApi.js       # Lógica para llamadas API
│   ├── useValidation.js # Validaciones
│   └── useNotifications.js # Sistema de notificaciones
│
├── utils/               # Utilidades y helpers
│   ├── validators.js   # Funciones de validación
│   ├── formatters.js   # Formateo de datos
│   ├── constants.js    # Constantes de la app
│   └── helpers.js      # Funciones auxiliares
│
├── assets/              # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── styles/
│       ├── main.css
│       ├── variables.css
│       └── components.css
│
├── plugins/             # Plugins de Vue
│   ├── primevue.js     # Configuración PrimeVue
│   ├── pinia.js        # Configuración Pinia
│   └── notifications.js
│
├── App.vue             # Componente raíz
└── main.js             # Punto de entrada
```

## Archivos de Configuración Adicionales

```
project-root/
├── .env                # Variables de entorno
├── .env.development    # Variables para desarrollo
├── .env.production     # Variables para producción
├── vue.config.js       # Configuración de Vue CLI
├── package.json        # Dependencias
└── README.md          # Documentación
```

## Ventajas de esta Estructura

1. **Modularidad**: Cada funcionalidad está separada en módulos
2. **Escalabilidad**: Fácil agregar nuevos módulos o funcionalidades
3. **Mantenibilidad**: Código organizado y fácil de encontrar
4. **Reutilización**: Componentes comunes separados
5. **Separación de responsabilidades**: Cada carpeta tiene un propósito específico


// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true // Importante para enviar cookies HttpOnly
})

// Interceptor para requests - agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses - manejar expiración de token
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    // Si el token expiró y no hemos intentado renovarlo
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      authStore.isAuthenticated
    ) {
      originalRequest._retry = true

      try {
        // Intentar renovar el token
        await authStore.refreshToken()
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Si no se puede renovar, cerrar sesión
        authStore.logout()
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8080/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    tokenExpiry: localStorage.getItem('token_expiry') || null
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.accessToken) return false
      
      // Verificar si el token ha expirado
      if (state.tokenExpiry && Date.now() >= parseInt(state.tokenExpiry)) {
        return false
      }
      
      return true
    }
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
          withCredentials: true // Para recibir cookies
        })

        const { access_token, expires_in, token_type } = response.data
        
        // Calcular tiempo de expiración
        const expiryTime = Date.now() + (expires_in * 1000)
        
        // Guardar en estado y localStorage
        this.accessToken = access_token
        this.tokenExpiry = expiryTime.toString()
        
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('token_expiry', expiryTime.toString())
        
        // Opcional: decodificar JWT para obtener info del usuario
        await this.fetchUserInfo()
        
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Error de autenticación')
      }
    },

    async refreshToken() {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true // Para enviar refresh token cookie
        })

        const { access_token, expires_in } = response.data
        const expiryTime = Date.now() + (expires_in * 1000)
        
        this.accessToken = access_token
        this.tokenExpiry = expiryTime.toString()
        
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('token_expiry', expiryTime.toString())
        
        return response.data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    async logout() {
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          withCredentials: true
        })
      } catch (error) {
        console.error('Error durante logout:', error)
      } finally {
        // Limpiar estado local
        this.accessToken = null
        this.user = null
        this.tokenExpiry = null
        
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('token_expiry')
      }
    },

    async fetchUserInfo() {
      try {
        // Aquí harías una petición para obtener info del usuario
        // const response = await apiClient.get('/user/profile')
        // this.user = response.data
        // localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        console.error('Error obteniendo info del usuario:', error)
      }
    }
  }
})

// src/router/guards.js
import { useAuthStore } from '@/stores/auth'

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    beforeEnter: guestGuard
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/audits',
    name: 'audits',
    component: () => import('@/views/audits/AuditListView.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/checklists',
    name: 'checklists',
    component: () => import('@/views/checklists/CheckListView.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

Respuestas a tus Preguntas
1. ¿Cómo gestionar el envío del token?
Sí, debes usar interceptores de Axios (mostrados arriba) en lugar de middleware tradicional porque:

Se ejecutan automáticamente en cada petición
Manejan la renovación automática de tokens
Son más eficientes que verificar manualmente en cada componente

2. Estructura de carpetas recomendada:
La estructura que te propongo está optimizada para:

Sistemas de auditorías: Módulos separados para audits, checklists, stores
PrimeVue: Carpeta específica para configuración de plugins
Escalabilidad: Fácil agregar nuevos módulos
Mantenibilidad: Separación clara de responsabilidades

Dependencias Recomendadas
json{
  "dependencies": {
*You seem to be using an outdated version of Cursor. Please upgrade to the latest version by [downloading Cursor again from our website](https://www.cursor.com/). All your settings will be preserved.*
  }
}