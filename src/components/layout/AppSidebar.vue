<template>
  <aside
    :class="[
      'bg-white shadow-sm border-r border-gray-200 flex flex-col h-full transition-all',
      isCollapsed ? 'w-16' : 'w-48',
    ]"
    style="transition-duration: 700ms"
  >
    <!-- Header + botón toggle -->
    <div
      class="flex items-center justify-between p-4 border-b border-gray-200"
      :class="{ 'justify-center': isCollapsed }"
    >
      <!-- Título con transición igual que texto del menú -->
      <h2
        class="text-lg font-semibold text-gray-900 select-none transition-opacity duration-700 ease-in-out whitespace-nowrap"
        :style="{
          opacity: isCollapsed ? 0 : 1,
          maxWidth: isCollapsed ? '0px' : '1000px',
          overflow: 'hidden',
        }"
      >
        Menú
      </h2>
      <button
        @click="toggleSidebar"
        class="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
        :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
      >
        <!-- Ícono de hamburguesa -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Menú -->
    <nav class="mt-2 flex flex-col justify-between flex-1 overflow-y-auto">
      <ul class="space-y-1 px-1">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            active-class="bg-gray-100"
          >
            <!-- Contenedor fijo para iconos, evita que cambien de tamaño -->
            <div class="w-6 h-6 flex-shrink-0">
              <component :is="item.icon" />
            </div>
            <!-- Texto con transición suave -->
            <span class="menu-text" :class="{ collapsed: isCollapsed }">
              {{ item.title }}
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Logout -->
      <div class="p-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full text-left text-sm text-red-600 hover:bg-red-100 px-2 py-2 rounded-md font-medium"
          style="height: 32px"
        >
          <!-- Icono logout con tamaño fijo igual que los demás -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>

          <!-- Texto logout con misma transición suave -->
          <span class="menu-text" :class="{ collapsed: isCollapsed }"> Cerrar sesión </span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isCollapsed = ref(true)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const createIcon = (pathData) => {
  return {
    render() {
      return h(
        'svg',
        {
          class: 'w-6 h-6 text-gray-600',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: pathData })],
      )
    },
  }
}

const menuItems = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: createIcon('M3 12l2-2m0 0l7-7 7 7M13 5v6h6'),
  },
  {
    path: '/projects',
    title: 'Proyectos',
    icon: createIcon('M4 6h16M4 10h16M4 14h16M4 18h16'),
  },
  {
    path: '/team',
    title: 'Equipo',
    icon: createIcon('M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 20h5v-2a4 4 0 00-3-3.87'),
  },
  {
    path: '/calendar',
    title: 'Calendario',
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
  },
  {
    path: '/reports',
    title: 'Reportes',
    icon: createIcon('M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6'),
  },
  {
    path: '/settings',
    title: 'Configuración',
    icon: createIcon(
      'M11.983 2.019a1 1 0 01.998 0l2.598 1.5a1 1 0 01.5.866v3.732a1 1 0 01-.5.866l-2.598 1.5a1 1 0 01-.998 0l-2.598-1.5a1 1 0 01-.5-.866V4.385a1 1 0 01.5-.866l2.598-1.5z',
    ),
  },
]

const handleLogout = () => {
  if (confirm('¿Seguro que quieres cerrar sesión?')) {
    auth.logout()
  }
}
</script>

<style scoped>
.menu-text {
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  transition:
    opacity 0.7s ease-in-out,
    max-width 0.7s ease-in-out;
  max-width: 200px; /* ajusta este valor si el texto es más largo */
  opacity: 1;
}

.menu-text.collapsed {
  opacity: 0;
  max-width: 0;
}
</style>
