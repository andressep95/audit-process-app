<template>
  <form @submit.prevent="submitForm" class="mt-8 space-y-6">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">Usuario</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="loading"
      >
        <span v-if="!loading">Ingresar</span>
        <span v-else>Procesando...</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)

const submitForm = () => {
  loading.value = true
  emit('submit', {
    username: form.value.username,
    password: form.value.password,
  })
  loading.value = false
}
</script>
