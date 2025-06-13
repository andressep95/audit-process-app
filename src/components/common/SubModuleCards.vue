<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
    <div
      v-for="module in auditModules"
      :key="module.id"
      class="bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:border-gray-200 cursor-pointer"
      @click="$emit('select-submodule', module)"
    >
      <div class="p-5">
        <!-- Nombre del módulo -->
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ module.moduleName }}
        </h3>

        <!-- Cantidad de tareas -->
        <p
          class="text-sm bg-blue-50 text-blue-600 rounded-full mb-3 inline-flex items-center px-3 py-1"
        >
          {{ module.tasks.length }} {{ module.tasks.length === 1 ? 'tarea' : 'tareas' }}
        </p>

        <!-- Cumplimiento y barra de progreso -->
        <div class="flex items-center justify-between text-sm text-gray-500 mb-1">
          <span>Cumplimiento</span>
          <span class="font-medium text-gray-700"> {{ module.compliancePercentage }}% </span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            class="bg-blue-500 h-2 rounded-full"
            :style="{ width: `${module.compliancePercentage}%` }"
          ></div>
        </div>

        <!-- Calificación general -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Calificación</span>
          <span class="font-medium text-gray-700">
            {{ module.overallRating }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!auditModules?.length" class="text-gray-500 italic mt-6">
    No hay módulos disponibles.
  </div>
</template>

<script setup lang="ts">
import type { AuditModules } from '@/models/models'

defineProps<{
  auditModules?: AuditModules[]
}>()

defineEmits<{
  (e: 'select-submodule', module: AuditModules): void
}>()
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
