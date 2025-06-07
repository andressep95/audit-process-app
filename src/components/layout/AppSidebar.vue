<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col h-full">
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-900">Menú</h2>
    </div>
    <nav class="mt-2 flex flex-col justify-between h-full">
      <ul class="space-y-1 px-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            active-class="bg-gray-100"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ul>

      <!-- Logout button -->
      <div class="p-4 border-t border-gray-200 mt-auto">
        <button
          @click="handleLogout"
          class="w-full text-left text-sm text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-medium"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const menuItems = [
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/projects', title: 'Proyectos' },
  { path: '/team', title: 'Equipo' },
  { path: '/calendar', title: 'Calendario' },
  { path: '/reports', title: 'Reportes' },
  { path: '/settings', title: 'Configuración' },
]

const handleLogout = () => {
  if (confirm('¿Seguro que quieres cerrar sesión?')) {
    auth.logout()
  }
}
</script>
