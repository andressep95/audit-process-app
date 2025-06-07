<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-1 min-h-0">
      <AppSidebar />
      <main class="flex-1 p-6 bg-gray-50 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
