<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="flex flex-1 min-h-0 p-1">
      <AppSidebar />
      <main class="flex-1 px-4 py-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
