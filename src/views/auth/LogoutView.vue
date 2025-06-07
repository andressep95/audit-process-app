<!-- src/views/auth/LogoutView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-lg">Cerrando sesión...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.logout()
  router.push('/login')
})
</script>
