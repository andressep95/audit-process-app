<template>
  <div class="empty-layout">
    <h2>Empty Layout</h2>
    <slot />
  </div>
</template>

<script setup>
// Este es un layout vacío para envolver contenido.
</script>

<style scoped>
.empty-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #888;
  font-family: sans-serif;
}
</style>
