<!-- src/views/admin/UserView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Contenedor para el encabezado y controles -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Gestión de Usuarios</h1>
          <p class="text-gray-600">Administra los usuarios del sistema</p>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-wrap gap-3">
            <button
              @click="showCreateModal = true"
              class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Crear Usuario
            </button>
            <button
              @click="refreshUsers"
              class="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Actualizar
            </button>
          </div>

          <!-- Buscador -->
          <div class="relative">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar usuarios..."
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white min-w-[280px]"
              @input="resetPagination"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor para la tabla de usuarios -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div class="p-6">
        <!-- Tabla de usuarios -->
        <div class="rounded-2xl overflow-hidden">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Usuario
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Rol
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 flex-shrink-0">
                      <div
                        class="h-8 w-8 rounded-full bg-black flex items-center justify-center shadow-sm"
                      >
                        <span class="text-xs font-semibold text-white">
                          {{ user.firstName?.charAt(0)?.toUpperCase() || 'U' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-semibold text-gray-900">
                        {{ `${user.firstName} ${user.lastName}` }}
                      </div>
                      <div class="text-xs text-gray-500">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="role in filteredRoles(user.roles)"
                      :key="role"
                      :class="getRoleClass(role)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ role }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="
                      user.enabled
                        ? 'text-green-700 bg-green-100 border-green-200'
                        : 'text-red-700 bg-red-100 border-red-200'
                    "
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border"
                  >
                    {{ user.enabled ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-800 transition-colors duration-150 font-medium text-sm"
                    >
                      Editar
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="
                        user.enabled
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800'
                      "
                      class="transition-colors duration-150 font-medium text-sm"
                    >
                      {{ user.enabled ? 'Desactivar' : 'Activar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Estado vacío -->
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <div
              class="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                class="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2">
              {{ searchTerm ? 'No se encontraron resultados' : 'No hay usuarios registrados' }}
            </h3>
            <p class="text-sm text-gray-500 max-w-sm mx-auto">
              {{
                searchTerm
                  ? 'Intenta con otro término de búsqueda'
                  : 'Comienza creando tu primer usuario'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de paginación fuera del contenedor principal -->
    <div v-if="filteredUsers.length > 0" class="flex justify-center">
      <PaginationButtons
        :current-page="currentPage"
        :per-page="perPage"
        :total-items="filteredUsers.length"
        @page-changed="handlePageChange"
      />
    </div>

    <!-- Modales -->
    <UserCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @submit="createUser"
    />
    <NotificationModal
      :show="showNotification"
      :type="notificationType"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UserService from '@/services/UserService'
import UserCreateModal from '@/components/forms/UserCreateForm.vue'
import NotificationModal from '@/components/common/NotificationModal.vue'
import PaginationButtons from '@/components/common/Pagination.vue'

// Estado reactivo
const users = ref([])
const searchTerm = ref('')
const showCreateModal = ref(false)
const loading = ref(false)

// Notificación
const showNotification = ref(false)
const notificationType = ref('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

// Paginación
const currentPage = ref(1)
const perPage = ref(10)

// Computed properties
const filteredUsers = computed(() => {
  if (!searchTerm.value) {
    return users.value
  }

  const term = searchTerm.value.toLowerCase()
  return users.value.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term),
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredUsers.value.slice(start, end)
})

// Métodos
const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await UserService.getUsers()
    currentPage.value = 1 // Resetear a la primera página al cargar nuevos datos
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  loadUsers()
}

const createUser = async (userData) => {
  try {
    await UserService.createUser(userData)

    // Mostrar notificación de éxito
    notificationType.value = 'success'
    notificationTitle.value = 'Usuario creado'
    notificationMessage.value = 'El usuario se ha registrado correctamente.'
    showNotification.value = true

    showCreateModal.value = false
    refreshUsers()
  } catch (error) {
    // Mostrar notificación de error
    notificationType.value = 'error'
    notificationTitle.value = 'Error al crear usuario'
    notificationMessage.value = error.message || 'Ocurrió un error al intentar crear el usuario.'
    showNotification.value = true
  }
}

const editUser = (user) => {
  console.log('Editar usuario:', user)
  // Implementar lógica de edición
}

const toggleUserStatus = (user) => {
  user.enabled = !user.enabled
  console.log(`Usuario ${user.firstName} ${user.enabled ? 'activado' : 'desactivado'}`)
}

const filteredRoles = (roles) => {
  return roles.filter((role) => {
    return role === role.toUpperCase() && /^[A-Z_]+$/.test(role)
  })
}

const getRoleClass = (role) => {
  const classes = {
    ADMIN: 'text-purple-800 bg-purple-100',
    MODERATOR: 'text-blue-800 bg-blue-100',
    USER: 'text-gray-800 bg-gray-100',
  }
  return classes[role] || 'text-gray-800 bg-gray-100'
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const resetPagination = () => {
  currentPage.value = 1
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
