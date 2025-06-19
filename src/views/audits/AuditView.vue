<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-6">
      <div
        @click="handleHeaderClick"
        class="relative bg-white cursor-pointer transition-all duration-300 border-b border-gray-100 p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)]"
      >
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 2 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold tracking-tight text-gray-800">
                  {{ auditHeaders.storeName || 'Proceso de Auditoría' }}
                </h2>
                <span
                  class="px-1 py-0.5 border border-gray-200 text-gray-600 bg-white shadow-sm rounded text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 mr-1 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ auditHeaders.isCompleted ? 'Completada' : 'En progreso' }}
                </span>
              </div>
              <p class="text-gray-500 text-sm">Auditoría en curso • {{ auditHeaders.auditDate }}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2 text-gray-800">
                <svg
                  v-if="auditHeaders.isCompleted"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-semibold text-sm">{{
                  auditHeaders.isCompleted ? 'Completada' : 'En progreso'
                }}</span>
              </div>

              <button
                v-if="!isAuditFinalized"
                @click.stop="finalizarAuditoria"
                :disabled="!allModulesCompleted"
                class="ml-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                :class="{
                  'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500':
                    allModulesCompleted,
                  'bg-gray-200 text-gray-500 cursor-not-allowed': !allModulesCompleted,
                }"
              >
                Finalizar Auditoría
              </button>
              <button
                v-else
                @click.stop="editarAuditoria"
                class="ml-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar Auditoría
              </button>
            </div>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-gray-100"
          >
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">País</p>
                <p class="font-medium text-gray-800 text-sm">
                  {{ auditHeaders.country || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                  Jefe de Tienda
                </p>
                <p class="font-medium text-gray-800 text-sm">
                  {{ auditHeaders.storeManager || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Auditor</p>
                <p class="font-medium text-gray-800 text-sm">
                  {{ auditHeaders.auditorName || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Fecha</p>
                <p class="font-medium text-gray-800 text-sm">{{ auditHeaders.auditDate }}</p>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-gray-100"
          >
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm-4 0V9a2 2 0 00-2-2H3c-1.105 0-2 .895-2 2v10c0 1.105 1.79 2 4 2s4-.895 4-2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                  Cumplimiento General
                </p>
                <p class="font-medium text-gray-800 text-sm">
                  {{ auditHeaders.compliancePercentage.toFixed(2) }}%
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                  Calificación General
                </p>
                <p
                  :class="getRatingClass(auditHeaders.overallRating)"
                  class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
                >
                  {{ auditHeaders.overallRating || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-start gap-2">
              <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5 leading-tight">
                  Observaciones
                </p>
                <p class="font-medium text-gray-800 text-sm">
                  {{ auditHeaders.observations || 'No hay observaciones registradas' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <SubModuleCards
          :auditModules="calculatedAuditModules"
          @select-submodule="abrirSubModulo"
          :class="{ 'pointer-events-none opacity-50': isAuditFinalized && !isEditingAudit }"
        />
      </div>

      <component
        v-if="subModuloSeleccionado"
        :is="getFormularioComponent(subModuloSeleccionado.id)"
        :subModulo="subModuloSeleccionado"
        @guardar="actualizarSubModulo"
        @cerrar="cerrarFormularioDeModulo"
      />
    </div>

    <AuditHeaderForm
      :show="mostrarFormulario"
      :auditHeaders="auditHeaders"
      @cerrar="onFormularioCerrado"
      @guardado="onFormularioGuardado"
    />

    <ConfirmationModal
      :modelValue="showConfirmFinalizeModal"
      title="Finalizar Auditoría"
      message="¿Estás seguro de que quieres finalizar y enviar esta auditoría? Esta acción la marcará como completada y la enviará."
      confirmText="Sí, Finalizar"
      cancelText="Cancelar"
      variant="primary"
      @confirm="confirmFinalizarAuditoria"
      @cancel="cancelFinalizarAuditoria"
      @update:modelValue="showConfirmFinalizeModal = $event"
    />

    <ConfirmationModal
      :modelValue="showConfirmEditModal"
      title="Editar Auditoría"
      message="¿Estás seguro de que quieres editar esta auditoría? Esto desbloqueará los formularios para su modificación y la marcará como 'En progreso'."
      confirmText="Sí, Editar"
      cancelText="Cancelar"
      variant="danger"
      @confirm="confirmEditarAuditoria"
      @cancel="cancelEditarAuditoria"
      @update:modelValue="showConfirmEditModal = $event"
    />

    <NotificationModal
      :show="showNotificationModal"
      :type="notificationType"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="showNotificationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, toRaw, watch, computed } from 'vue'
import dayjs from 'dayjs'
import AuditHeaderForm from '@/components/forms/AuditHeaderForm.vue'
import SubModuleCards from '@/components/common/SubModuleCards.vue'
import AuditService from '@/services/AuditService'
import type { AuditHeaders, AuditModules } from '@/models/models'
import { decodeJWT } from '@/utils/jwt'
import { calculateModuleCompliance, calculateAuditTotalCompliance } from '@/utils/auditCalculations'
import { getInitialTasksForModule } from '@/utils/moduleTasksInitializers'

// Importación de los nuevos modales
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import NotificationModal from '@/components/common/NotificationModal.vue'

const mostrarFormulario = ref(false)
const AUDIT_DRAFT_KEY = 'auditDraft'
const MODULE_PREFIX = 'auditModule_'

const isAuditFinalized = ref(false)
const isEditingAudit = ref(false)

// Estados para controlar los nuevos modales
const showConfirmFinalizeModal = ref(false)
const showConfirmEditModal = ref(false)
const showNotificationModal = ref(false)
const notificationType = ref('success') // 'success' o 'error'
const notificationTitle = ref('')
const notificationMessage = ref('')

function obtenerAuditorDesdeToken(): string {
  const token = localStorage.getItem('access_token')
  if (!token) {
    console.warn('Token no encontrado en localStorage')
    return 'Auditor Desconocido'
  }

  try {
    const decoded = decodeJWT(token)
    return decoded?.name ?? decoded?.preferred_username ?? 'Auditor Desconocido'
  } catch (error) {
    console.error('Error al decodificar token:', error)
    return 'Auditor Desconocido'
  }
}

const auditHeaders = ref<AuditHeaders>({
  country: '',
  storeName: '',
  storeManager: '',
  auditorName: obtenerAuditorDesdeToken(),
  auditDate: dayjs().format('DD/MM/YYYY'),
  isCompleted: false,
  observations: '',
  auditModules: [],
  compliancePercentage: 0,
  overallRating: '',
})

const calculatedAuditModules = computed(() => {
  if (!auditHeaders.value.auditModules || auditHeaders.value.auditModules.length === 0) return []
  return auditHeaders.value.auditModules.map((module) => {
    return calculateModuleCompliance({ ...module })
  })
})

const allModulesCompleted = computed(() => {
  if (!calculatedAuditModules.value.length) return false
  return calculatedAuditModules.value.every((module) => module.isCompleted)
})

watch(
  calculatedAuditModules,
  (newModules) => {
    const { compliancePercentage, overallRating } = calculateAuditTotalCompliance(newModules)
    auditHeaders.value.compliancePercentage = compliancePercentage
    auditHeaders.value.overallRating = overallRating
  },
  { deep: true, immediate: true },
)

const clearAllAuditDrafts = () => {
  console.info('Limpiando todos los borradores de auditoría del localStorage.')
  localStorage.removeItem(AUDIT_DRAFT_KEY)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(MODULE_PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}

const cargarDesdeLocalStorage = () => {
  const draft = localStorage.getItem(AUDIT_DRAFT_KEY)
  const hoyISO = dayjs().format('YYYY-MM-DD')

  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      if (!parsed || !parsed.auditDate || !parsed.auditModules) {
        throw new Error('Formato de borrador inválido o incompleto')
      }

      const [day, month, year] = parsed.auditDate.split('/')
      if (!day || !month || !year) throw new Error('Formato de fecha inválido en borrador')

      const draftISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

      if (draftISO === hoyISO) {
        parsed.auditorName = obtenerAuditorDesdeToken()
        auditHeaders.value = parsed
        if (parsed.isCompleted) {
          isAuditFinalized.value = true
        }
        mostrarFormulario.value = false
        console.log('Borrador de auditoría cargado desde localStorage:', parsed)
      } else {
        console.info('Borrador de auditoría con fecha antigua. Se procede a limpiar y reiniciar.')
        clearAllAuditDrafts()
        initializeDefaultModules()
        mostrarFormulario.value = true
      }
    } catch (e) {
      console.error('Error al leer o parsear el borrador de auditoría:', e)
      clearAllAuditDrafts()
      initializeDefaultModules()
      mostrarFormulario.value = true
    }
  } else {
    console.info('No se encontró borrador de auditoría. Inicializando auditoría nueva.')
    clearAllAuditDrafts()
    initializeDefaultModules()
    mostrarFormulario.value = true
  }
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

const initializeDefaultModules = () => {
  auditHeaders.value.auditModules = [
    {
      id: 1,
      moduleName: 'Existencia',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(1),
    },
    {
      id: 2,
      moduleName: 'Administracion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(2),
    },
    {
      id: 3,
      moduleName: 'TI Mantencion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(3),
    },
    {
      id: 4,
      moduleName: 'RR.HH - SSO',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(4),
    },
    {
      id: 5,
      moduleName: 'Recaudacion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(5),
    },
  ]
}

watch(
  auditHeaders,
  (newVal) => {
    if (newVal && newVal.storeName !== '' && !(isAuditFinalized.value && !isEditingAudit.value)) {
      console.log('Guardando auditDraft completo en localStorage.')
      localStorage.setItem(AUDIT_DRAFT_KEY, JSON.stringify(toRaw(newVal)))
    }
  },
  { deep: true },
)

const onFormularioGuardado = (moduloGuardado: AuditHeaders) => {
  if (!moduloGuardado.auditDate) {
    moduloGuardado.auditDate = dayjs().format('DD/MM/YYYY')
  }
  auditHeaders.value = moduloGuardado
  mostrarFormulario.value = false
  console.log('--- Audit Headers guardados (JSON) ---')
  console.log(JSON.stringify(toRaw(auditHeaders.value), null, 2))
  console.log('-------------------------------------')
}

const onFormularioCerrado = () => {
  mostrarFormulario.value = false
}

const subModuloSeleccionado = ref<AuditModules | null>(null)

const handleHeaderClick = () => {
  if (!isAuditFinalized.value || isEditingAudit.value) {
    mostrarFormulario.value = true
  } else {
    notificationType.value = 'error'
    notificationTitle.value = 'Auditoría Finalizada'
    notificationMessage.value =
      'La auditoría está finalizada. Presiona "Editar Auditoría" para modificarla.'
    showNotificationModal.value = true
  }
}

function abrirSubModulo(sub: AuditModules) {
  if (isAuditFinalized.value && !isEditingAudit.value) {
    notificationType.value = 'error'
    notificationTitle.value = 'Auditoría Finalizada'
    notificationMessage.value =
      'La auditoría está finalizada. Presiona "Editar Auditoría" para modificarla.'
    showNotificationModal.value = true
    return
  }

  const moduleWithTasks = { ...sub, tasks: getInitialTasksForModule(sub.id) }
  const storedData = localStorage.getItem(`${MODULE_PREFIX}${sub.id}`)

  if (storedData) {
    const parsedStoredData = JSON.parse(storedData)
    subModuloSeleccionado.value = {
      ...moduleWithTasks,
      ...parsedStoredData,
      tasks: parsedStoredData.tasks,
    }
  } else {
    subModuloSeleccionado.value = moduleWithTasks
  }
  console.log('Abriendo submódulo:', toRaw(subModuloSeleccionado.value))
}

function cerrarFormularioDeModulo() {
  subModuloSeleccionado.value = null
  console.log('Formulario de submódulo cerrado. auditHeaders debe estar guardado.')
}

function getFormularioComponent(id: number) {
  switch (id) {
    case 1:
      return defineAsyncComponent(() => import('@/components/forms/ExistenciaForm.vue'))
    case 2:
      return defineAsyncComponent(() => import('@/components/forms/AdministracionForm.vue'))
    case 3:
      return defineAsyncComponent(() => import('@/components/forms/MantencionForm.vue'))
    case 4:
      return defineAsyncComponent(() => import('@/components/forms/RecursosHumForm.vue'))
    case 5:
      return defineAsyncComponent(() => import('@/components/forms/RecaudacionForm.vue'))
    default:
      return null
  }
}

function actualizarSubModulo(subModuloActualizado: AuditModules) {
  const index = auditHeaders.value.auditModules.findIndex((s) => s.id === subModuloActualizado.id)
  if (index !== -1) {
    const calculatedModule = calculateModuleCompliance(toRaw(subModuloActualizado))
    auditHeaders.value.auditModules[index] = calculatedModule
    console.log(
      `Submódulo ${subModuloActualizado.moduleName} actualizado y recalculado en auditHeaders.`,
    )
  }
  cerrarFormularioDeModulo()
}

const finalizarAuditoria = async () => {
  if (!allModulesCompleted.value) {
    notificationType.value = 'error'
    notificationTitle.value = 'Módulos Incompletos'
    notificationMessage.value =
      'Por favor, complete todos los módulos antes de finalizar la auditoría.'
    showNotificationModal.value = true
    return
  }

  showConfirmFinalizeModal.value = true // Muestra el modal de confirmación
}

const confirmFinalizarAuditoria = async () => {
  console.log('Iniciando proceso de finalización y envío de auditoría...')
  auditHeaders.value.isCompleted = true
  showConfirmFinalizeModal.value = false // Cierra el modal de confirmación

  try {
    const auditData = toRaw(auditHeaders.value)
    const response = await AuditService.createAudit(auditData)
    console.log('Respuesta del servidor:', response)

    isAuditFinalized.value = true
    isEditingAudit.value = false

    notificationType.value = 'success'
    notificationTitle.value = 'Auditoría Finalizada'
    notificationMessage.value =
      '¡Auditoría finalizada y enviada con éxito!<br>Los borradores han sido limpiados.'
    showNotificationModal.value = true
  } catch (error) {
    console.error('Error al enviar la auditoría:', error)
    auditHeaders.value.isCompleted = false
    isAuditFinalized.value = false
    isEditingAudit.value = false

    notificationType.value = 'error'
    notificationTitle.value = 'Error al Enviar Auditoría'
    notificationMessage.value =
      'Hubo un error al finalizar y enviar la auditoría. Por favor, inténtalo de nuevo.'
    showNotificationModal.value = true
  }
}

const cancelFinalizarAuditoria = () => {
  showConfirmFinalizeModal.value = false
}

const editarAuditoria = () => {
  showConfirmEditModal.value = true // Muestra el modal de confirmación para editar
}

const confirmEditarAuditoria = () => {
  isAuditFinalized.value = false
  isEditingAudit.value = true
  auditHeaders.value.isCompleted = false
  console.log('Modo de edición activado. La auditoría puede ser modificada.')
  showConfirmEditModal.value = false // Cierra el modal de confirmación

  notificationType.value = 'success'
  notificationTitle.value = 'Modo de Edición Activado'
  notificationMessage.value = 'Se ha activado el modo de edición. Ya puedes modificar la auditoría.'
  showNotificationModal.value = true
}

const cancelEditarAuditoria = () => {
  showConfirmEditModal.value = false
}

onMounted(() => {
  cargarDesdeLocalStorage()
})
</script>

<style scoped>
/* Estilos existentes */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 0.75;
}
</style>
