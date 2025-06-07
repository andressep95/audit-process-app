<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 class="text-lg font-semibold text-gray-900">{{ title }}</h1>
      <div class="relative">
        <button @click="toggleMenu" class="flex items-center space-x-2">
          <span class="text-sm font-medium">{{ userEmail }}</span>
          <ChevronDownIcon class="h-5 w-5 text-gray-500" />
        </button>

        <div
          v-if="isMenuOpen"
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div class="py-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Perfil
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: String,
})

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const userEmail = computed(() => {
  return authStore.user?.email || 'Usuario'
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
