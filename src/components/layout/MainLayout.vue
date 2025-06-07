<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex flex-1 min-h-0">
      <AppSidebar />
      <main class="flex-1 p-6 bg-gray-50 overflow-auto">
        <router-view />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
