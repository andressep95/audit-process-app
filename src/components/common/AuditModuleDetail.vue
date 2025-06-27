<template>
  <div class="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden p-4">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <h5 class="text-md font-semibold text-gray-800">{{ moduleData.moduleName }}</h5>
        <span :class="getRatingClass(moduleData.overallRating)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full">
          {{ moduleData.overallRating }}
        </span>
        <span :class="moduleData.isCompleted ? 'text-green-700 bg-green-100 border-green-200' : 'text-yellow-700 bg-yellow-100 border-yellow-200'" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border">
          {{ moduleData.isCompleted ? 'Completado' : 'Pendiente' }}
        </span>
      </div>
      <span class="text-sm text-gray-600 font-medium">
        {{ moduleData.compliancePercentage }}% Cumplimiento
      </span>
    </div>

    <!-- Tareas del módulo -->
    <h6 class="text-base font-semibold text-gray-700 mb-3 mt-2">Tareas del Módulo:</h6>
    <div class="space-y-3">
      <div
        v-for="task in moduleData.auditTasks"
        :key="task.id ?? `task-${task.taskCode}`"
        class="border border-gray-100 rounded-md bg-gray-50 shadow-xs overflow-hidden"
      >
        <button
          @click="task.id !== undefined && toggleTaskExpand(task.id)"
          class="flex justify-between items-center w-full p-3 hover:bg-gray-100 transition-colors duration-200"
        >
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-700 text-sm">{{ task.taskCode }}.</span>
            <h6 class="text-sm font-medium text-gray-700">{{ task.procedureDescription }}</h6>
            <span :class="task.isCompleted ? 'text-green-700 bg-green-100 border-green-200' : 'text-yellow-700 bg-yellow-100 border-yellow-200'" class="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full border">
              {{ task.isCompleted ? 'Completada' : 'Pendiente' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 font-medium">{{ task.compliancePercentage }}%</span>
            <svg :class="{ 'rotate-180': task.id !== undefined && expandedTasks[task.id] }" class="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div v-if="task.id !== undefined && expandedTasks[task.id]" class="px-3 pb-3 pt-1 border-t border-gray-50">
          <h6 class="text-sm font-semibold text-gray-600 mb-2 mt-2">Subtareas:</h6>

          <div class="flex justify-center">
            <div class="w-full max-w-6xl">
              <div class="space-y-2">
                <div
                  v-for="subtask in task.auditSubtasks"
                  :key="subtask.id ?? `subtask-${subtask.requerimentCode}`"
                  class="border border-gray-100 rounded-md bg-white p-3 text-sm"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Código Requisito:</p>
                      <p class="font-medium text-gray-800">{{ subtask.requerimentCode }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-gray-500">Descripción:</p>
                      <p class="font-medium text-gray-800">{{ subtask.procedureDescription }}</p>
                    </div>

                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Nivel de Riesgo:</p>
                      <span :class="getRiskLevelClass(subtask.riskLevel)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full">
                        {{ subtask.riskLevel }}
                      </span>
                    </div>

                    <div class="sm:col-span-2 flex items-center gap-x-2">
                      <p class="text-gray-500">Estado:</p>
                      <span :class="subtask.isCompleted ? 'text-green-700 bg-green-100 border-green-200' : 'text-yellow-700 bg-yellow-100 border-yellow-200'" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border">
                        {{ subtask.isCompleted ? 'Completada' : 'Pendiente' }}
                      </span>
                    </div>

                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Porcentaje de Cumplimiento:</p>
                      <p class="font-medium text-gray-800">{{ subtask.compliancePercentage.toFixed(0) }}%</p>
                    </div>

                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Muestras Auditadas:</p>
                      <p class="font-medium text-gray-800">{{ subtask.auditedSamples }}</p>
                    </div>

                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Porcentaje de Error:</p>
                      <p class="font-medium text-gray-800">{{ subtask.errorPercentage.toFixed(0) }}%</p>
                    </div>

                    <div class="flex items-center gap-x-2">
                      <p class="text-gray-500">Errores Encontrados:</p>
                      <p class="font-medium text-gray-800">{{ subtask.errorsFound }}</p>
                    </div>
                  </div>

                  <!-- Observaciones -->
                  <div v-if="getValidObservations(subtask).length > 0" class="mt-4 pt-3 border-t border-gray-100">
                    <p class="font-semibold text-gray-700 mb-2">Observaciones:</p>
                    <div class="space-y-3">
                      <div
                        v-for="obs in getValidObservations(subtask)"
                        :key="obs.id ?? `obs-${obs.observationText.substring(0, 10)}`"
                        class="p-2 bg-gray-100 rounded-md border border-gray-200"
                      >
                        <button
                          @click="openObservationModal(obs)"
                          class="inline-flex items-center justify-center px-3 py-1.5 mt-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 -ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          Ver completo
                        </button>
                      </div>
                    </div>
                  </div>
                  <p v-else class="mt-4 text-gray-500 text-xs italic">No hay observaciones para esta subtarea.</p>
                </div>

                <p v-if="!task.auditSubtasks || task.auditSubtasks.length === 0" class="text-gray-500 text-xs italic">
                  No hay subtareas para esta tarea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!moduleData.auditTasks || moduleData.auditTasks.length === 0" class="text-gray-500 text-sm italic ml-4">
        No hay tareas para este módulo.
      </p>
    </div>

    <!-- Modal -->
    <div v-if="selectedObservation && selectedObservation.observationText" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeModal"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Observación</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-800 whitespace-pre-line">{{ selectedObservation.observationText }}</p>
                  <img v-if="selectedObservation.imageUrl" :src="selectedObservation.imageUrl" :alt="selectedObservation.observationText" class="mt-4 max-w-full h-auto rounded-md object-cover mx-auto" />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { AuditReadModule, AuditReadObservation } from '@/models/audit-read-models'

defineProps<{ moduleData: AuditReadModule }>()

const expandedTasks = ref<{ [key: number]: boolean }>({})
const selectedObservation = ref<AuditReadObservation | null>(null)

const toggleTaskExpand = (taskId: number) => {
  expandedTasks.value[taskId] = !expandedTasks.value[taskId]
}

const openObservationModal = (observation: AuditReadObservation) => {
  if (observation?.observationText?.trim().length > 0) {
    selectedObservation.value = observation
  }
}

const closeModal = () => {
  selectedObservation.value = null
}

const getValidObservations = (subtask: any): AuditReadObservation[] => {
  return (subtask.auditObservations ?? []).filter(
    (obs: AuditReadObservation) => obs.observationText && obs.observationText.trim().length > 0
  )
}

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'EFECTIVA': return 'text-green-700 bg-green-100 border-green-200'
    case 'OPORTUNIDAD DE MEJORA': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'INEFECTIVA': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'DEFICIENTE': return 'text-red-700 bg-red-100 border-red-200'
    case 'Mejorable': return 'text-blue-700 bg-blue-100 border-blue-200'
    case 'Satisfactorio': return 'text-teal-700 bg-teal-100 border-teal-200'
    case 'Sobresaliente': return 'text-purple-700 bg-purple-100 border-purple-200'
    default: return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}

const getRiskLevelClass = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Muy Alto': return 'text-red-800 bg-red-100'
    case 'ALTO': return 'text-orange-800 bg-orange-100'
    case 'MEDIO': return 'text-yellow-800 bg-yellow-100'
    case 'BAJO': return 'text-green-800 bg-green-100'
    default: return 'text-gray-800 bg-gray-100'
  }
}
</script>
