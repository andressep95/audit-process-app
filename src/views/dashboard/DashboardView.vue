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
        <p class="mt-2 text-gray-600">Cargando auditorías...</p>
      </div>

      <AppTable
        v-else
        :headers="auditTableHeaders"
        :items="paginatedAudits"
        :empty-message-title="
          searchTerm ? 'No se encontraron resultados' : 'No hay auditorías registradas'
        "
        :empty-message-text="
          searchTerm
            ? 'Intenta con otro término de búsqueda'
            : 'Registra tu primera auditoría para verla aquí.'
        "
      >
        <template #cell-isCompleted="{ item: audit }">
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
        </template>

        <template #cell-compliancePercentage="{ item: audit }">
          {{ audit.compliancePercentage }}%
        </template>

        <template #cell-overallRating="{ item: audit }">
          <span
            :class="getRatingClass(audit.overallRating)"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
          >
            {{ audit.overallRating }}
          </span>
        </template>

        <template #cell-actions="{ item: audit }">
          <div class="flex items-center justify-end gap-2">
            <button
              @click="viewAuditDetails(audit)"
              class="inline-flex items-center justify-center px-3 py-1.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 mr-1 -ml-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Ver
            </button>
          </div>
        </template>
      </AppTable>
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
import AuditService from '@/services/AuditService'
import NotificationModal from '@/components/common/NotificationModal.vue'
import PaginationButtons from '@/components/common/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import type { AuditHeaders } from '@/models/models' // Asegúrate de que AuditHeaders esté correctamente definido.
import type { AuditSummary } from '@/models/AuditSummary'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/es'

dayjs.extend(customParseFormat)
dayjs.locale('es')

import AuditDetailModal from '@/components/common/AuditDetailModal.vue'
import AppTable from '@/components/common/AppTable.vue'

const allAudits = ref<AuditSummary[]>([])
const searchTerm = ref('')
const loading = ref(false)

const showNotification = ref(false)
const notificationType = ref('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

const currentPage = ref(1)
const perPage = ref(6)

const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.roles?.[0] || 'USER')

const showAuditDetailModal = ref(false)
const selectedAuditDetail = ref<AuditHeaders | null>(null)

// Define los encabezados de la tabla para las auditorías
const auditTableHeaders = [
  { key: 'country', label: 'País', align: 'left' as const },
  { key: 'storeName', label: 'Tienda', align: 'left' as const },
  { key: 'storeManager', label: 'Jefe de Tienda', align: 'left' as const },
  { key: 'auditorName', label: 'Auditor', align: 'left' as const },
  { key: 'auditDate', label: 'Fecha', align: 'left' as const },
  { key: 'isCompleted', label: 'Estado', align: 'left' as const },
  { key: 'compliancePercentage', label: 'Cumplimiento', align: 'left' as const },
  { key: 'overallRating', label: 'Calificación', align: 'left' as const },
  { key: 'actions', label: 'Acciones', align: 'right' as const },
] as const

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
      formatDate(audit.auditDate).toLowerCase().includes(term),
  )
})

const paginatedAudits = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredAudits.value.slice(start, end)
})

const loadAudits = async () => {
  loading.value = true
  try {
    let responseData: AuditSummary[] = []
    if (userRole.value === 'ADMIN' || userRole.value === 'AUDITOR') {
      const res = await AuditService.getAudits(0, 1000)
      responseData = res.content
    } else if (userRole.value === 'JEFE_TIENDA') {
      const res = await AuditService.getAuditsForStoreChief(0, 1000)
      responseData = res.content
    } else {
      console.warn('Unrecognized role or no permission to view audits.')
      allAudits.value = []
      loading.value = false
      return
    }
    allAudits.value = responseData
    currentPage.value = 1
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
  searchTerm.value = ''
  resetPagination()
  loadAudits()
}

const viewAuditDetails = async (auditSummary: AuditSummary) => {
  loading.value = true // Mantén el loading aquí para la carga de detalles
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
    loading.value = false // Asegúrate de quitar el loading al finalizar
  }
}

const closeAuditDetailModal = () => {
  showAuditDetailModal.value = false
  selectedAuditDetail.value = null
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  let date = dayjs(dateString)

  if (!date.isValid()) {
    date = dayjs(dateString, 'DD/MM/YYYY', true)
  }

  if (!date.isValid()) {
    console.warn(
      'Fecha inválida después de múltiples intentos de parseo en DashboardView:',
      dateString,
    )
    return 'Fecha inválida'
  }

  return date.format('DD/MM/YYYY')
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

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const resetPagination = () => {
  currentPage.value = 1
}

onMounted(() => {
  loadAudits()
})
</script>
