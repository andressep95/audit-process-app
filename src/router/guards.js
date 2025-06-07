// src/router/guards.js
import { useAuthStore } from '@/stores/auth'

export const authGuard = async (to, from, next) => {
  const authStore = useAuthStore()

  // Si está autenticado, continuar
  if (authStore.isAuthenticated) {
    return next()
  }

  // Si no está autenticado, redirigir a login
  next({
    name: 'login',
    query: { redirect: to.fullPath },
  })
}

export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()

  // Si está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}
