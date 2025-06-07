<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Checklists</h1>
      <router-link
        to="/checklists/new"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Nuevo Checklist
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="checklist in checklists"
        :key="checklist.id"
        class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ checklist.title }}</h3>
        <p class="text-gray-600 mb-4">{{ checklist.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ checklist.items }} items</span>
          <router-link
            :to="`/checklists/${checklist.id}`"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Ver detalles →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const checklists = [
  {
    id: 1,
    title: 'Seguridad de oficina',
    description: 'Revisión mensual de medidas de seguridad',
    items: 12,
  },
  {
    id: 2,
    title: 'Mantenimiento servidores',
    description: 'Chequeo semanal de servidores',
    items: 8,
  },
  {
    id: 3,
    title: 'Cumplimiento RGPD',
    description: 'Verificación trimestral de protección de datos',
    items: 15,
  },
]
</script>
