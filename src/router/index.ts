// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard, adminGuard } from './guards'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    beforeEnter: guestGuard,
    meta: {
      layout: 'empty',
      transition: 'scale',
    },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: {
          transition: 'scale',
          title: 'Dashboard',
        },
      },
      {
        path: '/audits',
        name: 'auditView',
        component: () => import('@/views/audits/AuditView.vue'),
        meta: {
          transition: 'scale',
          title: 'Auditorías',
        },
      },

      {
        path: '/admin/users',
        name: 'users',
        component: () => import('@/views/admin/UserView.vue'),
        beforeEnter: adminGuard,
        meta: {
          requiresAdmin: true,
          title: 'Gestión de Usuarios',
          transition: 'scale',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll behavior suave
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

export default router
