// src/components/forms/AuditModuleForm.vue
<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Fondo oscuro -->
        <Transition name="modal-fade">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              class="absolute inset-0 bg-gray-500 opacity-75"
              @click.self="cerrarFormulario"
            ></div>
          </div>
        </Transition>

        <!-- Contenido del modal -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          <div class="bg-white px-8 pt-5 pb-4 sm:p-8 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h2 class="text-xl font-bold mb-4">Información General</h2>

                <form class="space-y-6" @submit.prevent="guardarFormulario">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="pais" class="block text-sm font-medium text-gray-700">País</label>
                      <select
                        id="pais"
                        v-model="auditHeaders.country"
                        required
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
                      >
                        <option value="" disabled>Seleccionar país...</option>
                        <option v-for="t in countries" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label for="tienda" class="block text-sm font-medium text-gray-700"
                        >Tienda</label
                      >
                      <select
                        id="tienda"
                        v-model="auditHeaders.storeName"
                        required
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
                      >
                        <option value="" disabled>Seleccionar tienda...</option>
                        <option v-for="t in stores" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label for="jefeTienda" class="block text-sm font-medium text-gray-700"
                        >Jefe de Tienda</label
                      >
                      <input
                        id="jefeTienda"
                        v-model="auditHeaders.storeManager"
                        type="text"
                        required
                        placeholder="Nombre del jefe..."
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
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
                        v-model="auditHeaders.auditorName"
                        type="text"
                        disabled
                        class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
                      />
                    </div>

                    <div class="space-y-2">
                      <label for="fechaAuditoria" class="block text-sm font-medium text-gray-700"
                        >Fecha de Auditoría</label
                      >
                      <input
                        id="fechaAuditoria"
                        v-model="auditHeaders.auditDate"
                        type="text"
                        disabled
                        class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="estado" class="block text-sm font-medium text-gray-700"
                      >Estado</label
                    >
                    <input
                      id="estado"
                      :value="stateText"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
                    />
                  </div>

                  <div class="space-y-2">
                    <label for="observaciones" class="block text-sm font-medium text-gray-700"
                      >Observaciones Generales</label
                    >
                    <textarea
                      id="observaciones"
                      v-model="auditHeaders.observations"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
                    ></textarea>
                  </div>

                  <!-- Botones -->
                  <div class="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      @click="cerrarFormulario"
                      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, watch, computed, ref } from 'vue' // Importa ref
import type { AuditHeaders } from '@/models/models'

const emit = defineEmits(['guardado', 'cerrar'])
const props = defineProps<{
  auditHeaders: AuditHeaders
  show: Boolean
}>()

// Crea una copia interna del objeto de props para trabajar localmente.
// Esto previene mutaciones directas a las props.
const internalAuditHeaders = ref<AuditHeaders>({ ...props.auditHeaders })

// Observa cambios en el prop 'auditHeaders' y actualiza la copia interna
// Esto es crucial para cuando el padre carga un draft y lo pasa al formulario.
watch(
  () => props.auditHeaders,
  (newValue) => {
    internalAuditHeaders.value = { ...newValue }
  },
  { deep: true, immediate: true }, // 'immediate' para que se ejecute al montar
)

const stores = ['Sucursal Santiago', 'Sucursal La Serena', 'Sucursal Rancagua']
const countries = ['Chile', 'Colombia']
const stateText = computed(() => {
  return internalAuditHeaders.value.isCompleted ? 'Completado' : 'Incompleto'
})

const guardarFormulario = () => {
  // Emitimos la copia interna del objeto, que ya tiene los cambios del formulario
  console.log()
  emit('guardado', internalAuditHeaders.value)
}

const cerrarFormulario = () => {
  emit('cerrar')
}
</script>
<style scoped>
/* Transición del modal principal */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Transición del fondo oscuro */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 0.75;
}
</style>
