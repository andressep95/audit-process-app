<template>
  <aside
    :class="[
      'bg-white shadow-sm border-r border-gray-200 flex flex-col h-[calc(100vh-4px)] transition-all rounded-xl mt-[4px]',
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
        <component :is="createIcon('M4 6h16M4 10h16M4 14h16M4 18h16')" />
      </button>
    </div>

    <!-- Contenedor principal del menú con scroll -->
    <div class="flex-1 overflow-y-auto">
      <nav class="mt-2">
        <ul class="space-y-1 px-1">
          <li v-for="item in visibleMenuItems" :key="item.path">
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
        @click="showLogoutModal = true"
        class="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
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

  <!-- Modal de confirmación -->
  <ConfirmationModal
    v-model="showLogoutModal"
    title="Cerrar sesión"
    message="¿Estás seguro de que quieres cerrar sesión? Se perderá cualquier trabajo no guardado."
    confirm-text="Cerrar sesión"
    cancel-text="Cancelar"
    variant="danger"
    @confirm="handleLogout"
    @cancel="showLogoutModal = false"
  />
</template>

<script setup>
import { ref, h, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'

const auth = useAuthStore()
const isCollapsed = ref(true)
const showLogoutModal = ref(false)

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

// Función para verificar si el usuario es ADMIN
const isAdmin = computed(() => {
  //console.log('User data:', auth.user) // Ver qué datos tienes
  return auth.isAdmin() || auth.hasRole('ADMIN')
})

const menuItems = [
  // Botón de administración - solo visible para ADMIN
  {
    path: '/admin/users',
    title: 'Usuarios',
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    ),
    requiresAdmin: true,
  },
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

// Computed property para mostrar solo los elementos del menú que el usuario puede ver
const visibleMenuItems = computed(() => {
  return menuItems.filter((item) => {
    // Si el item requiere permisos de admin, verificar si el usuario los tiene
    if (item.requiresAdmin) {
      return isAdmin.value
    }
    // Si no requiere permisos especiales, mostrar siempre
    return true
  })
})

const handleLogout = () => {
  auth.logout()
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
