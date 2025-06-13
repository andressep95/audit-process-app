<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full relative">
      <h3 class="text-2xl font-bold mb-4 text-gray-800">
        Módulo: {{ currentSubModulo.moduleName }}
      </h3>

      <form @submit.prevent="guardarModulo" class="space-y-6">
        <div
          v-if="currentTask"
          :key="currentTask.id"
          class="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
        >
          <h4 class="text-xl font-semibold mb-3 text-gray-700">
            {{ currentTask.taskCode }}. {{ currentTask.procedureDescription }}
          </h4>

          <div
            v-for="subtask in currentTask.subtasks"
            :key="subtask.id"
            class="mb-4 bg-gray-50 p-4 rounded-md border border-gray-100"
          >
            <p class="text-base text-gray-700 font-medium mb-2">
              {{ currentTask.taskCode }}.{{ subtask.requerimentCode }}
              {{ subtask.procedureDescription }}
            </p>
            <p class="text-sm text-gray-500 mb-3">Nivel de Riesgo: {{ subtask.riskLevel }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label
                  :for="`auditedSamples-${subtask.id}`"
                  class="block text-sm font-medium text-gray-700"
                  >Muestras Auditadas</label
                >
                <input
                  :id="`auditedSamples-${subtask.id}`"
                  type="number"
                  v-model.number="subtask.auditedSamples"
                  min="0"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  :for="`errorsFound-${subtask.id}`"
                  class="block text-sm font-medium text-gray-700"
                  >Errores Encontrados</label
                >
                <input
                  :id="`errorsFound-${subtask.id}`"
                  type="number"
                  v-model.number="subtask.errorsFound"
                  min="0"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-4">
              <h5 class="text-base font-medium text-gray-700 mb-2">Observaciones:</h5>
              <div v-for="(obs, obsIndex) in subtask.observations" :key="obs.id" class="mb-2">
                <textarea
                  v-model="obs.observationText"
                  rows="2"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Escribe tu observación aquí..."
                ></textarea>
                <button
                  type="button"
                  @click="removeObservation(subtask, obsIndex)"
                  class="text-red-600 hover:text-red-800 text-sm mt-1"
                >
                  Eliminar Observación
                </button>
              </div>
              <button
                type="button"
                @click="addObservation(subtask)"
                class="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Observación
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between gap-3">
          <button
            type="button"
            @click="prevTask"
            :disabled="currentTaskIndex === 0"
            class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div class="flex gap-3">
            <button
              type="button"
              @click="cerrar"
              class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              v-if="currentTaskIndex < currentSubModulo.tasks.length - 1"
              @click="nextTask"
              class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Siguiente
            </button>
            <button
              type="submit"
              v-else
              class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Guardar Módulo
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRaw } from 'vue'
import type { AuditModules, Task, AuditSubTask, AuditObservations } from '@/models/models'

const props = defineProps<{
  subModulo: AuditModules
}>()

const emit = defineEmits(['guardar', 'cerrar'])

// Initialize with a default structure or a shallow copy, as it will be deep-copied in the watch
const currentSubModulo = ref<AuditModules>({
  id: 0,
  moduleName: '',
  compliancePercentage: 0,
  overallRating: '',
  isCompleted: false,
  tasks: [],
})

// Variable para controlar el índice de la tarea actual
const currentTaskIndex = ref(0)

// Computed property para obtener la tarea actual
const currentTask = computed<Task | undefined>(() => {
  return currentSubModulo.value.tasks[currentTaskIndex.value]
})

// Función para ir a la siguiente tarea
const nextTask = () => {
  if (currentTaskIndex.value < currentSubModulo.value.tasks.length - 1) {
    currentTaskIndex.value++
  }
}

// Función para ir a la tarea anterior
const prevTask = () => {
  if (currentTaskIndex.value > 0) {
    currentTaskIndex.value--
  }
}

// Function to perform a deep copy of the AuditModules object
const deepCopyAuditModule = (sourceModule: AuditModules): AuditModules => {
  const copiedModule: AuditModules = {
    ...sourceModule, // Shallow copy top-level properties
    tasks: sourceModule.tasks.map((task) => {
      const copiedTask: Task = {
        ...task, // Shallow copy task properties
        subtasks: task.subtasks.map((subtask) => {
          const copiedSubtask: AuditSubTask = {
            ...subtask, // Shallow copy subtask properties
            observations: subtask.observations.map((obs) => ({ ...obs })), // Deep copy observations
          }
          return copiedSubtask
        }),
      }
      return copiedTask
    }),
  }
  return copiedModule
}

// Lógica para inicializar las tareas y subtareas para el módulo de Existencia
const initializeTasksForExistencia = () => {
  // Solo inicializa si las tareas aún no han sido cargadas o generadas
  // o si el módulo inicial recibido tiene tareas vacías
  if (currentSubModulo.value.tasks.length === 0 || props.subModulo.tasks.length === 0) {
    const initialTasks: Task[] = [
      {
        id: 1, // ID único para la tarea
        taskCode: 'A',
        procedureDescription: 'Realizar inventario Selectivo a una muestra de Sku',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1, // ID único para la subtarea
            requerimentCode: 1,
            procedureDescription:
              'Tomar una muestra sobre la línea que presento mayor diferencia en Inventario General, verificar si están cuadrados los sku´s, evaluar según escala determinada (perdida sobre % que representa el costo de la venta, no debería sobrepasar 1%)',
            riskLevel: 'Medio', // Puedes asignar valores concretos aquí
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 2,
            requerimentCode: 2,
            procedureDescription:
              'Se debe realizar inspección visual de todos los espacios de la tienda, si se detecta productos en zonas no permitidas, esto debe afectar negativamente a la puntuación',
            riskLevel: 'Alto',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
        ],
      },
      {
        id: 2,
        taskCode: 'B',
        procedureDescription: 'Mermas',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1,
            requerimentCode: 1,
            procedureDescription:
              'Identificar el espacio físico asignado para el almacenamiento de la Merma',
            riskLevel: 'Bajo',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 2,
            requerimentCode: 2,
            procedureDescription:
              'Revisar en el panel web de control de existencias que se esté registrando la merma operacional, calidad y E-Commerce, y que los respaldos estén anexados en cada registro',
            riskLevel: 'Medio',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 3,
            requerimentCode: 3,
            procedureDescription: 'Revisar almacén destinado para la segunda selección en tienda',
            riskLevel: 'Alto',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
        ],
      },
      {
        id: 3, // ID único para la tarea
        taskCode: 'C',
        procedureDescription: 'Revision en el monitor WEB de Existencias',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1, // ID único para la subtarea
            requerimentCode: 1,
            procedureDescription:
              'Recepción de Camión: Se debe revisar que no existan entregas abiertas y todas deben estar contabilizadas con su respectivo documento SAP de contabilización',
            riskLevel: 'Medio',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 2,
            requerimentCode: 2,
            procedureDescription:
              'Mermas: Se debe revisar que estén registradas las mermas con su respectivo respaldo (Foto, correo con la autorización para las mermas de calidad, Nota de Crédito para las Mermas ecommerce)',
            riskLevel: 'Alto',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 3,
            requerimentCode: 3,
            procedureDescription:
              'Inventarios Selectivos: Revisar que los inventarios selectivos estén registrados y contabilizados',
            riskLevel: 'Bajo',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 4,
            requerimentCode: 4,
            procedureDescription:
              'Traslados, Retiros y Cambios de Almacén: Revisar que los traslados, Retiros y cambios de almacén estén correctamente registrados',
            riskLevel: 'Medio',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
        ],
      },
      {
        id: 4, // ID único para la tarea
        taskCode: 'D',
        procedureDescription: 'Productos para la venta',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1, // ID único para la subtarea
            requerimentCode: 1,
            procedureDescription: 'Existen productos de venta en uso en el Back office/ trastienda',
            riskLevel: 'Alto',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
          {
            id: 2,
            requerimentCode: 2,
            procedureDescription:
              'Verificar que las bodegas se encuentran ordenadas y los productos bien almacenados',
            riskLevel: 'Bajo',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
        ],
      },
      {
        id: 5, // ID único para la tarea
        taskCode: 'E',
        procedureDescription: 'Seguimiento Visita Anterior',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1, // ID único para la subtarea
            requerimentCode: 1,
            procedureDescription:
              'Cuando aplique, valide si se repiten las mismas observaciones que la auditoría anterior',
            riskLevel: 'Medio',
            auditedSamples: 0,
            errorsFound: 0,
            errorPercentage: 0,
            compliancePercentage: 0,
            isCompleted: false,
            observations: [],
          },
        ],
      },
    ]
    currentSubModulo.value.tasks = initialTasks
  }
}

// Observa cambios en `props.subModulo`. Cuando el componente se carga o el prop cambia,
// actualiza la copia interna y inicializa las tareas si es necesario.
watch(
  () => props.subModulo,
  (newVal) => {
    if (newVal) {
      currentSubModulo.value = deepCopyAuditModule(toRaw(newVal))
      initializeTasksForExistencia()
      currentTaskIndex.value = 0 // Reinicia el índice de la tarea al cargar un nuevo submódulo
    }
  },
  { immediate: true, deep: true },
)

// Función para agregar una observación a una subtarea específica
const addObservation = (subtask: AuditSubTask) => {
  subtask.observations.push({
    id: Date.now(), // Usar un ID temporal para el cliente. En el backend, se generaría uno real.
    observationText: '',
    imageUrl: '', // Puedes dejar esto vacío o pedir un URL al usuario
  })
}

// Función para eliminar una observación
const removeObservation = (subtask: AuditSubTask, index: number) => {
  subtask.observations.splice(index, 1)
}

// Lógica para calcular porcentajes y calificaciones antes de guardar
const calculateCompliance = () => {
  currentSubModulo.value.tasks.forEach((task) => {
    let totalSamples = 0
    let totalErrors = 0
    let completedSubtasks = 0

    task.subtasks.forEach((subtask) => {
      // Validación básica
      if (subtask.auditedSamples < 0) subtask.auditedSamples = 0
      if (subtask.errorsFound < 0) subtask.errorsFound = 0
      if (subtask.errorsFound > subtask.auditedSamples) subtask.errorsFound = subtask.auditedSamples

      if (subtask.auditedSamples > 0) {
        subtask.errorPercentage = (subtask.errorsFound / subtask.auditedSamples) * 100
        subtask.compliancePercentage = 100 - subtask.errorPercentage
      } else {
        subtask.errorPercentage = 0
        subtask.compliancePercentage = 100 // Si no hay muestras, se considera 100% compliant por defecto o según tu regla
      }

      // Una subtarea se considera completada si se han registrado muestras (o errores)
      if (
        subtask.auditedSamples > 0 ||
        subtask.errorsFound > 0 ||
        subtask.observations.length > 0
      ) {
        subtask.isCompleted = true
        completedSubtasks++
      } else {
        subtask.isCompleted = false
      }

      totalSamples += subtask.auditedSamples
      totalErrors += subtask.errorsFound
    })

    // Calcular cumplimiento de la tarea global
    if (totalSamples > 0) {
      task.compliancePorcentage = 100 - (totalErrors / totalSamples) * 100
    } else {
      task.compliancePorcentage = 100 // Si no hay muestras en ninguna subtarea, se considera 100% compliant
    }

    // Determinar la calificación textual de la tarea
    if (task.compliancePorcentage >= 90) {
      task.taskRating = 'Excelente'
    } else if (task.compliancePorcentage >= 70) {
      task.taskRating = 'Bueno'
    } else if (task.compliancePorcentage >= 50) {
      task.taskRating = 'Regular'
    } else {
      task.taskRating = 'Deficiente'
    }
    // Una tarea se considera completada si todas sus subtareas lo están
    task.isCompleted = task.subtasks.length > 0 && completedSubtasks === task.subtasks.length
  })

  // Calcular el cumplimiento general del módulo
  let totalModuleCompliance = 0
  let completedTasksCount = 0

  if (currentSubModulo.value.tasks.length > 0) {
    currentSubModulo.value.tasks.forEach((task) => {
      totalModuleCompliance += task.compliancePorcentage
      if (task.isCompleted) {
        completedTasksCount++
      }
    })
    currentSubModulo.value.compliancePercentage =
      totalModuleCompliance / currentSubModulo.value.tasks.length
  } else {
    currentSubModulo.value.compliancePercentage = 0 // O 100 si no hay tareas
  }

  // Determinar la calificación general del módulo
  if (currentSubModulo.value.compliancePercentage >= 90) {
    currentSubModulo.value.overallRating = 'Sobresaliente'
  } else if (currentSubModulo.value.compliancePercentage >= 70) {
    currentSubModulo.value.overallRating = 'Satisfactorio'
  } else if (currentSubModulo.value.compliancePercentage >= 50) {
    currentSubModulo.value.overallRating = 'Mejorable'
  } else {
    currentSubModulo.value.overallRating = 'Crítico'
  }

  // Marcar el módulo como completado si todas sus tareas lo están
  // Y si tiene al menos una tarea
  currentSubModulo.value.isCompleted =
    currentSubModulo.value.tasks.length > 0 &&
    completedTasksCount === currentSubModulo.value.tasks.length
}

// Watcher para recalcular el cumplimiento cada vez que cambian las muestras o errores
watch(
  currentSubModulo,
  () => {
    calculateCompliance()
  },
  { deep: true }, // Observa cambios profundos dentro del objeto currentSubModulo
)

// Función para guardar el módulo y emitirlo al componente padre
const guardarModulo = () => {
  calculateCompliance() // Asegúrate de calcular antes de guardar por si acaso
  emit('guardar', currentSubModulo.value)
}

const cerrar = () => {
  emit('cerrar')
}
</script>
