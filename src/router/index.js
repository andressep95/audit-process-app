// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

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
        name: 'audits',
        component: () => import('@/views/audits/AuditListView.vue'),
      },
      {
        path: '/checklists',
        name: 'checklists',
        component: () => import('@/views/checklists/CheckListView.vue'),
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
