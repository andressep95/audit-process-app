<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sistema de Auditoría</h1>
        <p class="text-gray-600">Gestión de módulos y submódulos de auditoría</p>
      </div>

      <!-- Navigation -->
      <div class="flex gap-4 mb-8">
        <button
          :class="[
            'px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors',
            activeForm === 'main'
              ? 'bg-black text-white'
              : 'bg-white shadow-md text-gray-800 hover:bg-gray-50',
          ]"
          @click="activeForm = 'main'"
        >
          <Store class="w-4 h-4" />
          Módulo Principal
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors',
            activeForm === 'sub'
              ? 'bg-black text-white'
              : 'bg-white shadow-md text-gray-800 hover:bg-gray-50',
          ]"
          @click="activeForm = 'sub'"
        >
          <FileText class="w-4 h-4" />
          Submódulos
        </button>
      </div>

      <!-- Main Form -->
      <div v-if="activeForm === 'main'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex items-center gap-2 font-semibold text-lg">
                <Store class="w-5 h-5" />
                Información General
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Complete los datos principales del módulo de auditoría
              </p>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="tienda" class="block text-sm font-medium text-gray-700">Tienda</label>
                  <input
                    id="tienda"
                    v-model="modulo.tienda"
                    type="text"
                    placeholder="Seleccionar tienda..."
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div class="space-y-2">
                  <label for="jefeTienda" class="block text-sm font-medium text-gray-700"
                    >Jefe de Tienda</label
                  >
                  <input
                    id="jefeTienda"
                    v-model="modulo.jefeTienda"
                    type="text"
                    placeholder="Seleccionar jefe..."
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="auditor" class="block text-sm font-medium text-gray-700"
                    >Auditor</label
                  >
                  <input
                    id="auditor"
                    v-model="modulo.auditor"
                    type="text"
                    placeholder="Seleccionar auditor..."
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div class="space-y-2">
                  <label for="fechaVenta" class="block text-sm font-medium text-gray-700"
                    >Fecha de Venta</label
                  >
                  <input
                    id="fechaVenta"
                    v-model="modulo.fechaVenta"
                    type="date"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  id="estado"
                  v-model="modulo.estado"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="completa">Completa</option>
                  <option value="incompleta">Incompleta</option>
                </select>
              </div>

              <div class="space-y-2">
                <label for="observaciones" class="block text-sm font-medium text-gray-700"
                  >Observaciones Generales</label
                >
                <textarea
                  id="observaciones"
                  v-model="modulo.observacionesGenerales"
                  placeholder="Ingrese observaciones generales..."
                  rows="4"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="space-y-6">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex items-center gap-2 font-semibold text-lg">
                <Eye class="w-5 h-5" />
                Resumen
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Estado:</span>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    modulo.estado === 'completa'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ modulo.estado }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Submódulos:</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {{ modulo.subModulo.length }}
                </span>
              </div>
              <div class="border-t my-2"></div>
              <button
                class="w-full py-2 px-4 bg-white shadow-md text-black hover:bg-gray-50 rounded-md flex items-center justify-center gap-2"
              >
                <Save class="w-4 h-4" />
                Guardar Módulo
              </button>
            </div>
          </div>

          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 border-b">
              <div class="text-sm font-semibold">Submódulos Registrados</div>
            </div>
            <div class="p-6">
              <p
                v-if="modulo.subModulo.length === 0"
                class="text-sm text-gray-500 text-center py-4"
              >
                No hay submódulos registrados
              </p>
              <div v-else class="space-y-2">
                <div
                  v-for="(sub, index) in modulo.subModulo"
                  :key="sub.id"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div class="flex items-center gap-2">
                    <component :is="getTipoIcon(sub.tipo)" class="w-4 h-4" />
                    <span class="text-sm font-medium">
                      {{ getTipoNombre(sub.tipo) || 'Sin tipo' }}: {{ sub.rc || 'Sin código' }}
                    </span>
                  </div>
                  <button
                    @click="removeSubModulo(sub.id)"
                    class="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex items-center justify-center"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub Module Form with Pagination -->
      <div v-if="activeForm === 'sub'" class="space-y-6">
        <!-- Navegación de submódulos compacta -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="py-4 px-6">
            <div class="flex flex-wrap gap-2 justify-center">
              <button
                v-for="tipo in tiposSubModulos"
                :key="tipo.id"
                @click="selectTipoSubModulo(tipo.id)"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors',
                  selectedTipoId === tipo.id
                    ? 'bg-black text-white'
                    : 'bg-white shadow-sm hover:bg-gray-50',
                ]"
              >
                <component :is="tipo.icono" class="w-4 h-4" />
                {{ tipo.nombre }}
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario de submódulo (solo visible si se ha seleccionado un tipo) -->
        <div v-if="selectedTipoId" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 font-semibold text-lg">
                  <component :is="currentTipo?.icono" class="w-5 h-5" />
                  <span>
                    Submódulo: {{ currentTipo?.nombre }}
                    <span v-if="currentSubModulo.id"> (Editando)</span>
                  </span>
                </div>
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', currentTipo?.color]">
                  {{ currentTipo?.nombre }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Complete los datos del submódulo de {{ currentTipo?.nombre.toLowerCase() }}
              </p>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="rc" class="block text-sm font-medium text-gray-700">RC</label>
                  <input
                    id="rc"
                    v-model="currentSubModulo.rc"
                    type="text"
                    placeholder="Código RC..."
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div class="space-y-2">
                  <label for="procedimiento" class="block text-sm font-medium text-gray-700"
                    >Procedimiento</label
                  >
                  <select
                    id="procedimiento"
                    v-model="currentSubModulo.procedimiento"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option v-for="proc in currentTipo?.procedimientos" :key="proc" :value="proc">
                      {{ proc }}
                    </option>
                    <option value="otro">Otro procedimiento...</option>
                  </select>
                  <input
                    v-if="currentSubModulo.procedimiento === 'otro'"
                    v-model="otherProcedimiento"
                    type="text"
                    placeholder="Especifique el procedimiento..."
                    class="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="riesgo" class="block text-sm font-medium text-gray-700">Riesgo</label>
                <select
                  id="riesgo"
                  v-model="currentSubModulo.riesgo"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="muestra" class="block text-sm font-medium text-gray-700"
                    >Muestra</label
                  >
                  <input
                    id="muestra"
                    v-model.number="currentSubModulo.muestra"
                    type="number"
                    placeholder="0"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div class="space-y-2">
                  <label for="errores" class="block text-sm font-medium text-gray-700"
                    >Errores</label
                  >
                  <input
                    id="errores"
                    v-model.number="currentSubModulo.errores"
                    type="number"
                    placeholder="0"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="errorPorcentual" class="block text-sm font-medium text-gray-700"
                    >Error Porcentual</label
                  >
                  <input
                    id="errorPorcentual"
                    v-model="currentSubModulo.errorPorcentual"
                    type="text"
                    placeholder="0%"
                    disabled
                    class="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    for="cumplimientoPorcentual"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Cumplimiento Porcentual
                  </label>
                  <input
                    id="cumplimientoPorcentual"
                    v-model="currentSubModulo.cumplimientoPorcentual"
                    type="text"
                    placeholder="0%"
                    disabled
                    class="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="calificacion" class="block text-sm font-medium text-gray-700"
                  >Calificación</label
                >
                <select
                  id="calificacion"
                  v-model="currentSubModulo.calificacion"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="excelente">Excelente</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="deficiente">Deficiente</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex items-center gap-2 font-semibold text-lg">
                <AlertTriangle class="w-5 h-5" />
                Observaciones
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Agregue observaciones específicas para este submódulo
              </p>
            </div>
            <div class="p-6 space-y-4">
              <div
                v-for="(obs, index) in currentSubModulo.observaciones"
                :key="index"
                class="p-4 border rounded-lg space-y-2"
              >
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium">Observación {{ index + 1 }}</label>
                  <button
                    @click="removeObservacion(index)"
                    class="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex items-center justify-center"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  v-model="obs.observacion"
                  placeholder="Descripción de la observación..."
                  rows="2"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                ></textarea>
                <input
                  v-model="obs.image"
                  type="text"
                  placeholder="URL de la imagen..."
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div class="flex gap-2">
                <button
                  @click="addObservacion"
                  class="px-4 py-2 bg-white shadow-md text-gray-800 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <Plus class="w-4 h-4" />
                  Agregar Observación
                </button>
              </div>

              <div class="border-t my-2"></div>

              <div class="flex gap-2">
                <button
                  @click="addSubModulo"
                  class="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-md flex items-center justify-center gap-2"
                >
                  <Check class="w-4 h-4" />
                  {{ currentSubModulo.id ? 'Guardar Cambios' : 'Guardar Submódulo' }}
                </button>
                <button
                  @click="cancelEdit"
                  class="px-4 py-2 bg-white shadow-md text-gray-800 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <X class="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no se ha seleccionado ningún tipo -->
        <div v-if="!selectedTipoId" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-8 text-center">
            <div class="flex justify-center mb-4">
              <FileText class="h-10 w-10 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium mb-2">Seleccione una categoría</h3>
            <p class="text-gray-500">
              Elija una de las categorías de submódulos para comenzar a crear o editar un submódulo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  Store,
  FileText,
  Eye,
  Save,
  Trash2,
  AlertTriangle,
  Plus,
  Check,
  X,
  Settings,
  PenToolIcon as Tool,
  Users,
  Package,
  BarChart,
  ShieldAlert,
  Truck,
} from 'lucide-vue-next'

// Tipos de submódulos predefinidos
const tiposSubModulos = [
  {
    id: 'administracion',
    nombre: 'Administración',
    icono: Settings,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    procedimientos: ['Control de documentos', 'Gestión financiera', 'Procesos administrativos'],
  },
  {
    id: 'mantencion',
    nombre: 'Mantención',
    icono: Tool,
    color: 'bg-green-50 border-green-200 text-green-700',
    procedimientos: ['Mantenimiento preventivo', 'Reparaciones', 'Gestión de equipos'],
  },
  {
    id: 'rrhh',
    nombre: 'RRHH',
    icono: Users,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    procedimientos: ['Contratación', 'Capacitación', 'Evaluación de desempeño'],
  },
  {
    id: 'merma',
    nombre: 'Merma',
    icono: Package,
    color: 'bg-red-50 border-red-200 text-red-700',
    procedimientos: ['Control de inventario', 'Gestión de pérdidas', 'Prevención'],
  },
  {
    id: 'ventas',
    nombre: 'Ventas',
    icono: BarChart,
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    procedimientos: ['Proceso de venta', 'Atención al cliente', 'Promociones'],
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad',
    icono: ShieldAlert,
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    procedimientos: ['Protocolos de seguridad', 'Control de acceso', 'Prevención de riesgos'],
  },
  {
    id: 'logistica',
    nombre: 'Logística',
    icono: Truck,
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    procedimientos: ['Recepción de mercadería', 'Almacenamiento', 'Distribución'],
  },
]

// Estado principal
const activeForm = ref('main')
const modulo = reactive({
  tienda: '',
  jefeTienda: '',
  auditor: '',
  fechaVenta: '',
  estado: 'incompleta',
  observacionesGenerales: '',
  subModulo: [],
})

// Estado para el submódulo actual
const currentSubModulo = reactive({
  id: '',
  tipo: '',
  rc: '',
  procedimiento: '',
  riesgo: '',
  muestra: 0,
  errores: 0,
  errorPorcentual: '',
  cumplimientoPorcentual: '',
  calificacion: '',
  observaciones: [],
})

// Estado para el tipo de submódulo seleccionado
const selectedTipoId = ref(null)
const otherProcedimiento = ref('')

// Obtener el tipo de submódulo actual
const currentTipo = computed(() => {
  return tiposSubModulos.find((t) => t.id === selectedTipoId.value)
})

// Generar ID único para submódulos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Añadir o actualizar submódulo
const addSubModulo = () => {
  // Si se está usando "otro procedimiento", actualizar el valor
  if (currentSubModulo.procedimiento === 'otro' && otherProcedimiento.value) {
    currentSubModulo.procedimiento = otherProcedimiento.value
  }

  const newSubModulo = {
    ...currentSubModulo,
    id: currentSubModulo.id || generateId(),
  }

  // Verificar si ya existe un submódulo con este ID (edición)
  const existingIndex = modulo.subModulo.findIndex((sub) => sub.id === currentSubModulo.id)

  if (existingIndex >= 0) {
    // Actualizar submódulo existente
    modulo.subModulo[existingIndex] = { ...newSubModulo }
  } else {
    // Agregar nuevo submódulo
    modulo.subModulo.push({ ...newSubModulo })
  }

  // Resetear el formulario pero mantener el tipo seleccionado
  const tipoActual = currentSubModulo.tipo
  Object.assign(currentSubModulo, {
    id: '',
    tipo: tipoActual,
    rc: '',
    procedimiento: '',
    riesgo: '',
    muestra: 0,
    errores: 0,
    errorPorcentual: '',
    cumplimientoPorcentual: '',
    calificacion: '',
    observaciones: [],
  })
  otherProcedimiento.value = ''
}

// Editar submódulo existente
const editSubModulo = (subModulo) => {
  Object.assign(currentSubModulo, { ...subModulo })
  selectedTipoId.value = subModulo.tipo

  // Si es "otro procedimiento", configurar el campo adicional
  if (!currentTipo.value?.procedimientos.includes(currentSubModulo.procedimiento)) {
    otherProcedimiento.value = currentSubModulo.procedimiento
    currentSubModulo.procedimiento = 'otro'
  }
}

// Cancelar edición
const cancelEdit = () => {
  selectedTipoId.value = null
  Object.assign(currentSubModulo, {
    id: '',
    tipo: '',
    rc: '',
    procedimiento: '',
    riesgo: '',
    muestra: 0,
    errores: 0,
    errorPorcentual: '',
    cumplimientoPorcentual: '',
    calificacion: '',
    observaciones: [],
  })
  otherProcedimiento.value = ''
}

// Eliminar submódulo
const removeSubModulo = (id) => {
  if (!id) return
  const index = modulo.subModulo.findIndex((sub) => sub.id === id)
  if (index !== -1) {
    modulo.subModulo.splice(index, 1)
  }
}

// Añadir observación
const addObservacion = () => {
  currentSubModulo.observaciones.push({ observacion: '', image: '' })
}

// Eliminar observación
const removeObservacion = (index) => {
  currentSubModulo.observaciones.splice(index, 1)
}

// Seleccionar tipo de submódulo
const selectTipoSubModulo = (tipoId) => {
  selectedTipoId.value = tipoId
  const tipo = tiposSubModulos.find((t) => t.id === tipoId)

  // Actualizar el submódulo actual con el tipo seleccionado
  currentSubModulo.tipo = tipoId
  // Si hay procedimientos predefinidos para este tipo, sugerir el primero
  if (tipo && tipo.procedimientos.length > 0) {
    currentSubModulo.procedimiento = tipo.procedimientos[0]
  }
}

// Obtener nombre del tipo de submódulo
const getTipoNombre = (tipoId) => {
  const tipo = tiposSubModulos.find((t) => t.id === tipoId)
  return tipo?.nombre
}

// Obtener icono del tipo de submódulo
const getTipoIcon = (tipoId) => {
  const tipo = tiposSubModulos.find((t) => t.id === tipoId)
  return tipo?.icono || FileText
}

// Calcular porcentajes automáticamente cuando cambian muestra o errores
watch([() => currentSubModulo.muestra, () => currentSubModulo.errores], ([muestra, errores]) => {
  if (muestra > 0) {
    const errorPct = ((errores / muestra) * 100).toFixed(2)
    const cumplimientoPct = (100 - parseFloat(errorPct)).toFixed(2)

    currentSubModulo.errorPorcentual = `${errorPct}%`
    currentSubModulo.cumplimientoPorcentual = `${cumplimientoPct}%`
  }
})
</script>
