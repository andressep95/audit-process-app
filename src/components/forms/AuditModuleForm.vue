<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center"
    @click.self="cerrarFormulario"
  >
    <div class="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-y-auto p-8 max-h-[90vh]">
      <h2 class="text-xl font-bold mb-4">Información General</h2>

      <form class="space-y-6" @submit.prevent="guardarFormulario">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="pais" class="block text-sm font-medium text-gray-700">Pais</label>
            <select
              id="pais"
              v-model="modulo.pais"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="" disabled>Seleccionar pais...</option>
              <option v-for="t in paises" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="tienda" class="block text-sm font-medium text-gray-700">Tienda</label>
            <select
              id="tienda"
              v-model="modulo.tienda"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="" disabled>Seleccionar tienda...</option>
              <option v-for="t in tiendas" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="jefeTienda" class="block text-sm font-medium text-gray-700"
              >Jefe de Tienda</label
            >
            <input
              id="jefeTienda"
              v-model="modulo.jefeTienda"
              type="text"
              required
              placeholder="Nombre del jefe..."
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="auditor" class="block text-sm font-medium text-gray-700">Auditor</label>
            <input
              id="auditor"
              v-model="modulo.auditor"
              type="text"
              disabled
              class="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div class="space-y-2">
            <label for="fechaAuditoria" class="block text-sm font-medium text-gray-700"
              >Fecha de Auditoría</label
            >
            <input
              id="fechaAuditoria"
              v-model="modulo.fechaAuditoria"
              type="text"
              disabled
              class="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
          <input
            id="estado"
            v-model="modulo.estado"
            type="text"
            disabled
            class="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div class="space-y-2">
          <label for="observaciones" class="block text-sm font-medium text-gray-700"
            >Observaciones Generales</label
          >
          <textarea
            id="observaciones"
            v-model="modulo.observacionesGenerales"
            rows="4"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          ></textarea>
        </div>

        <div class="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            @click="cerrarFormulario"
            class="bg-gray-50 text-gray-800 hover:bg-gray-100 px-8 py-2 rounded-lg shadow-md transition"
          >
            Cerrar
          </button>
          <button
            type="submit"
            class="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg shadow-md transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, watch } from 'vue'
import type { Modulo } from '@/models/models'

const emit = defineEmits(['guardado', 'cerrar'])
const props = defineProps<{
  modulo: Modulo
}>()

const tiendas = ['Sucursal Santiago', 'Sucursal La Serena', 'Sucursal Rancagua']
const paises = ['Chile', 'Colombia']

watch(
  () => props.modulo,
  (newValue) => {
    localStorage.setItem('auditDraft', JSON.stringify(newValue))
  },
  { deep: true },
)

const guardarFormulario = () => {
  localStorage.setItem('auditDraft', JSON.stringify(props.modulo))
  emit('guardado')
}

const cerrarFormulario = () => {
  emit('cerrar')
}
</script>

<style scoped></style>
