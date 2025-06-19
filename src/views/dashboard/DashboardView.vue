<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div class="p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Auditorías Registradas</h1>
          <p class="text-gray-600">Explora todas las auditorías del sistema</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-wrap gap-3">
            <button
              @click="refreshAudits"
              class="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Actualizar
            </button>
          </div>

          <div class="relative">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar auditorías..."
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

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div class="p-6">
        <div v-if="loading" class="text-center py-12">
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
          <p class="mt-2 text-gray-600">Cargando auditorías...</p>
        </div>

        <div v-else class="rounded-2xl overflow-hidden">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  País
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Tienda
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Jefe de Tienda
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Auditor
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Cumplimiento
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Calificación
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
                v-for="audit in paginatedAudits"
                :key="`${audit.storeName}-${audit.auditDate}-${audit.country}`"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.country }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.storeName }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.storeManager }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.auditorName }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(audit.auditDate) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="
                      audit.isCompleted
                        ? 'text-green-700 bg-green-100 border-green-200'
                        : 'text-yellow-700 bg-yellow-100 border-yellow-200'
                    "
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border"
                  >
                    {{ audit.isCompleted ? 'Completada' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.compliancePercentage }}%
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="getRatingClass(audit.overallRating)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ audit.overallRating }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="viewAuditDetails(audit)"
                      class="text-blue-600 hover:text-blue-800 transition-colors duration-150 font-medium text-sm"
                    >
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredAudits.length === 0 && !loading" class="text-center py-12">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2">
              {{ searchTerm ? 'No se encontraron resultados' : 'No hay auditorías registradas' }}
            </h3>
            <p class="text-sm text-gray-500 max-w-sm mx-auto">
              {{
                searchTerm
                  ? 'Intenta con otro término de búsqueda'
                  : 'Registra tu primera auditoría para verla aquí.'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredAudits.length > 0" class="flex justify-center mt-6">
      <PaginationButtons
        :current-page="currentPage"
        :per-page="perPage"
        :total-items="filteredAudits.length"
        @page-changed="handlePageChange"
      />
    </div>

    <NotificationModal
      :show="showNotification"
      :type="notificationType"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="showNotification = false"
    />

    <AuditDetailModal
      :show="showAuditDetailModal"
      :auditData="selectedAuditDetail"
      @close="closeAuditDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuditService from '@/services/AuditService'
import NotificationModal from '@/components/common/NotificationModal.vue'
import PaginationButtons from '@/components/common/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import type { AuditHeaders } from '@/models/models'
import type { AuditSummary } from '@/models/AuditSummary'

import AuditDetailModal from '@/components/common/AuditDetailModal.vue'

const router = useRouter()

// Estado reactivo
const allAudits = ref<AuditSummary[]>([]) // <-- Aquí se guardan TODAS las auditorías
const searchTerm = ref('')
const loading = ref(false)

// Notificación
const showNotification = ref(false)
const notificationType = ref('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

// Paginación LOCAL (ahora se aplica sobre `filteredAudits`)
const currentPage = ref(1) // Cambiado a 1 para la lógica de paginación basada en 1
const perPage = ref(6) // Número de elementos por página

const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.roles?.[0] || 'USER')

const showAuditDetailModal = ref(false)
const selectedAuditDetail = ref<AuditHeaders | null>(null)

// --- Propiedades Computadas para Filtrado y Paginación LOCAL ---

// 1. filteredAudits: Aplica el filtro de búsqueda a `allAudits`
const filteredAudits = computed(() => {
  if (!searchTerm.value) {
    return allAudits.value
  }

  const term = searchTerm.value.toLowerCase()
  return allAudits.value.filter(
    (audit) =>
      audit.storeName?.toLowerCase().includes(term) ||
      audit.country?.toLowerCase().includes(term) ||
      audit.storeManager?.toLowerCase().includes(term) ||
      audit.auditorName?.toLowerCase().includes(term) ||
      audit.overallRating?.toLowerCase().includes(term) ||
      formatDate(audit.auditDate).toLowerCase().includes(term), // Permite buscar por fecha formateada
  )
})

// 2. paginatedAudits: Aplica la paginación a `filteredAudits`
const paginatedAudits = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredAudits.value.slice(start, end)
})

// --- Métodos ---

// `loadAudits` ahora obtiene TODAS las auditorías
const loadAudits = async () => {
  loading.value = true
  try {
    let responseData: AuditSummary[] = []
    if (userRole.value === 'ADMIN' || userRole.value === 'AUDITOR') {
      // Asumo que tienes un método en AuditService que trae TODAS las auditorías sin paginación
      // Si no existe, deberás crear uno, por ejemplo: AuditService.getAllAudits()
      // O ajustar AuditService.getAudits para que cuando page/size sean null/undefined traiga todo
      const res = await AuditService.getAudits(0, 1000) // <-- Podrías ajustar un tamaño grande o un método que traiga todo
      responseData = res.content
    } else if (userRole.value === 'JEFE_TIENDA') {
      // De igual forma, un método que traiga TODAS las auditorías para el jefe de tienda
      const res = await AuditService.getAuditsForStoreChief(0, 1000) // <-- Podrías ajustar un tamaño grande o un método que traiga todo
      responseData = res.content
    } else {
      console.warn('Unrecognized role or no permission to view audits.')
      allAudits.value = []
      loading.value = false
      return
    }
    allAudits.value = responseData // Almacena todas las auditorías
    currentPage.value = 1 // Resetea la paginación a la primera página al cargar nuevos datos
  } catch (error) {
    console.error('Error loading audits:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error al cargar'
    notificationMessage.value =
      'No se pudieron cargar las auditorías. Por favor, inténtalo de nuevo.'
    showNotification.value = true
    allAudits.value = []
  } finally {
    loading.value = false
  }
}

const refreshAudits = () => {
  searchTerm.value = '' // Limpia el término de búsqueda al refrescar
  resetPagination() // Restablece la paginación a la primera página
  loadAudits() // Vuelve a cargar todas las auditorías
}

const viewAuditDetails = async (auditSummary: AuditSummary) => {
  loading.value = true
  try {
    const fullAuditData = await AuditService.getAuditFullDetailsByStoreAndDate(
      auditSummary.storeName,
      auditSummary.auditDate,
      auditSummary.country,
    )
    selectedAuditDetail.value = fullAuditData
    showAuditDetailModal.value = true
  } catch (error) {
    console.error('Error al cargar los detalles completos de la auditoría:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error de Carga'
    notificationMessage.value =
      'No se pudieron cargar los detalles completos de la auditoría. Por favor, inténtalo de nuevo.'
    showNotification.value = true
  } finally {
    loading.value = false
  }
}

const closeAuditDetailModal = () => {
  showAuditDetailModal.value = false
  selectedAuditDetail.value = null
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  // Asegúrate de que dateString es un formato que Date pueda parsear, e.g., 'YYYY-MM-DD'
  // Si tu backend envía 'DD/MM/YYYY', necesitarás parsearlo primero.
  // Ejemplo para 'DD/MM/YYYY' a 'YYYY-MM-DD' para Date:
  const parts = dateString.split('/')
  if (parts.length === 3) {
    dateString = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'EFECTIVA':
      return 'text-green-700 bg-green-100 border-green-200'
    case 'OPORTUNIDAD DE MEJORA':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'INEFECTIVA':
      return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'DEFICIENTE':
      return 'text-red-700 bg-red-100 border-red-200'
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}

// Este método es llamado por el componente de paginación
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// Resetea la paginación a la primera página cuando el término de búsqueda cambia
const resetPagination = () => {
  currentPage.value = 1
}

onMounted(() => {
  loadAudits()
})
</script>

<style scoped>
/* Tu estilo existente aquí */
</style>
