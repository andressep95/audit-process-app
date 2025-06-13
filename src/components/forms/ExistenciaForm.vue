<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center"
    @click="handleClickOutside"
  >
    <div ref="modalContent" class="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full relative">
      <h3 class="text-2xl font-bold mb-4 text-gray-800">
        Módulo: {{ currentSubModulo.moduleName }}
      </h3>
      <p class="text-gray-600 mb-6">
        Por favor, complete las muestras auditadas y los errores encontrados para cada subtarea.
      </p>

      <form @submit.prevent="guardarModulo" class="space-y-6">
        <div
          v-if="currentTask"
          :key="currentTask.id"
          class="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
        >
          <h4 class="text-xl font-semibold mb-3 text-gray-700">
            Tarea: {{ currentTask.taskCode }}. {{ currentTask.procedureDescription }}
          </h4>

          <div
            v-if="currentTask.subtasks.length > 0"
            class="flex justify-between items-center mb-4"
          >
            <h5 class="text-lg font-medium text-gray-700">
              Subtarea {{ currentSubtaskIndex + 1 }} de {{ currentTask.subtasks.length }} (Req.
              {{ currentSubtask?.requerimentCode }})
            </h5>
            <div class="space-x-2">
              <button
                type="button"
                @click.stop="goToPrevSubtask"
                :disabled="currentSubtaskIndex === 0"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <button
                type="button"
                @click.stop="goToNextSubtask"
                :disabled="currentSubtaskIndex === currentTask.subtasks.length - 1"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>

          <div
            v-if="currentSubtask"
            :key="currentSubtask.id"
            class="mb-4 bg-gray-50 p-4 rounded-md border border-gray-100"
          >
            <p class="text-base text-gray-700 font-medium mb-2">
              {{ currentTask.taskCode }}.{{ currentSubtask.requerimentCode }}
              {{ currentSubtask.procedureDescription }}
            </p>
            <p class="text-sm text-gray-500 mb-3">
              Nivel de Riesgo: {{ currentSubtask.riskLevel }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label
                  :for="`auditedSamples-${currentSubtask.id}`"
                  class="block text-sm font-medium text-gray-700"
                  >Muestras Auditadas</label
                >
                <input
                  :id="`auditedSamples-${currentSubtask.id}`"
                  type="number"
                  v-model.number="currentSubtask.auditedSamples"
                  min="0"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  :for="`errorsFound-${currentSubtask.id}`"
                  class="block text-sm font-medium text-gray-700"
                  >Errores Encontrados</label
                >
                <input
                  :id="`errorsFound-${currentSubtask.id}`"
                  type="number"
                  v-model.number="currentSubtask.errorsFound"
                  min="0"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-4">
              <h5 class="text-base font-medium text-gray-700 mb-2">Observaciones:</h5>
              <div
                v-for="(obs, obsIndex) in currentSubtask.observations"
                :key="obs.id"
                class="mb-2"
              >
                <textarea
                  v-model="obs.observationText"
                  rows="2"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Escribe tu observación aquí..."
                ></textarea>
                <button
                  type="button"
                  @click.stop="removeObservation(currentSubtask, obsIndex)"
                  class="text-red-600 hover:text-red-800 text-sm mt-1"
                >
                  Eliminar Observación
                </button>
              </div>
              <button
                type="button"
                @click.stop="addObservation(currentSubtask)"
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
          <p v-else class="text-center text-gray-500">No hay subtareas para esta tarea.</p>
        </div>
        <p v-else class="text-center text-gray-500">Cargando tareas...</p>

        <div class="mt-6 flex justify-between gap-3">
          <button
            type="button"
            @click.stop="prevTask"
            :disabled="currentTaskIndex === 0"
            class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior Tarea
          </button>

          <div class="flex gap-3">
            <button
              type="button"
              @click.stop="cerrarModalYGuardar"
              class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              v-if="currentTaskIndex < currentSubModulo.tasks.length - 1"
              @click.stop="nextTask"
              class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Siguiente Tarea
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
import { ref, watch, computed, toRaw, nextTick } from 'vue'
import type { AuditModules, Task, AuditSubTask, AuditObservations } from '@/models/models'

const props = defineProps<{
  subModulo: AuditModules
}>()

const emit = defineEmits<{
  (e: 'guardar', payload: AuditModules): void
  (e: 'cerrar'): void
}>()

const currentSubModulo = ref<AuditModules>({
  id: 0,
  moduleName: '',
  compliancePercentage: 0,
  overallRating: '',
  isCompleted: false,
  tasks: [],
})

const currentTaskIndex = ref(0)
const currentSubtaskIndex = ref(0)

const currentTask = computed<Task | undefined>(() => {
  return currentSubModulo.value.tasks[currentTaskIndex.value]
})

const currentSubtask = computed<AuditSubTask | undefined>(() => {
  if (currentTask.value && currentTask.value.subtasks.length > currentSubtaskIndex.value) {
    return currentTask.value.subtasks[currentSubtaskIndex.value]
  }
  return undefined
})

const modalContent = ref<HTMLElement | null>(null)

// --- Nuevas funciones para guardado en LocalStorage y manejo de cierre ---

const LOCAL_STORAGE_KEY = `auditModule_${props.subModulo.id}` // Clave única para cada módulo

const saveToLocalStorage = (data: AuditModules) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toRaw(data)))
    console.log('Datos guardados en localStorage:', LOCAL_STORAGE_KEY)
  } catch (e) {
    console.error('Error al guardar en localStorage:', e)
  }
}

const loadFromLocalStorage = (): AuditModules | null => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedData) {
      const parsedData: AuditModules = JSON.parse(storedData)
      // Asegurarse de que el modulo cargado es el correcto por el ID, y que las tareas/subtareas existen
      if (parsedData.id === props.subModulo.id && parsedData.tasks.length > 0) {
        return parsedData
      }
    }
  } catch (e) {
    console.error('Error al cargar de localStorage:', e)
    localStorage.removeItem(LOCAL_STORAGE_KEY) // Limpiar datos corruptos
  }
  return null
}

const handleClickOutside = (event: MouseEvent) => {
  // Cierra el modal si el clic NO fue dentro del contenido del modal
  if (modalContent.value && !modalContent.value.contains(event.target as Node)) {
    cerrarModalYGuardar()
  }
}

const cerrarModalYGuardar = () => {
  saveToLocalStorage(currentSubModulo.value) // Guarda antes de cerrar
  emit('cerrar') // Emite el evento de cierre
}

// --- Fin de nuevas funciones ---

const scrollToTop = () => {
  if (modalContent.value) {
    modalContent.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToNextSubtask = () => {
  if (currentTask.value && currentSubtaskIndex.value < currentTask.value.subtasks.length - 1) {
    currentSubtaskIndex.value++
    nextTick(() => {
      scrollToTop()
    })
  }
}

const goToPrevSubtask = () => {
  if (currentSubtaskIndex.value > 0) {
    currentSubtaskIndex.value--
    nextTick(() => {
      scrollToTop()
    })
  }
}

const nextTask = () => {
  if (currentTaskIndex.value < currentSubModulo.value.tasks.length - 1) {
    currentTaskIndex.value++
    currentSubtaskIndex.value = 0
    nextTick(() => {
      scrollToTop()
    })
  }
}

const prevTask = () => {
  if (currentTaskIndex.value > 0) {
    currentTaskIndex.value--
    currentSubtaskIndex.value = 0
    nextTick(() => {
      scrollToTop()
    })
  }
}

const deepCopyAuditModule = (sourceModule: AuditModules): AuditModules => {
  const copiedModule: AuditModules = {
    ...sourceModule,
    tasks: sourceModule.tasks.map((task) => {
      const copiedTask: Task = {
        ...task,
        subtasks: task.subtasks.map((subtask) => {
          const copiedSubtask: AuditSubTask = {
            ...subtask,
            observations: subtask.observations.map((obs) => ({ ...obs })),
          }
          return copiedSubtask
        }),
      }
      return copiedTask
    }),
  }
  return copiedModule
}

const initializeTasksForExistencia = () => {
  if (currentSubModulo.value.tasks.length === 0 || props.subModulo.tasks.length === 0) {
    const initialTasks: Task[] = [
      {
        id: 1,
        taskCode: 'A',
        procedureDescription: 'Realizar inventario Selectivo a una muestra de Sku',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1,
            requerimentCode: 1,
            procedureDescription:
              'Tomar una muestra sobre la línea que presento mayor diferencia en Inventario General, verificar si están cuadrados los sku´s, evaluar según escala determinada (perdida sobre % que representa el costo de la venta, no debería sobrepasar 1%)',
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
        id: 3,
        taskCode: 'C',
        procedureDescription: 'Revision en el monitor WEB de Existencias',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1,
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
        id: 4,
        taskCode: 'D',
        procedureDescription: 'Productos para la venta',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1,
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
        id: 5,
        taskCode: 'E',
        procedureDescription: 'Seguimiento Visita Anterior',
        compliancePorcentage: 0,
        taskRating: '',
        isCompleted: false,
        subtasks: [
          {
            id: 1,
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

// Watch principal que ahora también guarda en localStorage
watch(
  currentSubModulo,
  (newVal) => {
    calculateCompliance()
    saveToLocalStorage(newVal) // Guarda automáticamente con cada cambio
  },
  { deep: true },
)

// Watch para cargar datos al inicializar el componente, pero solo si el subModulo de props no tiene tareas.
// Esto permite cargar el estado guardado si el modal se abrió previamente.
watch(
  () => props.subModulo,
  (newVal) => {
    if (newVal) {
      const loadedData = loadFromLocalStorage()
      if (loadedData) {
        currentSubModulo.value = loadedData
        // Intentar restaurar la posición si es relevante, o resetearla.
        // Aquí se resetea por simplicidad, pero podrías guardar y restaurar los índices si lo necesitas.
        currentTaskIndex.value = 0
        currentSubtaskIndex.value = 0
        console.log('Datos cargados de localStorage:', loadedData)
      } else {
        // Si no hay datos guardados o no son válidos, inicializa con los datos de props
        currentSubModulo.value = deepCopyAuditModule(toRaw(newVal))
        initializeTasksForExistencia()
        currentTaskIndex.value = 0
        currentSubtaskIndex.value = 0
        console.log('Inicializando con datos por defecto o de props.')
      }
      nextTick(() => {
        scrollToTop()
      })
    }
  },
  { immediate: true, deep: true },
)

const addObservation = (subtask: AuditSubTask) => {
  subtask.observations.push({
    id: Date.now(),
    observationText: '',
    imageUrl: '',
  })
}

const removeObservation = (subtask: AuditSubTask, index: number) => {
  subtask.observations.splice(index, 1)
}

const calculateCompliance = () => {
  currentSubModulo.value.tasks.forEach((task) => {
    let totalSamples = 0
    let totalErrors = 0
    let completedSubtasks = 0

    task.subtasks.forEach((subtask) => {
      if (subtask.auditedSamples < 0) subtask.auditedSamples = 0
      if (subtask.errorsFound < 0) subtask.errorsFound = 0
      if (subtask.errorsFound > subtask.auditedSamples) subtask.errorsFound = subtask.auditedSamples

      if (subtask.auditedSamples > 0) {
        subtask.errorPercentage = (subtask.errorsFound / subtask.auditedSamples) * 100
        subtask.compliancePercentage = 100 - subtask.errorPercentage
      } else {
        subtask.errorPercentage = 0
        subtask.compliancePercentage = 100
      }

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

    if (totalSamples > 0) {
      task.compliancePorcentage = 100 - (totalErrors / totalSamples) * 100
    } else {
      task.compliancePorcentage = 100
    }

    if (task.compliancePorcentage >= 90) {
      task.taskRating = 'Excelente'
    } else if (task.compliancePorcentage >= 70) {
      task.taskRating = 'Bueno'
    } else if (task.compliancePorcentage >= 50) {
      task.taskRating = 'Regular'
    } else {
      task.taskRating = 'Deficiente'
    }
    task.isCompleted = task.subtasks.length > 0 && completedSubtasks === task.subtasks.length
  })

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
    currentSubModulo.value.compliancePercentage = 0
  }

  if (currentSubModulo.value.compliancePercentage >= 90) {
    currentSubModulo.value.overallRating = 'Sobresaliente'
  } else if (currentSubModulo.value.compliancePercentage >= 70) {
    currentSubModulo.value.overallRating = 'Satisfactorio'
  } else if (currentSubModulo.value.compliancePercentage >= 50) {
    currentSubModulo.value.overallRating = 'Mejorable'
  } else {
    currentSubModulo.value.overallRating = 'Crítico'
  }

  currentSubModulo.value.isCompleted =
    currentSubModulo.value.tasks.length > 0 &&
    completedTasksCount === currentSubModulo.value.tasks.length
}

const guardarModulo = () => {
  calculateCompliance()
  saveToLocalStorage(currentSubModulo.value) // Asegura el guardado final
  emit('guardar', currentSubModulo.value)
}
</script>
