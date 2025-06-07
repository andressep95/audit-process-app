<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
      </div>
      <LoginForm @submit="handleLogin" />
      <div v-if="errorMessage" class="text-red-500 text-center">
        {{ errorMessage }}
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
