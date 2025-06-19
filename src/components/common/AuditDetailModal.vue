<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
  >
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h4 class="text-xl font-bold text-gray-800">Detalle de Auditoría</h4>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors">
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-grow">
        <div v-if="processedAuditData">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">País:</p>
              <p class="font-medium text-gray-700">{{ processedAuditData.country }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tienda:</p>
              <p class="font-medium text-gray-700">{{ processedAuditData.storeName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Jefe de Tienda:</p>
              <p class="font-medium text-gray-700">{{ processedAuditData.storeManager }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Auditor:</p>
              <p class="font-medium text-gray-700">{{ processedAuditData.auditorName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Fecha de Auditoría:</p>
              <p class="font-medium text-gray-700">
                {{ formatDate(processedAuditData.auditDate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Estado General:</p>
              <span
                :class="
                  processedAuditData.isCompleted
                    ? 'text-green-700 bg-green-100 border-green-200'
                    : 'text-yellow-700 bg-yellow-100 border-yellow-200'
                "
                class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border"
              >
                {{ processedAuditData.isCompleted ? 'Completado' : 'Pendiente' }}
              </span>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Observaciones Generales:</p>
              <p class="font-medium text-gray-700 break-words">
                {{ processedAuditData.observations || 'Sin observaciones generales.' }}
              </p>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-6">
            <h5 class="text-lg font-bold text-gray-800 mb-4">Módulos Auditados</h5>

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
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'EXCELENTE':
      return 'text-green-800 bg-green-100'
    case 'BUENA':
      return 'text-blue-800 bg-blue-100'
    case 'ACEPTABLE':
      return 'text-yellow-800 bg-yellow-100'
    case 'INEFECTIVA':
      return 'text-orange-800 bg-orange-100'
    case 'CRÍTICA':
      return 'text-red-800 bg-red-100'
    default:
      return 'text-gray-800 bg-gray-100'
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
