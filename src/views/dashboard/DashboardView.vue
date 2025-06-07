<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Tarjetas de resumen -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Auditorías</h3>
        <p class="mt-2 text-3xl font-bold text-blue-600">24</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Checklists</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">15</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Completados</h3>
        <p class="mt-2 text-3xl font-bold text-purple-600">78%</p>
      </div>
    </div>

    <!-- Gráfico o tabla reciente -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad reciente</h3>
      <div class="border rounded-lg p-4 text-gray-500">
        [Aquí iría un gráfico o tabla de actividades]
      </div>
    </div>
  </div>
</template>

<script setup>
// Puedes añadir lógica específica del dashboard aquí
</script>
