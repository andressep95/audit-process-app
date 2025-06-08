<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
            class="w-8 h-8 text-white"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-black">Dashboard</h1>
        <p class="text-gray-600 text-sm">Gestión de usuarios</p>
      </div>

      <div class="border-2 border-gray-100 shadow-lg rounded-lg">
        <div class="p-6 space-y-1">
          <h2 class="text-2xl font-bold text-center">Iniciar Sesión</h2>
          <p class="text-center text-gray-600">Ingresa tus credenciales para acceder</p>
        </div>

        <div class="p-6 pt-0">
          <LoginForm @submit="handleLogin" />
          <div v-if="errorMessage" class="text-red-500 text-center mt-4">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/forms/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

const handleLogin = async (credentials) => {
  try {
    await authStore.login(credentials)
    const redirect = router.currentRoute.value.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (error) {
    errorMessage.value = error.message || 'Credenciales incorrectas'
  }
}
</script>
