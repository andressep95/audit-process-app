<template>
  <aside
    :class="[
      'bg-white shadow-sm border-r border-gray-200 flex flex-col h-screen transition-all',
      isCollapsed ? 'w-16' : 'w-48',
    ]"
    style="transition-duration: 700ms"
  >
    <!-- Header + botón toggle -->
    <div class="flex items-center justify-between p-4" :class="{ 'justify-center': isCollapsed }">
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

    <!-- Contenedor principal del menú con scroll -->
    <div class="flex-1 overflow-y-auto">
      <nav class="mt-2">
        <ul class="space-y-1 px-1">
          <li v-for="item in menuItems" :key="item.path">
            <router-link
              :to="item.path"
              class="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              active-class="bg-gray-100"
            >
              <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" />
              </div>
              <span class="menu-text" :class="{ collapsed: isCollapsed }">
                {{ item.title }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Logout (fijo en la parte inferior) -->
    <div class="px-1 pb-4 mt-auto">
      <button
        @click="handleLogout"
        class="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-md"
      >
        <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
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
        </div>
        <span class="menu-text" :class="{ collapsed: isCollapsed }">Cerrar sesión</span>
      </button>
    </div>
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
    icon: createIcon('M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6'),
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
  max-width: 200px;
  opacity: 1;
}

.menu-text.collapsed {
  opacity: 0;
  max-width: 0;
}
</style>
