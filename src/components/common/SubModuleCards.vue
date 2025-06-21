<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
    <div
      v-for="module in auditModules"
      :key="module.id"
      class="bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:border-gray-200 cursor-pointer relative"
      @click="$emit('select-submodule', module)"
    >
      <div class="absolute top-3 right-3 z-20">
        <span
          class="px-3 py-1 text-xs font-semibold rounded-full flex items-center justify-center whitespace-nowrap transition-colors duration-200"
          :class="{
            'bg-green-100 text-green-700': module.isCompleted,
            'bg-red-100 text-red-700': !module.isCompleted,
          }"
        >
          {{ module.isCompleted ? 'Completado' : 'Pendiente' }}
        </span>
      </div>

      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ module.moduleName }}
        </h3>

        <p
          class="text-sm bg-gray-50 text-gray-600 rounded-full mb-3 inline-flex items-center px-3 py-1"
        >
          {{ module.tasks.length }} {{ module.tasks.length === 1 ? 'tarea' : 'tareas' }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500 mb-1">
          <span>Cumplimiento</span>
          <span class="font-medium text-gray-700">
            {{ module.compliancePercentage.toFixed(0) }}%
          </span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            class="h-2 rounded-full"
            :class="{
              'bg-green-500': module.compliancePercentage >= 90,
              'bg-yellow-500':
                module.compliancePercentage >= 80 && module.compliancePercentage < 90,
              'bg-orange-300':
                module.compliancePercentage >= 70 && module.compliancePercentage < 80,
              'bg-red-500': module.compliancePercentage < 70,
            }"
            :style="{ width: `${module.compliancePercentage}%` }"
          ></div>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Calificación</span>
          <span
            :class="getRatingClass(module.overallRating)"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
          >
            {{ module.overallRating }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!auditModules?.length" class="text-gray-500 italic mt-6 text-center">
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

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'EFECTIVA':
      return 'text-green-700 bg-green-100 border-green-200'
    case 'OPORTUNIDAD DE MEJORA':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'INEFECTIVA':
      return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'DEFICIENTE':
      return 'text-red-700 bg-red-100 border-red-200'
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}
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
