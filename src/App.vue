<template>
  <router-view />
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import EmptyLayout from '@/components/layout/EmptyLayout.vue' // Crea este componente básico

const route = useRoute()

const app = getCurrentInstance()?.appContext.app
if (app) {
  app.config.devtools = false
}

const resolveLayout = computed(() => {
  return route.meta.layout === 'empty' ? EmptyLayout : MainLayout
})
</script>
