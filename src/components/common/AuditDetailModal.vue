<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="closeModal"
  >
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
      <div class="p-6 overflow-y-auto flex-grow">
        <AuditSummaryCard :auditData="processedAuditData" />

        <div v-if="processedAuditData" class="mt-6 border-t border-gray-200 pt-6">
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
        <div v-else class="text-center text-gray-500 py-10">Cargando datos de auditoría...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { AuditHeaders, AuditModules, Task, AuditSubTask } from '@/models/models'
import AuditSummaryCard from './AuditSummaryCard.vue'
import AuditModuleDetail from './AuditModuleDetail.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat' // Importar si no está
import 'dayjs/locale/es'

dayjs.extend(customParseFormat) // Extender si no está
dayjs.locale('es')

const props = defineProps<{
  show: boolean
  auditData: AuditHeaders | null
}>()

const emit = defineEmits(['close'])

const currentModuleIndex = ref(0)
const processedAuditData = ref<AuditHeaders | null>(null)

interface BackendAuditModule extends AuditModules {
  auditTasks?: (Task & {
    auditSubtasks?: (AuditSubTask & {
      auditObservations?: any[]
    })[]
  })[]
}

const parseCode = (code: string) => code.split('.').map(Number)

watch(
  () => props.auditData,
  (newData) => {
    if (newData) {
      // Realizamos una copia profunda para evitar mutaciones directas del prop
      const dataCopy: AuditHeaders = JSON.parse(JSON.stringify(newData))

      // --- Nuevo código para normalizar la fecha ---
      if (dataCopy.auditDate) {
        // Primero, intentar parsear la fecha de forma flexible.
        // Dayjs es bueno inferiendo formatos ISO 8601 (YYYY-MM-DD, etc.)
        let parsedDate = dayjs(dataCopy.auditDate)

        // Si no es válida o viene en DD/MM/YYYY pero dayjs no lo infiere,
        // intentar explícitamente con DD/MM/YYYY (el 'true' es para parseo estricto)
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(dataCopy.auditDate, 'DD/MM/YYYY', true)
        }

        // Si después de ambos intentos sigue siendo inválida, puedes loguear una advertencia.
        // De lo contrario, formateamos la fecha al formato deseado para el componente hijo.
        if (parsedDate.isValid()) {
          dataCopy.auditDate = parsedDate.format('DD/MM/YYYY')
        } else {
          console.warn(
            'Fecha recibida en AuditDetailModal inválida, se mantendrá original:',
            dataCopy.auditDate,
          )
          // Opcional: podrías establecerla en null o un string de error si prefieres que el AuditSummaryCard
          // maneje un valor no válido de manera explícita si llega a este punto.
          // dataCopy.auditDate = null;
        }
      }
      // --- Fin del nuevo código para normalizar la fecha ---

      if (dataCopy.auditModules) {
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

        dataCopy.auditModules.sort((a, b) => {
          return (a.moduleName || '').localeCompare(b.moduleName || '')
        })
      }
      processedAuditData.value = dataCopy
      currentModuleIndex.value = 0
    } else {
      processedAuditData.value = null
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.show,
  (newVal) => {
    if (newVal && processedAuditData.value) {
      currentModuleIndex.value = 0
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
