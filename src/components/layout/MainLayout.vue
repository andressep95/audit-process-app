<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar ocupa altura exacta y NO genera scroll -->
      <AppSidebar class="h-full overflow-hidden flex flex-col" />

      <!-- Main ocupa el resto sin scroll -->
      <main class="flex-1 overflow-hidden px-4 py-1 flex flex-col">
        <router-view class="flex-1 overflow-hidden" />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
