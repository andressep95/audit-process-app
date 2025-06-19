<template>
  <div class="min-h-screen bg-gray-50">
    <div
      class="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      <h1 class="text-3xl font-bold text-gray-900">Auditorías Registradas</h1>
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
                v-for="audit in audits"
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

          <div v-if="audits.length === 0 && !loading" class="text-center py-12">
            <p class="text-gray-500">No se encontraron auditorías.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="audits.length > 0 || loading" class="flex justify-center mt-6">
      <PaginationButtons
        :current-page="currentPage + 1"
        :per-page="pageSize"
        :total-items="totalElements"
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

const audits = ref<AuditSummary[]>([])
const searchTerm = ref('')
const loading = ref(false)

const currentPage = ref(0)
const pageSize = ref(6)
const totalPages = ref(0)
const totalElements = ref(0)

const showNotification = ref(false)
const notificationType = ref('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.roles?.[0] || 'USER')

const showAuditDetailModal = ref(false)
const selectedAuditDetail = ref<AuditHeaders | null>(null)

const loadAudits = async () => {
  loading.value = true
  try {
    let response
    if (userRole.value === 'ADMIN' || userRole.value === 'AUDITOR') {
      response = await AuditService.getAudits(currentPage.value, pageSize.value)
    } else if (userRole.value === 'JEFE_TIENDA') {
      response = await AuditService.getAuditsForStoreChief(currentPage.value, pageSize.value)
    } else {
      console.warn('Unrecognized role or no permission to view audits.')
      audits.value = []
      totalPages.value = 0
      totalElements.value = 0
      loading.value = false
      return
    }

    audits.value = response.content as AuditSummary[]

    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
  } catch (error) {
    console.error('Error loading audits:', error)
    notificationType.value = 'error'
    notificationTitle.value = 'Error al cargar'
    notificationMessage.value =
      'No se pudieron cargar las auditorías. Por favor, inténtalo de nuevo.'
    showNotification.value = true
    audits.value = []
  } finally {
    loading.value = false
  }
}

const refreshAudits = () => {
  currentPage.value = 0
  loadAudits()
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

const handlePageChange = (page: number) => {
  currentPage.value = page - 1
  loadAudits()
}

const resetPaginationAndLoad = () => {
  currentPage.value = 0
  loadAudits()
}

onMounted(() => {
  loadAudits()
})
</script>

<style scoped>
/* Tu estilo existente aquí */
</style>
