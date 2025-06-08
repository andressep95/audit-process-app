// src/router/guards.js
import { useAuthStore } from '@/stores/auth'

export const authGuard = (to, from, next) => {
  const auth = useAuthStore()

  if (auth.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

export const guestGuard = (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    next()
  } else {
    next('/dashboard')
  }
}

// Guard mejorado para verificar permisos de ADMIN
export const adminGuard = (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    next('/login')
    return
  }

  // Usar el método hasRole o isAdmin del store
  if (auth.isAdmin() || auth.hasRole('ADMIN')) {
    next()
  } else {
    console.warn('Acceso denegado: Usuario sin permisos de ADMIN')
    // Redirigir al dashboard si no tiene permisos
    next('/dashboard')
  }
}

// Guard genérico para múltiples roles
export const roleGuard = (allowedRoles) => {
  return (to, from, next) => {
    const auth = useAuthStore()

    if (!auth.isAuthenticated) {
      next('/login')
      return
    }

    if (auth.hasAnyRole(allowedRoles)) {
      next()
    } else {
      console.warn(
        `Acceso denegado: Usuario sin permisos. Roles requeridos: ${allowedRoles.join(', ')}`,
      )
      next('/dashboard')
    }
  }
}
