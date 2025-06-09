// src/componnents/forms/LoginForm.vue
<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="space-y-2">
      <label for="username" class="text-sm font-medium">Usuario</label>
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="absolute left-3 top-3 h-4 w-4 text-gray-400"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="Tu usuario"
          class="pl-10 h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
          required
        />
      </div>
    </div>

    <div class="space-y-2">
      <label for="password" class="text-sm font-medium">Contraseña</label>
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="absolute left-3 top-3 h-4 w-4 text-gray-400"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          class="pl-10 pr-10 h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <svg
            v-if="showPassword"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            ></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
      :disabled="loading"
    >
      <span v-if="!loading">Iniciar Sesión</span>
      <span v-else class="flex items-center justify-center space-x-2">
        <div
          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></div>
        <span>Procesando...</span>
      </span>
    </button>

    <div class="mt-6 text-center">
      <button
        type="button"
        @click="$emit('toggle-auth-mode')"
        class="text-sm text-gray-600 hover:text-black transition-colors"
      >
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'toggle-auth-mode'])

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)

const submitForm = async () => {
  loading.value = true
  try {
    await emit('submit', {
      username: form.value.username,
      password: form.value.password,
    })
  } finally {
    loading.value = false
  }
}
</script>
