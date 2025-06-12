<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
    <div
      v-for="sub in subModulos"
      :key="sub.id"
      class="bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:border-gray-200 cursor-pointer"
      @click="$emit('select-submodule', sub)"
    >
      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-800">{{ sub.nombre }}</h3>
        <p
          class="text-sm bg-blue-50 text-blue-600 rounded-full mb-3 inline-flex items-center px-3 py-1"
        >
          {{ sub.tasks.length }} {{ sub.tasks.length === 1 ? 'tarea' : 'tareas' }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Progreso</span>
          <span class="font-medium"> {{ calcularProgreso(sub.tasks) }}% </span>
        </div>

        <div class="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div
            class="bg-blue-500 h-2 rounded-full"
            :style="{ width: `${calcularProgreso(sub.tasks)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubModulo, Task } from '@/models/models'

defineProps<{
  subModulos: SubModulo[]
}>()

defineEmits<{
  (e: 'select-submodule', subModulo: SubModulo): void
}>()

const calcularProgreso = (tasks: Task[]) => {
  if (tasks.length === 0) return 0
  const completadas = tasks.filter((t) => t.estado).length
  return Math.round((completadas / tasks.length) * 100)
}
</script>

<style scoped>
/* Transición suave para el hover */
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
