<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click.self="closeModal"></div>

      <div
        class="modal-content relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        <div class="p-6 overflow-y-auto flex-grow">
          <AuditSummaryCard v-if="processedAuditData" :auditData="processedAuditData" />
          <div
            v-if="
              processedAuditData &&
              processedAuditData.auditModules &&
              processedAuditData.auditModules.length > 0
            "
            class="mt-6 border-t border-gray-200 pt-6"
          >
            <div class="relative">
              <Transition name="fade" mode="out-in">
                <AuditModuleDetail
                  v-if="processedAuditData.auditModules[currentModuleIndex]"
                  :key="
                    processedAuditData.auditModules[currentModuleIndex].id ??
                    processedAuditData.auditModules[currentModuleIndex].moduleName
                  "
                  :moduleData="processedAuditData.auditModules[currentModuleIndex]"
                />
              </Transition>

              <div
                v-if="processedAuditData.auditModules.length > 1"
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
                v-if="processedAuditData.auditModules.length > 1"
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
              {{ processedAuditData.auditModules.length }}
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-10">Cargando datos de auditoría...</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { AuditReadHeaders, AuditReadModule, AuditReadTask } from '@/models/audit-read-models'
import type { AuditHeaders } from '@/models/models'
import AuditSummaryCard from './AuditSummaryCard.vue'
import AuditModuleDetail from './AuditModuleDetail.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/es'

dayjs.extend(customParseFormat)
dayjs.locale('es')

// Props y eventos
const props = defineProps<{
  show: boolean
  auditData: AuditReadHeaders | AuditHeaders
}>()

const emit = defineEmits(['close'])

// Estado interno
const currentModuleIndex = ref(0)
const processedAuditData = ref<AuditReadHeaders | null>(null)

// Función auxiliar para parsear códigos tipo "1.2.3"
const parseCode = (code: string) => {
  if (typeof code === 'string') {
    return code.split('.').map(Number)
  }
  return [0]
}

// Función para mapear de AuditHeaders a AuditReadHeaders
function mapAuditHeadersToReadHeaders(data: AuditHeaders): AuditReadHeaders {
  return {
    ...data,
    auditModules: data.auditModules.map((module) => ({
      ...module,
      auditTasks: module.tasks.map((task) => ({
        ...task,
        auditSubtasks: task.subtasks.map((subtask) => ({
          ...subtask,
          auditObservations: subtask.observations,
        })),
      })),
    })),
  }
}

// Función para detectar si el objeto es del tipo AuditHeaders
function isAuditHeaders(data: any): data is AuditHeaders {
  return (
    data?.auditModules?.[0]?.tasks !== undefined &&
    data?.auditModules?.[0]?.auditTasks === undefined
  )
}

// Watch principal que transforma y ordena los datos entrantes
watch(
  () => props.auditData,
  (newData) => {
    if (newData) {
      let dataCopy: AuditReadHeaders

      if (isAuditHeaders(newData)) {
        dataCopy = mapAuditHeadersToReadHeaders(newData)
      } else {
        dataCopy = JSON.parse(JSON.stringify(newData)) as AuditReadHeaders
      }

      // Formatear fecha
      if (dataCopy.auditDate) {
        let parsedDate = dayjs(dataCopy.auditDate)
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(dataCopy.auditDate, 'DD/MM/YYYY', true)
        }
        if (parsedDate.isValid()) {
          dataCopy.auditDate = parsedDate.format('DD/MM/YYYY')
        } else {
          console.warn(
            'Fecha recibida en AuditDetailModal inválida, se mantendrá original:',
            dataCopy.auditDate,
          )
        }
      }

      // Ordenar módulos y tareas
      if (dataCopy.auditModules) {
        dataCopy.auditModules.forEach((module: AuditReadModule) => {
          if (module.auditTasks) {
            module.auditTasks.sort((a: AuditReadTask, b: AuditReadTask) => {
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

        dataCopy.auditModules.sort((a, b) =>
          (a.moduleName || '').localeCompare(b.moduleName || ''),
        )
      }

      processedAuditData.value = dataCopy
      currentModuleIndex.value = 0
    } else {
      processedAuditData.value = null
    }
  },
  { immediate: true, deep: true },
)

// Resetear índice cuando se abre el modal
watch(
  () => props.show,
  (newVal) => {
    if (newVal && processedAuditData.value) {
      currentModuleIndex.value = 0
    }
  },
)

// Métodos de navegación y cierre
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
    processedAuditData.value.auditModules &&
    currentModuleIndex.value < processedAuditData.value.auditModules.length - 1
  ) {
    currentModuleIndex.value++
  }
}
</script>

<style scoped>
/* Modal transitions as before */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}
.modal-enter-from .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
.modal-enter-to .modal-content,
.modal-leave-from .modal-content {
  transform: scale(1);
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
