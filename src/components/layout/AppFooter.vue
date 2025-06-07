<template>
  <footer class="bg-white border-t border-gray-200 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-500">
          © {{ currentYear }} Mi Aplicación. Todos los derechos reservados.
        </p>
        <div class="mt-2 md:mt-0 flex space-x-6">
          <a href="#" class="text-sm text-gray-500 hover:text-gray-600">Términos</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-600">Privacidad</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-600">Contacto</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
