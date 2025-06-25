<!-- src/components/common/NotificationModal.vue -->
<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <Transition name="modal-fade">
          <div v-if="show" class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </Transition>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                :class="`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconColor} bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10`"
              >
                <component :is="iconComponent" class="h-6 w-6" />
              </div>

              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500" v-html="message"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="$emit('close')"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              :class="buttonClass"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  type: {
    // 'success' o 'error'
    type: String,
    default: 'success',
  },
  title: String,
  message: String,
})

defineEmits(['close'])

const iconComponent = computed(() =>
  props.type === 'success' ? CheckCircleIcon : ExclamationCircleIcon,
)

const iconColor = computed(() =>
  props.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100',
)

const buttonClass = computed(() =>
  props.type === 'success'
    ? 'bg-black hover:bg-gray-800 focus:ring-black'
    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
)
</script>

<style scoped>
/* Las mismas transiciones que usamos antes */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
