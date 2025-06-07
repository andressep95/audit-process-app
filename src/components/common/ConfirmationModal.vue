<template>
  <!-- Overlay del modal -->
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
    @click="handleOverlayClick"
  >
    <!-- Modal container -->
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 transform transition-transform duration-300 scale-100"
      @click.stop
    >
      <!-- Header del modal -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <button
          @click="handleCancel"
          class="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
          :title="'Cerrar'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="p-6">
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Footer con botones -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 transition-colors',
            variant === 'danger'
              ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-200'
              : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props del componente
const props = defineProps({
  // Control de visibilidad
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Contenido del modal
  title: {
    type: String,
    default: 'Confirmar acción',
  },
  message: {
    type: String,
    required: true,
  },
  // Textos de los botones
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
  cancelText: {
    type: String,
    default: 'Cancelar',
  },
  // Variante del botón de confirmación
  variant: {
    type: String,
    default: 'primary', // 'primary' o 'danger'
    validator: (value) => ['primary', 'danger'].includes(value),
  },
  // Si se puede cerrar haciendo clic en el overlay
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
})

// Emits del componente
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Estado interno
const isVisible = ref(props.modelValue)

// Watcher para sincronizar con v-model
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue
  },
)

// Métodos
const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
  isVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
  isVisible.value = false
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleCancel()
  }
}

// Manejo del teclado (ESC para cerrar)
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isVisible.value) {
    handleCancel()
  }
}

// Agregar/remover event listener para ESC
watch(isVisible, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Animación de entrada del modal */
.fixed.inset-0 {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Prevenir scroll del body cuando el modal está abierto */
.fixed.inset-0 {
  overflow: hidden;
}
</style>
