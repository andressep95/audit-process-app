<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-6">
      <div
        @click="handleHeaderClick"
        class="relative bg-white cursor-pointer transition-all duration-300 border-b border-gray-100 p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)]"
      >
        <div class="relative z-10">
          <AuditSummaryCard :auditData="auditHeaders" :showActionsSlot="true">
            <template #actions>
              <button
                v-if="!isAuditFinalized"
                @click.stop="finalizarAuditoria"
                :disabled="!allModulesCompleted"
                class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap"
                :class="{
                  'bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500':
                    allModulesCompleted,
                  'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none': !allModulesCompleted,
                }"
              >
                Finalizar Auditoría
              </button>
              <button
                v-else
                @click.stop="editarAuditoria"
                class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 whitespace-nowrap"
              >
                Editar Auditoría
              </button>
            </template>
          </AuditSummaryCard>
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

// Importación del nuevo componente modularizado
import AuditSummaryCard from '@/components/common/AuditSummaryCard.vue'

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
  return defineAsyncComponent(() => import('@/components/forms/ModuleAuditForm.vue'))
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
