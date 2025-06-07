<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Auditorías</h1>
      <router-link
        to="/audits/new"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Nueva Auditoría
      </router-link>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="audit in audits" :key="audit.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ audit.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ audit.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${audit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`"
              >
                {{ audit.status === 'completed' ? 'Completado' : 'Pendiente' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ audit.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <router-link
                :to="`/audits/${audit.id}`"
                class="text-blue-600 hover:text-blue-900 mr-3"
                >Ver</router-link
              >
              <button class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const audits = [
  { id: 1, name: 'Auditoría de seguridad Q1', status: 'completed', date: '2023-05-15' },
  { id: 2, name: 'Revisión de servidores', status: 'pending', date: '2023-06-20' },
  { id: 3, name: 'Cumplimiento GDPR', status: 'pending', date: '2023-07-10' },
]
</script>
