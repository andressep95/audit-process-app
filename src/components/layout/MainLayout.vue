<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden relative">
    <div class="flex flex-1 overflow-hidden py-2">
      <AppSidebar class="h-full overflow-hidden flex flex-col" />
      <main class="flex-1 overflow-hidden px-4 flex flex-col">
        <router-view v-slot="{ Component, route }" class="flex-1 overflow-hidden">
          <transition :name="route.meta.transition || 'fade'" mode="out-in" appear>
            <component :is="Component" :key="route.path" class="flex-1 overflow-hidden" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue' // 'ref' y 'useRouter' ya no son necesarios aquí si no se usan para otra cosa.
import { useRouter } from 'vue-router' // Mantener useRouter si tus rutas lo necesitan para otra cosa.
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
// Eliminamos la importación de ConfirmationModal, ya no es necesario.
// import ConfirmationModal from '@/components/common/ConfirmationModal.vue' // <-- Eliminado
// Eliminamos ref, ya no es necesario si showAuditModal es el único uso.
// const showAuditModal = ref(false) // <-- Eliminado

const router = useRouter()
const authStore = useAuthStore()

// Eliminamos estas funciones, ya no son necesarias.
/*
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // Solo la parte de la fecha
}

const handleAuditConfirm = () => {
  const today = getTodayDate()
  localStorage.setItem('auditAccepted', 'true')
  localStorage.setItem('auditAcceptedDate', today)
  showAuditModal.value = false
  router.push('/audits')
}

const handleAuditCancel = () => {
  showAuditModal.value = false
}
*/

onMounted(() => {
  // Eliminamos toda la lógica de control del modal.
  // La siguiente línea probablemente tampoco es necesaria si no hay otra lógica que la use.
  // const draft = localStorage.getItem('moduloDraft')
  // Toda la lógica que sigue en este onMounted se elimina
  /*
  const storedDate = localStorage.getItem('auditAcceptedDate')
  const today = getTodayDate()

  if ((authStore.hasRole('ADMIN') || authStore.hasRole('USER')) && !draft) {
    if (storedDate !== today) {
      localStorage.removeItem('auditAccepted')
      localStorage.removeItem('auditAcceptedDate')
      showAuditModal.value = true
    }
  }
  */
})
</script>

<style scoped>
/* Transición fade (por defecto) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transición slide desde la derecha */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-right-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Transición slide desde la izquierda */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

/* Transición slide up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s ease-out;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Transición scale (zoom suave) */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.scale-leave-to {
  transform: scale(1.05);
  opacity: 0;
}
</style>
