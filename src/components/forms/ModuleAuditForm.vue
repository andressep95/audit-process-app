  <template>
    <Transition name="modal" appear>
      <div
        v-if="subModulo"
        class="fixed inset-0 bg-gray-900 bg-opacity-40 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4"
        @click="handleClickOutside"
      >
        <div
          ref="modalContent"
          class="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full relative border border-gray-100"
          tabindex="-1"
        >
          <div v-if="currentSubModulo">
            <h3 class="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">
              Módulo: {{ currentSubModulo.moduleName }}
            </h3>

            <form @submit.prevent="guardarModulo" class="space-y-8">
              <div
                v-if="currentTask"
                :key="currentTask.id"
                class="border border-gray-200 rounded-xl p-6 bg-white shadow-lg"
              >
                <div
                  v-if="currentTask.subtasks.length > 0"
                  class="flex justify-between items-center mb-6 border-b pb-4 border-gray-200"
                >
                  <h5 class="text-lg font-semibold text-gray-700">
                    {{ `${currentTask?.taskCode}. ${currentTask?.procedureDescription} Subtarea` }}
                    {{ currentSubtaskIndex + 1 }} de
                    {{ currentTask?.subtasks.length }}
                  </h5>
                  <div class="space-x-2">
                    <button
                      type="button"
                      @click.stop="goToPrevSubtask"
                      :disabled="!canGoPrevSubtask"
                      class="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      @click.stop="goToNextSubtask"
                      :disabled="!canGoNextSubtask"
                      class="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                <div
                  v-if="currentSubtask"
                  :key="currentSubtask.id"
                  class="mb-4 bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-inner"
                >
                  <div class="flex items-start justify-between mb-3">
                    <p class="text-base text-gray-800 font-medium">
                      {{ currentTask?.taskCode }}.{{ currentSubtask?.requerimentCode }}
                      {{ currentSubtask?.procedureDescription }}
                    </p>
                    <button
                      v-if="currentSubtask?.visualAid"
                      @click.stop="openVisualAidModal(currentSubtask.visualAid)"
                      class="ml-2 w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-400 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold transition-all shadow-sm p-0 aspect-square"
                      style="min-width: 1.75rem; line-height: 1;"
                    >
                      ?
                    </button>
                  </div>

                  <p class="text-sm text-gray-600 mb-4">
                    Nivel de Riesgo: <span class="font-semibold">{{ currentSubtask.riskLevel }}</span>
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label
                        :for="`auditedSamples-${currentSubtask.id}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Muestras Auditadas
                      </label>
                      <input
                        :id="`auditedSamples-${currentSubtask.id}`"
                        type="number"
                        v-model.number="currentSubtask.auditedSamples"
                        min="0"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label
                        :for="`errorsFound-${currentSubtask.id}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Errores Encontrados
                      </label>
                      <input
                        :id="`errorsFound-${currentSubtask.id}`"
                        type="number"
                        v-model.number="currentSubtask.errorsFound"
                        min="0"
                        :max="currentSubtask.auditedSamples"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div class="mt-5 text-right">
                    <button
                      type="button"
                      @click.stop="openObservationModal"
                      class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Gestionar Observaciones
                    </button>
                  </div>
                </div>
                <p v-else class="text-gray-500 italic p-4 text-center">
                  No hay subtareas definidas para esta tarea.
                </p>
              </div>

              <p v-else class="text-gray-500 italic p-4 text-center">
                No hay tareas definidas para este módulo.
              </p>

              <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click.stop="goToPrevTask"
                  :disabled="!canGoPrevTask"
                  class="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Tarea Anterior
                </button>

                <div class="flex gap-4">
                  <button
                    type="button"
                    @click.stop="cerrarModalYGuardar"
                    class="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    v-if="currentSubModulo && currentTaskIndex < currentSubModulo.tasks.length - 1"
                    @click.stop="goToNextTask"
                    class="px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors"
                  >
                    Siguiente Tarea
                  </button>
                  <button
                    type="submit"
                    v-else
                    class="px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors"
                  >
                    Guardar Módulo
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-else class="text-center p-6 text-gray-700">
            <p class="text-xl">Cargando módulo...</p>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal" appear>
      <div
        v-if="showIncompleteTasksWarningModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center z-[100] p-4"
        @click.self="showIncompleteTasksWarningModal = false"
      >
        <div
          class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative border border-gray-100"
        >
          <h4 class="text-2xl font-bold mb-4 text-gray-800 text-center">Tareas Pendientes</h4>
          <p class="mb-6 text-gray-700 leading-relaxed">
            Tiene tareas sin culminar en las siguientes secciones:
          </p>
          <ul class="list-disc list-inside mb-8 text-gray-600 space-y-2 pl-4">
            <li v-for="task in incompleteTasksList" :key="task.id" class="text-base">
              <span class="font-semibold text-gray-800">{{ task.taskCode }}:</span>
              {{ task.procedureDescription }}
            </li>
          </ul>
          <button
            type="button"
            @click="showIncompleteTasksWarningModal = false"
            class="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors w-full text-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="modal" appear>
      <div
        v-if="showObservationModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-20 flex justify-center items-center z-[110] p-4"
        @click.self="closeObservationModal"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative border border-gray-100"
        >
          <h5 class="text-lg font-semibold mb-4 text-gray-800">
            Observación para: {{ currentSubtask?.requerimentCode }}
          </h5>
          <textarea
            v-if="currentSubtask?.observations?.[0]"
            v-model="currentSubtask.observations[0].observationText"
            rows="5"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm bg-white text-gray-800"
            placeholder="Escriba aquí sus observaciones..."
          ></textarea>
          <div class="mt-4">
            <label for="observation-image-url" class="block text-sm font-medium text-gray-700 mb-1">
              URL de la imagen (opcional)
            </label>
            <input
              id="observation-image-url"
              type="text"
              v-if="currentSubtask?.observations?.[0]"
              v-model="currentSubtask.observations[0].imageUrl"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm bg-white text-gray-800"
              placeholder="Pega la URL de la imagen aquí..."
            />
          </div>

          <div class="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeObservationModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              @click="saveObservation"
              class="px-4 py-2 bg-gray-800 text-white rounded-md shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors"
            >
              Guardar Observación
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal" appear>
      <div
        v-if="showVisualAidModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center z-[120] p-4"
        @click.self="closeVisualAidModal"
      >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative border border-gray-100">
          <h5 class="text-lg font-semibold mb-4 text-gray-800">Ayuda Visual</h5>
          <p class="text-sm text-gray-700 whitespace-pre-line">
            {{ currentVisualAidContent }}
          </p>
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              @click="closeVisualAidModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </template>

  <script setup lang="ts">
  import { ref, watch, computed, nextTick, toRaw } from 'vue'
  import type { AuditModules, Task, AuditSubTask, AuditObservations } from '@/models/models'
  import { calculateModuleCompliance } from '@/utils/auditCalculations'
  import { getInitialTasksForModule } from '@/utils/moduleTasksInitializers'

  const props = defineProps<{
    subModulo: AuditModules | null
  }>()

  const emit = defineEmits<{
    (e: 'guardar', subModulo: AuditModules): void
    (e: 'cerrar'): void
  }>()

  const currentSubModulo = ref<AuditModules | null>(null)
  const currentTaskIndex = ref(0)
  const currentSubtaskIndex = ref(0)
  const modalContent = ref<HTMLElement | null>(null)

  const showIncompleteTasksWarningModal = ref(false)
  const showObservationModal = ref(false)

  const MODULE_PREFIX = 'auditModule_'

  const currentTask = computed<Task | undefined>(() => {
    return currentSubModulo.value?.tasks[currentTaskIndex.value]
  })

  const currentSubtask = computed<AuditSubTask | undefined>(() => {
    const subtask = currentTask.value?.subtasks[currentSubtaskIndex.value]
    // Si la subtask existe pero no tiene auditObservations, la inicializamos para reactividad.
    // Idealmente, getInitialTasksForModule ya debería crear esta propiedad.
    if (subtask && !('auditObservations' in subtask)) {
      ;(subtask as AuditSubTask & { auditObservations?: AuditObservations[] }).auditObservations = []
    }
    return subtask
  })

  const incompleteTasksList = computed(() => {
    if (!currentSubModulo.value) return []
    return currentSubModulo.value.tasks.filter((task) => !task.isCompleted)
  })

  const canGoNextSubtask = computed(() => {
    return currentTask.value && currentSubtaskIndex.value < currentTask.value.subtasks.length - 1
  })

  const canGoPrevSubtask = computed(() => {
    return currentSubtaskIndex.value > 0
  })

  /*
  const canGoNextTask = computed(() => {
    return currentSubModulo.value && currentTaskIndex.value < currentSubModulo.value.tasks.length - 1
  })
  */
  const canGoPrevTask = computed(() => {
    return currentTaskIndex.value > 0
  })

  const saveToLocalStorage = (module: AuditModules) => {
    localStorage.setItem(`${MODULE_PREFIX}${module.id}`, JSON.stringify(toRaw(module)))
  }

  const loadFromLocalStorage = (moduleId: number): AuditModules | null => {
    const stored = localStorage.getItem(`${MODULE_PREFIX}${moduleId}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.id === moduleId && parsed.tasks) {
          // Al cargar desde localStorage, aseguramos que 'auditObservations' exista
          // y que sus propiedades 'observationText' y 'imageUrl' sean strings.
          parsed.tasks.forEach((task: Task) => {
            task.subtasks.forEach((subtask: AuditSubTask) => {
              if (!subtask.observations) {
                subtask.observations = []
              }
              if (subtask.observations[0]) {
                // Aseguramos que los campos de la primera observación sean strings, no undefined/null
                if (typeof subtask.observations[0].observationText !== 'string') {
                  subtask.observations[0].observationText = ''
                }
                if (typeof subtask.observations[0].imageUrl !== 'string') {
                  subtask.observations[0].imageUrl = ''
                }
              }
            })
          })
          return parsed as AuditModules
        }
        throw new Error('Datos de módulo inválidos en localStorage.')
      } catch (e) {
        console.error(`Error al cargar o parsear módulo ${moduleId} de localStorage:`, e)
        localStorage.removeItem(`${MODULE_PREFIX}${moduleId}`)
        return null
      }
    }
    return null
  }

  const initializeObservations = (subtask: AuditSubTask) => {
    // Aseguramos que el array 'auditObservations' exista
    if (!subtask.observations) {
      subtask.observations = []
    }

    // Si el array está vacío o la primera observación no existe, la creamos
    if (subtask.observations.length === 0 || !subtask.observations[0]) {
      subtask.observations[0] = { id: 1, observationText: '', imageUrl: '' }
    } else {
      // Si ya existe una observación, nos aseguramos de que sus propiedades sean strings
      if (typeof subtask.observations[0].observationText !== 'string') {
        subtask.observations[0].observationText = ''
      }
      if (typeof subtask.observations[0].imageUrl !== 'string') {
        subtask.observations[0].imageUrl = ''
      }
    }
  }

  const openObservationModal = () => {
    if (currentSubtask.value) {
      initializeObservations(currentSubtask.value)
      showObservationModal.value = true
    }
  }

  const closeObservationModal = () => {
    showObservationModal.value = false
  }

  const saveObservation = () => {
    // No hay lógica explícita aquí, ya que v-model maneja la actualización
    // de las propiedades de la observación directamente.
    closeObservationModal()
  }

  const goToNextSubtask = () => {
    if (currentTask.value && currentSubtaskIndex.value < currentTask.value.subtasks.length - 1) {
      currentSubtaskIndex.value++
      if (currentSubtask.value) {
        initializeObservations(currentSubtask.value)
      }
      scrollToTop()
    }
  }

  const goToPrevSubtask = () => {
    if (currentSubtaskIndex.value > 0) {
      currentSubtaskIndex.value--
      if (currentSubtask.value) {
        initializeObservations(currentSubtask.value)
      }
      scrollToTop()
    }
  }

  const goToNextTask = () => {
    if (currentSubModulo.value && currentTaskIndex.value < currentSubModulo.value.tasks.length - 1) {
      currentTaskIndex.value++
      currentSubtaskIndex.value = 0 // Reinicia el índice de subtarea al cambiar de tarea
      if (currentSubtask.value) {
        initializeObservations(currentSubtask.value)
      }
      scrollToTop()
    }
  }

  const goToPrevTask = () => {
    if (currentTaskIndex.value > 0) {
      currentTaskIndex.value--
      currentSubtaskIndex.value = 0 // Reinicia el índice de subtarea al cambiar de tarea
      if (currentSubtask.value) {
        initializeObservations(currentSubtask.value)
      }
      scrollToTop()
    }
  }

  const scrollToTop = () => {
    if (modalContent.value) {
      modalContent.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const cerrarModalYGuardar = () => {
    if (currentSubModulo.value) {
      currentSubModulo.value = calculateModuleCompliance(currentSubModulo.value)
      saveToLocalStorage(currentSubModulo.value)
      emit('guardar', currentSubModulo.value)
    }
    emit('cerrar')
  }

  const guardarModulo = () => {
    if (!currentSubModulo.value || showVisualAidModal.value || showObservationModal.value) return;

    currentSubModulo.value = calculateModuleCompliance(currentSubModulo.value)

    let hasIncompleteTasksDetected = false
    for (const task of currentSubModulo.value.tasks) {
      // Si una tarea no tiene subtareas, se considera completada por defecto.
      if (task.subtasks.length === 0) {
        task.isCompleted = true
        continue
      }

      let allSubtasksAudited = true
      for (const subtask of task.subtasks) {
        // Una subtarea se considera "auditada" si tiene al menos 1 muestra auditada.
        if (subtask.auditedSamples < 1) {
          allSubtasksAudited = false
          break
        }
      }
      task.isCompleted = allSubtasksAudited // La tarea se completa si todas sus subtareas están auditadas
      if (!task.isCompleted) {
        hasIncompleteTasksDetected = true
      }
    }

    // El módulo se completa si no hay ninguna tarea incompleta.
    currentSubModulo.value.isCompleted = !hasIncompleteTasksDetected

    if (hasIncompleteTasksDetected) {
      showIncompleteTasksWarningModal.value = true
      console.warn(
        'Módulo con tareas incompletas. Mostrando advertencia y no realizando guardado final.',
      )
      return
    }

    saveToLocalStorage(currentSubModulo.value)
    emit('guardar', currentSubModulo.value)
    console.log('Módulo guardado y marcado como completado.')
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (modalContent.value && !modalContent.value.contains(event.target as Node)) {
      cerrarModalYGuardar()
    }
  }

  watch(
    () => props.subModulo,
    (newVal) => {
      if (newVal) {
        const loadedData = loadFromLocalStorage(newVal.id)
        if (loadedData) {
          currentSubModulo.value = loadedData
          // Aseguramos que todas las subtareas cargadas tengan sus observaciones inicializadas
          currentSubModulo.value.tasks.forEach((task) => {
            task.subtasks.forEach((subtask) => {
              initializeObservations(subtask)
            })
          })
          console.log('Datos de módulo cargados desde localStorage:', toRaw(loadedData))
        } else {
          const initialTasks = getInitialTasksForModule(newVal.id)
          currentSubModulo.value = { ...newVal, tasks: initialTasks }
          // Aseguramos que todas las subtareas del nuevo módulo tengan sus observaciones inicializadas
          currentSubModulo.value.tasks.forEach((task) => {
            task.subtasks.forEach((subtask) => {
              initializeObservations(subtask)
            })
          })
          console.log('Módulo inicializado con tareas por defecto:', toRaw(currentSubModulo.value))
        }
        currentTaskIndex.value = 0
        currentSubtaskIndex.value = 0
        nextTick(() => {
          scrollToTop()
        })
      }
    },
    { immediate: true, deep: true },
  )

  watch(
    currentSubModulo,
    (newVal) => {
      if (newVal) {
        calculateModuleCompliance(newVal)
        console.log('currentSubModulo actualizado, cumplimiento recalculado.', toRaw(newVal))
      }
    },
    { deep: true },
  )

  const showVisualAidModal = ref(false)
  const currentVisualAidContent = ref('')

  const openVisualAidModal = (content: string) => {
    currentVisualAidContent.value = content
    showVisualAidModal.value = true
  }

  const closeVisualAidModal = () => {
    showVisualAidModal.value = false
    currentVisualAidContent.value = ''
  }
  </script>

  <style scoped>
  /* Transición del modal principal */
  /* Aplicada al div directamente envuelto por <Transition name="modal"> */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease; /* Solo opacidad para el contenedor general (fondo incluido) */
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-to,
  .modal-leave-from {
    opacity: 1;
  }

  /* Estilos para ocultar las flechas de los inputs numéricos */
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
  </style>
