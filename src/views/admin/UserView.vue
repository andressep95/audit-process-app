<!-- src/views/admin/UserView.vue -->
<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      <p class="text-gray-600 mt-1">Administra los usuarios del sistema</p>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-3">
        <button
          @click="showCreateModal = true"
          class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Crear Usuario
        </button>
        <button
          @click="refreshUsers"
          class="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
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
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- Tabla de usuarios -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Usuario
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Rol
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">
                      {{ user.firstName?.charAt(0)?.toUpperCase() || 'U' }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ `${user.firstName} ${user.lastName}` }}
                  </div>
                  <div class="text-sm text-gray-500">{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email }}
            </td>
            <td class="px-6 py-4">
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
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="user.enabled ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ user.enabled ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="editUser(user)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Editar
              </button>
              <button
                @click="toggleUserStatus(user)"
                :class="
                  user.enabled
                    ? 'text-red-600 hover:text-red-900'
                    : 'text-green-600 hover:text-green-900'
                "
                class="transition-colors"
              >
                {{ user.enabled ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchTerm
              ? 'No se encontraron usuarios con ese criterio.'
              : 'Comienza creando tu primer usuario.'
          }}
        </p>
      </div>
    </div>
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

// Métodos
const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await UserService.getUsers()
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
    // Mostrar solo roles completamente en mayúsculas y sin guiones/números
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

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
