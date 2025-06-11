// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard, adminGuard } from './guards'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    beforeEnter: guestGuard,
    meta: { layout: 'empty' },
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
      },
      {
        path: '/audits',
        name: 'auditView',
        component: () => import('@/views/audits/AuditView.vue'),
      },
      {
        path: '/checklists',
        name: 'checklists',
        component: () => import('@/views/checklists/CheckListView.vue'),
      },
      // Nueva ruta protegida solo para ADMIN
      {
        path: '/admin/users',
        name: 'users',
        component: () => import('@/views/admin/UserView.vue'),
        beforeEnter: adminGuard,
        meta: {
          requiresAdmin: true,
          title: 'Gestión de Usuarios',
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
})

export default router
