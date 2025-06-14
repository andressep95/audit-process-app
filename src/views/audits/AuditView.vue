<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-6 py-1">
      <div
        @click="mostrarFormulario = true"
        class="relative bg-white cursor-pointer transition-all duration-300 border-b border-gray-100 p-6 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)]"
      >
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-700"
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
                <h2 class="text-2xl font-bold tracking-tight text-gray-800">
                  {{ auditHeaders.storeName || 'Proceso de Auditoria' }}
                </h2>
                <span
                  class="px-2 py-1 border border-gray-200 text-gray-600 bg-white shadow-sm rounded text-sm"
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
                  {{ auditHeaders.isCompleted ? 'Completado' : 'Incompleto' }}
                </span>
              </div>
              <p class="text-gray-500 text-base">
                Auditoría en curso • {{ auditHeaders.auditDate }}
              </p>
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
                <span class="font-semibold">{{
                  auditHeaders.isCompleted ? 'Completada' : 'En progreso'
                }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
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
                <p class="text-xs text-gray-400 uppercase tracking-wide">País</p>
                <p class="font-medium text-gray-800">
                  {{ auditHeaders.country || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
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
                <p class="text-xs text-gray-400 uppercase tracking-wide">Jefe de Tienda</p>
                <p class="font-medium text-gray-800">
                  {{ auditHeaders.storeManager || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
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
                <p class="text-xs text-gray-400 uppercase tracking-wide">Auditor</p>
                <p class="font-medium text-gray-800">
                  {{ auditHeaders.auditorName || 'No especificado' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
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
                <p class="text-xs text-gray-400 uppercase tracking-wide">Fecha</p>
                <p class="font-medium text-gray-800">{{ auditHeaders.auditDate }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-lg">
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
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Observaciones</p>
                <p class="font-medium text-gray-800">
                  {{ auditHeaders.observations || 'No hay observaciones registradas' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Modulos</h2>
        <SubModuleCards :auditModules="calculatedAuditModules" @select-submodule="abrirSubModulo" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, toRaw, watch, computed } from 'vue' // Agregado 'computed'
import dayjs from 'dayjs'
import AuditHeaderForm from '@/components/forms/AuditHeaderForm.vue'
import SubModuleCards from '@/components/common/SubModuleCards.vue'
import type { AuditHeaders, AuditModules, AuditSubTask, Task } from '@/models/models'
import { decodeJWT } from '@/utils/jwt'
import { calculateModuleCompliance } from '@/utils/auditCalculations' // Importar la utilidad de cálculo
import { getInitialTasksForModule } from '@/utils/moduleTasksInitializers' // Importar la utilidad de inicialización de tareas

const mostrarFormulario = ref(false)

// Clave para guardar el borrador general de la auditoría en localStorage
const AUDIT_DRAFT_KEY = 'auditDraft'

function obtenerAuditorDesdeToken(): string {
  const token = localStorage.getItem('access_token')
  if (!token) {
    console.warn('Token no encontrado en localStorage')
    return 'Auditor Desconocido'
  }

  try {
    const decoded = decodeJWT(token)
    return decoded?.preferred_username ?? decoded?.name ?? 'Auditor Desconocido'
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
  auditModules: [], // Se inicializará con la función `loadAuditModules`
})

// Propiedad computada que calculará el cumplimiento para cada módulo
// Esto se re-evaluará cada vez que `auditHeaders.value.auditModules` cambie
const calculatedAuditModules = computed(() => {
  if (!auditHeaders.value.auditModules || auditHeaders.value.auditModules.length === 0) return []

  return auditHeaders.value.auditModules.map((module) => {
    // Es importante pasar una copia del módulo si no quieres que calculateModuleCompliance
    // lo mute directamente antes de que Vue lo "vea" y active la reactividad correctamente.
    // Sin embargo, calculateModuleCompliance ya muta y devuelve el mismo objeto, así que { ...module } está bien.
    return calculateModuleCompliance({ ...module })
  })
})

const cargarDesdeLocalStorage = () => {
  const draft = localStorage.getItem(AUDIT_DRAFT_KEY)
  const hoyISO = dayjs().format('YYYY-MM-DD')

  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      // Asegurarse de que el objeto parseado tiene las propiedades necesarias
      if (!parsed || !parsed.auditDate || !parsed.auditModules) {
        throw new Error('Formato de borrador inválido o incompleto')
      }

      const [day, month, year] = parsed.auditDate.split('/')
      if (!day || !month || !year) throw new Error('Formato de fecha inválido en borrador')

      const draftISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

      if (draftISO === hoyISO) {
        parsed.auditorName = obtenerAuditorDesdeToken()
        auditHeaders.value = parsed
        mostrarFormulario.value = false // Si hay un borrador de hoy, no mostrar el formulario inicial
        console.log('Borrador de auditoría cargado desde localStorage:', parsed)
      } else {
        console.info('Borrador de auditoría con fecha antigua. Se elimina.')
        localStorage.removeItem(AUDIT_DRAFT_KEY)
        initializeDefaultModules() // Inicializa módulos por defecto si el borrador es antiguo
        mostrarFormulario.value = true // Mostrar el formulario para iniciar una nueva auditoría
      }
    } catch (e) {
      console.error('Error al leer o parsear el borrador de auditoría:', e)
      localStorage.removeItem(AUDIT_DRAFT_KEY) // Limpiar datos corruptos
      initializeDefaultModules() // Inicializa módulos por defecto si hubo error
      mostrarFormulario.value = true // Mostrar el formulario para iniciar una nueva auditoría
    }
  } else {
    initializeDefaultModules() // Si no hay borrador, inicializa módulos por defecto
    mostrarFormulario.value = true // Si no hay borrador, mostrar el formulario inicial
  }
}

// Nueva función para inicializar los módulos con sus tareas por defecto
const initializeDefaultModules = () => {
  auditHeaders.value.auditModules = [
    {
      id: 1,
      moduleName: 'Existencia',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(1), // Usa la función para obtener tareas iniciales
    },
    {
      id: 2,
      moduleName: 'Administracion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(2), // Obtener tareas para Administración
    },
    {
      id: 3,
      moduleName: 'TI Mantencion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(3), // Obtener tareas para TI Mantencion
    },
    {
      id: 4,
      moduleName: 'RR.HH - SSO',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(4), // Obtener tareas para RR.HH - SSO
    },
    {
      id: 5,
      moduleName: 'Recaudacion',
      compliancePercentage: 0,
      overallRating: '',
      isCompleted: false,
      tasks: getInitialTasksForModule(5), // Obtener tareas para Recaudacion
    },
  ]
}

// Watcher para guardar el auditHeaders completo en localStorage cada vez que cambie
watch(
  auditHeaders,
  (newVal) => {
    // Solo guardar si hay un storeName, lo que indica que el header ha sido inicializado/guardado
    if (newVal && newVal.storeName !== '') {
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
}

const onFormularioCerrado = () => {
  mostrarFormulario.value = false
}

const subModuloSeleccionado = ref<AuditModules | null>(null)

function abrirSubModulo(sub: AuditModules) {
  // Cuando se abre un submódulo, pasamos una copia del módulo con las tareas ya inicializadas
  // para que el formulario pueda trabajar con ellas.
  const moduleWithTasks = { ...sub, tasks: getInitialTasksForModule(sub.id) }
  // Luego, fusionamos los datos del localStorage si existen para ese módulo
  const storedData = localStorage.getItem(`auditModule_${sub.id}`)
  if (storedData) {
    const parsedStoredData = JSON.parse(storedData)
    // Asegurarse de que las tareas del módulo cargado sobrescriban las iniciales
    // pero manteniendo la estructura general del módulo.
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

// Nueva función para manejar el cierre desde el formulario del submódulo
function cerrarFormularioDeModulo() {
  subModuloSeleccionado.value = null
  // El watcher de auditHeaders ya habrá guardado los cambios.
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
    // Reemplaza el módulo existente en auditHeaders con el módulo actualizado
    // Asegúrate de que el módulo actualizado pase por calculateModuleCompliance
    const calculatedModule = calculateModuleCompliance(toRaw(subModuloActualizado))
    auditHeaders.value.auditModules[index] = calculatedModule
    console.log(
      `Submódulo ${subModuloActualizado.moduleName} actualizado y recalculado en auditHeaders.`,
    )
  }
  cerrarFormularioDeModulo() // Usa la nueva función de cierre
  // El watcher de auditHeaders se encargará de guardar todo el objeto actualizado en localStorage
}

onMounted(() => {
  cargarDesdeLocalStorage()
})
</script>
