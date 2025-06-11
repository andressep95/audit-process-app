// src/App.vue
<template>
  <router-view />
</template>

<script setup>
import { getCurrentInstance, onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/components/layout/MainLayout.vue'
import EmptyLayout from '@/components/layout/EmptyLayout.vue'

const route = useRoute()
// Al iniciar la aplicación
const authStore = useAuthStore()

const app = getCurrentInstance()?.appContext.app
if (app) {
  app.config.devtools = false
}

const resolveLayout = computed(() => {
  return route.meta.layout === 'empty' ? EmptyLayout : MainLayout
})

onMounted(() => {
  authStore.clearOldDrafts()
})
</script>
