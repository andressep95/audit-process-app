<!-- src/components/common/PaginationButtons.vue -->
<template>
  <div class="flex items-center justify-center">
    <!-- Botón Anterior -->
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      :class="[
        currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-100',
        'relative inline-flex items-center justify-center h-10 w-10 rounded-l-md border border-gray-300 bg-white text-gray-500 focus:z-20 focus:outline-offset-0 transition-colors duration-150',
      ]"
    >
      <span class="sr-only">Anterior</span>
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Números de página visibles -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page === '...'"
        disabled
        class="relative inline-flex items-center justify-center h-10 w-10 border border-gray-300 bg-white text-gray-700 focus:outline-offset-0"
      >
        ...
      </button>
      <button
        v-else
        @click="goToPage(page)"
        :class="[
          page === currentPage
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300',
          'relative inline-flex items-center justify-center h-10 w-10 border focus:z-20 focus:outline-offset-0 transition-colors duration-150',
        ]"
        :aria-current="page === currentPage ? 'page' : undefined"
      >
        {{ page }}
      </button>
    </template>

    <!-- Botón Siguiente -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      :class="[
        currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-100',
        'relative inline-flex items-center justify-center h-10 w-10 rounded-r-md border border-gray-300 bg-white text-gray-500 focus:z-20 focus:outline-offset-0 transition-colors duration-150',
      ]"
    >
      <span class="sr-only">Siguiente</span>
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  perPage: {
    type: Number,
    required: true,
    default: 10,
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['page-changed'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))

const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(props.currentPage - half, 1)
  let end = Math.min(start + props.maxVisiblePages - 1, totalPages.value)

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(end - props.maxVisiblePages + 1, 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }

  return pages
})

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('page-changed', props.currentPage + 1)
  }
}

const goToPage = (page: number | string) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('page-changed', page)
  }
}
</script>
