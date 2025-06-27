// src/router/guards.ts

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Guard para usuarios autenticados
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    auth.clearAuthData()
    next('/login')
  } else {
    next()
  }
}

// Guard para invitados (no autenticados)
export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    next()
  } else {
    next('/dashboard')
  }
}

// Guard exclusivo para usuarios con rol ADMIN
export const adminGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    next('/login')
    return
  }

  if (auth.isAdmin?.() || auth.hasRole?.('ADMIN')) {
    next()
  } else {
    console.warn('Acceso denegado: Usuario sin permisos de ADMIN')
    next('/dashboard')
  }
}

// Guard genérico para múltiples roles
export const roleGuard = (allowedRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const auth = useAuthStore()

    if (!auth.isAuthenticated) {
      next('/login')
      return
    }

    if (auth.hasAnyRole?.(allowedRoles)) {
      next()
    } else {
      console.warn(
        `Acceso denegado: Usuario sin permisos. Roles requeridos: ${allowedRoles.join(', ')}`,
      )
      next('/dashboard')
    }
  }
}
