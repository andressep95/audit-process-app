<template>
  <aside
    class="bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all rounded-xl w-16 hover:w-48 h-full"
  >
    <!-- Header -->
    <div class="flex items-center px-4 py-4 min-h-[4rem] flex-shrink-0">
      <img :src="logoPath" alt="CasaIdeas Logo" class="w-8 h-8 flex-shrink-0 object-contain" />
      <h2 class="sidebar-text text-lg font-semibold text-gray-900 select-none ml-2">Menú</h2>
    </div>

    <!-- Menú con scroll interno si es necesario -->
    <div class="flex-1 overflow-y-auto">
      <nav class="px-1">
        <ul class="space-y-1">
          <li v-for="item in visibleMenuItems" :key="item.path">
            <router-link
              :to="item.path"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md min-h-[2.5rem] transition-colors duration-200"
              active-class="bg-gray-100"
            >
              <div class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" />
              </div>
              <span class="sidebar-text ml-3">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Botón de logout (fijo) -->
    <div class="px-1 pb-4 flex-shrink-0">
      <button
        @click="showLogoutModal = true"
        class="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md min-h-[2.5rem] transition-colors duration-200"
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
        <span class="sidebar-text ml-3">Cerrar sesión</span>
      </button>
    </div>
  </aside>

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
import logo from '@/assets/img/CasaIdeas-logo.webp'

const auth = useAuthStore()
const showLogoutModal = ref(false)
const logoPath = ref(logo)

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

const isAdmin = computed(() => {
  return auth.isAdmin() || auth.hasRole('ADMIN')
})

const menuItems = [
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

const visibleMenuItems = computed(() => {
  return menuItems.filter((item) => {
    if (item.requiresAdmin) {
      return isAdmin.value
    }
    return true
  })
})

const handleLogout = () => {
  auth.logout()
}
</script>

<style scoped>
/* Animación uniforme para todos los textos del sidebar */
.sidebar-text {
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  max-width: 0;
  transform: translateX(-10px);
}

/* Cuando el sidebar está en hover, mostrar todos los textos */
aside:hover .sidebar-text {
  opacity: 1;
  max-width: 200px;
  transform: translateX(0);
}

/* Asegurar que el scroll sea suave */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
