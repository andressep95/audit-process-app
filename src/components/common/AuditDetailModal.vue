<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="closeModal"
  >
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
      <div class="p-6 overflow-y-auto flex-grow">
        <div v-if="processedAuditData">
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
                  {{ processedAuditData.storeName || 'Proceso de Auditoría' }}
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
                  {{ processedAuditData.isCompleted ? 'Completada' : 'En progreso' }}
                </span>
              </div>
              <p class="text-gray-500 text-sm">
                Auditoría en curso • {{ formatDate(processedAuditData.auditDate) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2 text-gray-800">
                <svg
                  v-if="processedAuditData.isCompleted"
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
                  processedAuditData.isCompleted ? 'Completada' : 'En progreso'
                }}</span>
              </div>
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
                  {{ processedAuditData.country || 'No especificado' }}
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
                  {{ processedAuditData.storeManager || 'No especificado' }}
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
                  {{ processedAuditData.auditorName || 'No especificado' }}
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
                <p class="font-medium text-gray-800 text-sm">
                  {{ formatDate(processedAuditData.auditDate) }}
                </p>
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
                  {{ processedAuditData.compliancePercentage.toFixed(2) }}%
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
                  :class="getRatingClass(processedAuditData.overallRating)"
                  class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
                >
                  {{ processedAuditData.overallRating || 'N/A' }}
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
                  {{ processedAuditData.observations || 'No hay observaciones registradas' }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 border-t border-gray-200 pt-6">
            <div class="relative">
              <Transition name="fade" mode="out-in">
                <AuditModuleDetail
                  v-if="
                    processedAuditData.auditModules &&
                    processedAuditData.auditModules[currentModuleIndex]
                  "
                  :key="processedAuditData.auditModules[currentModuleIndex].id"
                  :moduleData="processedAuditData.auditModules[currentModuleIndex]"
                />
              </Transition>

              <div
                v-if="processedAuditData.auditModules && processedAuditData.auditModules.length > 1"
                class="absolute inset-y-0 left-0 flex items-center"
              >
                <button
                  @click="prevModule"
                  :disabled="currentModuleIndex === 0"
                  class="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed -ml-4"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                v-if="processedAuditData.auditModules && processedAuditData.auditModules.length > 1"
                class="absolute inset-y-0 right-0 flex items-center"
              >
                <button
                  @click="nextModule"
                  :disabled="currentModuleIndex === processedAuditData.auditModules.length - 1"
                  class="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed -mr-4"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-center text-sm text-gray-500 mt-4">
              Módulo {{ currentModuleIndex + 1 }} de
              {{ processedAuditData.auditModules ? processedAuditData.auditModules.length : 0 }}
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-10">Cargando datos de auditoría...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { AuditHeaders, AuditModules, Task, AuditSubTask } from '@/models/models'
import AuditModuleDetail from './AuditModuleDetail.vue' // Asegúrate de que la ruta sea correcta
import dayjs from 'dayjs' // Importar dayjs
import 'dayjs/locale/es' // Importar el locale español para dayjs
dayjs.locale('es') // Configurar dayjs para usar el locale español

const props = defineProps<{
  show: boolean
  auditData: AuditHeaders | null // Recibe la data completa de la auditoría
}>()

const emit = defineEmits(['close'])

const currentModuleIndex = ref(0)
const processedAuditData = ref<AuditHeaders | null>(null) // Nuevo ref para los datos procesados y ordenados

// Definimos una interfaz que refleja la estructura real de los datos del backend
interface BackendAuditModule extends AuditModules {
  auditTasks?: (Task & {
    auditSubtasks?: (AuditSubTask & {
      auditObservations?: any[]
    })[]
  })[]
}

// Función auxiliar para parsear códigos como "1.1", "1.10", "2.1"
const parseCode = (code: string) => code.split('.').map(Number)

// Watcher para procesar y ordenar los datos una vez que auditData esté disponible
watch(
  () => props.auditData,
  (newData) => {
    if (newData) {
      // Realiza una copia profunda para asegurar que no se muten los props originales
      const dataCopy: AuditHeaders = JSON.parse(JSON.stringify(newData))

      if (dataCopy.auditModules) {
        // 1. Ordenar las tareas dentro de CADA MÓDULO
        ;(dataCopy.auditModules as BackendAuditModule[]).forEach((module) => {
          if (module.auditTasks) {
            module.auditTasks.sort((a, b) => {
              const codeA = parseCode(a.taskCode)
              const codeB = parseCode(b.taskCode)

              for (let i = 0; i < Math.max(codeA.length, codeB.length); i++) {
                const numA = codeA[i] || 0
                const numB = codeB[i] || 0
                if (numA !== numB) {
                  return numA - numB
                }
              }
              return 0
            })
          }
        })

        // 2. Ordenar los MÓDULOS por moduleName
        dataCopy.auditModules.sort((a, b) => {
          return (a.moduleName || '').localeCompare(b.moduleName || '')
        })
      }
      processedAuditData.value = dataCopy // Almacena la data ya ordenada
      currentModuleIndex.value = 0 // Resetear al primer módulo si los datos cambian
    } else {
      processedAuditData.value = null // Limpiar si no hay data
    }
  },
  { immediate: true, deep: true }, // 'immediate' para que se ejecute en la carga inicial; 'deep' para observar cambios profundos
)

// Reiniciar el índice del módulo cuando se abre el modal
watch(
  () => props.show,
  (newVal) => {
    if (newVal && processedAuditData.value) {
      // Asegurarse de que processedAuditData esté disponible
      currentModuleIndex.value = 0 // Resetear al primer módulo al abrir
    }
  },
)

const closeModal = () => {
  emit('close')
}

const prevModule = () => {
  if (currentModuleIndex.value > 0) {
    currentModuleIndex.value--
  }
}

const nextModule = () => {
  if (
    processedAuditData.value &&
    currentModuleIndex.value < processedAuditData.value.auditModules.length - 1
  ) {
    currentModuleIndex.value++
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  // Asumiendo que dateString viene en formato 'DD/MM/YYYY' o 'YYYY-MM-DD'
  // Si viene como 'DD/MM/YYYY', necesitamos parsearlo correctamente con Day.js
  const date = dayjs(dateString, 'DD/MM/YYYY').isValid()
    ? dayjs(dateString, 'DD/MM/YYYY')
    : dayjs(dateString)
  if (!date.isValid()) {
    return 'Fecha inválida'
  }
  return date.format('D [de] MMMM [de] YYYY') // Corregido: 'YYYY' en lugar de 'YYYY'
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
