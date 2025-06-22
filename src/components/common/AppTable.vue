<template>
  <div class="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <table class="min-w-full divide-y divide-gray-100">
      <thead class="bg-white">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="[
              'px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider',
              header.align === 'right' ? 'text-right' : 'text-left',
            ]"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <template v-if="items.length > 0">
          <tr
            v-for="(item, itemIndex) in items"
            :key="item.id || itemIndex"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              :class="[
                'px-6 py-4 text-sm text-gray-900 whitespace-nowrap',
                header.align === 'right' ? 'text-right' : 'text-left',
              ]"
            >
              <slot :name="`cell-${header.key}`" :item="item" :header="header">
                {{ item[header.key] }}
              </slot>
            </td>
          </tr>
        </template>
        <template v-else> </template>
      </tbody>
    </table>

    <div v-if="items.length === 0" class="text-center py-12 bg-white">
      <div class="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-gray-900 mb-2">
        {{ emptyMessageTitle }}
      </h3>
      <p class="text-sm text-gray-500 max-w-sm mx-auto">
        {{ emptyMessageText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface TableHeader {
  key: string
  label: string
  align?: 'left' | 'right'
}

const props = defineProps({
  headers: {
    type: Array as () => ReadonlyArray<TableHeader>,
    required: true,
  },
  items: {
    type: Array as () => any[],
    required: true,
  },
  emptyMessageTitle: {
    type: String,
    default: 'No hay datos para mostrar',
  },
  emptyMessageText: {
    type: String,
    default: 'No se encontraron resultados con los filtros actuales.',
  },
})
</script>
