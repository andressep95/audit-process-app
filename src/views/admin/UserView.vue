<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div class="p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Gestión de Usuarios</h1>
          <p class="text-gray-600">Administra los usuarios del sistema</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-wrap gap-3">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 -ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Crear Usuario
            </button>
            <button
              @click="refreshUsers"
              class="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Actualizar
            </button>
          </div>

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

    <div class="mb-6">
      <div
        v-if="loading"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12"
      >
        <svg
          class="animate-spin h-8 w-8 text-gray-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-2 text-gray-600">Cargando usuarios...</p>
      </div>

      <AppTable
        v-else
        :headers="userTableHeaders"
        :items="paginatedUsers"
        :empty-message-title="
          searchTerm ? 'No se encontraron resultados' : 'No hay usuarios registrados'
        "
        :empty-message-text="
          searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando tu primer usuario'
        "
      >
        <template #cell-username="{ item: user }">
          <div class="flex items-center">
            <div class="h-8 w-8 flex-shrink-0">
              <button @click="editUser(user)" class="focus:outline-none">
                <div
                  class="h-8 w-8 rounded-full bg-black flex items-center justify-center shadow-sm"
                >
                  <span class="text-xs font-semibold text-white">
                    {{ user.firstName?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
              </button>
            </div>
            <div class="ml-3">
              <div class="text-sm font-semibold text-gray-900">
                {{ `${user.firstName} ${user.lastName}` }}
              </div>
              <div class="text-xs text-gray-500">{{ user.username }}</div>
            </div>
          </div>
        </template>

        <template #cell-email="{ item: user }">
          {{ user.email }}
        </template>

        <template #cell-roles="{ item: user }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="role in filteredRoles(user.roles)"
              :key="role"
              :class="getRoleClass(role).class"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ getRoleClass(role).formattedName }}
            </span>
          </div>
        </template>

        <template #cell-enabled="{ item: user }">
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
        </template>

        <template #cell-actions="{ item: user }">
          <div class="flex items-center justify-end gap-2">
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
        </template>
      </AppTable>
    </div>

    <div v-if="filteredUsers.length > 0" class="flex justify-center">
      <PaginationButtons
        :current-page="currentPage"
        :per-page="perPage"
        :total-items="filteredUsers.length"
        @page-changed="handlePageChange"
      />
    </div>

    <UserCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @submit="createUser"
    />
    <UserEditModal
      :show="showEditModal"
      :userData="selectedUser"
      @close="showEditModal = false"
      @submit="updateUser"
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
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserService from '@/services/userService'
import UserCreateModal from '@/components/forms/UserCreateForm.vue'
import UserEditModal from '@/components/forms/UserEditForm.vue'
import NotificationModal from '@/components/common/NotificationModal.vue'
import PaginationButtons from '@/components/common/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import type { User, UserInput } from '@/models/User'
import AppTable from '@/components/common/AppTable.vue'

// Estado reactivo
const users = ref<User[]>([])
const searchTerm = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref<UserInput | null>(null)
const loading = ref(false)

// Notificación
const showNotification = ref(false)
const notificationType = ref('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

// Paginación
const currentPage = ref(1)
const perPage = ref(6)

// Instancia del store de autenticación
const authStore = useAuthStore()

// Define los encabezados de la tabla para los usuarios
const userTableHeaders = [
  { key: 'username', label: 'Usuario', align: 'left' as const },
  { key: 'email', label: 'Email', align: 'left' as const },
  { key: 'roles', label: 'Rol', align: 'left' as const },
  { key: 'enabled', label: 'Estado', align: 'left' as const },
  { key: 'actions', label: 'Acciones', align: 'right' as const },
] as const

// Computed properties
const filteredUsers = computed(() => {
  let currentUsers = users.value

  // 1. Filtrar por término de búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    currentUsers = currentUsers.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term),
    )
  }

  // 2. Excluir al usuario logueado
  if (authStore.user?.email) {
    const lowerCaseLoggedInEmail = authStore.user.email.toLowerCase()
    currentUsers = currentUsers.filter(
      (user) => user.email?.toLowerCase() !== lowerCaseLoggedInEmail,
    )
  }

  return currentUsers
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
    currentPage.value = 1
  } catch (error) {
    console.error('Error loading users:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error de Carga'
    notificationMessage.value = 'No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo.'
    showNotification.value = true
    users.value = []
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  searchTerm.value = ''
  resetPagination()
  loadUsers()
}

const createUser = async (userData: UserInput) => {
  try {
    await UserService.createUser(userData)

    notificationType.value = 'success'
    notificationTitle.value = 'Usuario creado'
    notificationMessage.value = 'El usuario se ha registrado correctamente.'
    showNotification.value = true

    showCreateModal.value = false
    refreshUsers()
  } catch (error: any) {
    console.error('Error creating user:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error al crear usuario'
    notificationMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Ocurrió un error al intentar crear el usuario.'
    showNotification.value = true
  }
}

const updateUser = async (userData: UserInput) => {
  try {
    await UserService.updateUser(userData)

    notificationType.value = 'success'
    notificationTitle.value = 'Usuario actualizado'
    notificationMessage.value = 'Los cambios se guardaron correctamente.'
    showNotification.value = true

    showEditModal.value = false
    refreshUsers()
  } catch (error: any) {
    console.error('Error updating user:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error al actualizar'
    notificationMessage.value =
      error.response?.data?.message || error.message || 'Ocurrió un error al actualizar el usuario.'
    showNotification.value = true
  }
}

const editUser = (user: User) => {
  selectedUser.value = {
    ...user,
    password: '', // We now know this property should be here for UserInput
    roles: user.roles || [], // <-- FIX IS HERE: Provide an empty array if roles is undefined
  }
  showEditModal.value = true
}

const toggleUserStatus = async (user: User) => {
  const updatedStatus = !user.enabled
  try {
    if (authStore.user?.email && user.email?.toLowerCase() === authStore.user.email.toLowerCase()) {
      notificationType.value = 'error'
      notificationTitle.value = 'Acción no permitida'
      notificationMessage.value = 'No puedes deshabilitar tu propia cuenta.'
      showNotification.value = true
      return
    }

    await UserService.toggleUserStatus({
      email: user.email,
      enabled: updatedStatus,
    })

    const userIndex = users.value.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex].enabled = updatedStatus
    }

    notificationType.value = 'success'
    notificationTitle.value = 'Estado actualizado'
    notificationMessage.value = `El usuario ha sido ${updatedStatus ? 'activado' : 'desactivado'} correctamente.`
    showNotification.value = true // Asegúrate de que la notificación se muestre
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error'
    notificationMessage.value =
      error.response?.data?.message || error.message || 'No se pudo cambiar el estado del usuario.'
    showNotification.value = true
  }
}

const filteredRoles = (roles: string[] | undefined) => {
  if (!roles) return []
  return roles.filter((role) => {
    return role === role.toUpperCase() && /^[A-Z_]+$/.test(role)
  })
}

const getRoleClass = (role: string) => {
  const classes: { [key: string]: string } = {
    ADMIN: 'text-purple-700 bg-purple-100 border-purple-200',
    JEFE_TIENDA: 'text-green-700 bg-green-100 border-green-200',
    AUDITOR: 'text-yellow-700 bg-yellow-100 border-yellow-200',
  }

  const roleClass = classes[role] || 'text-gray-700 bg-gray-100 border-gray-200'
  const formatRoleName = (roleName: string) => roleName.replace(/_/g, ' ')

  return {
    class: roleClass,
    formattedName: formatRoleName(role),
  }
}

const handlePageChange = (page: number) => {
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
