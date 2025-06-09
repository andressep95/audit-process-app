<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold mb-4 text-red-600">Cuenta deshabilitada</h1>
    <p class="text-lg">
      Tu cuenta ha sido deshabilitada. Contacta con el administrador para más información.
    </p>
    <button
      @click="goToLogin"
      class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Volver al login
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToLogin = () => {
  router.push('/login')
}
</script>
