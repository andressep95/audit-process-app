<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden relative">
    <div
      :class="{ 'opacity-40 pointer-events-none': showAuditModal }"
      class="flex flex-1 overflow-hidden"
    >
      <AppSidebar class="h-full overflow-hidden flex flex-col" />
      <main class="flex-1 overflow-hidden px-4 py-1 flex flex-col">
        <router-view v-slot="{ Component, route }" class="flex-1 overflow-hidden">
          <transition :name="route.meta.transition || 'fade'" mode="out-in" appear>
            <component :is="Component" :key="route.path" class="flex-1 overflow-hidden" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Modal de auditoría -->
    <ConfirmationModal
      v-model="showAuditModal"
      title="¿Iniciar auditoría?"
      message="¿Desea iniciar en este momento el proceso de auditoría?"
      confirmText="Sí"
      cancelText="No"
      @confirm="handleAuditConfirm"
      @cancel="handleAuditCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const showAuditModal = ref(false)

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

onMounted(() => {
  const draft = localStorage.getItem('moduloDraft')
  const storedDate = localStorage.getItem('auditAcceptedDate')
  const today = getTodayDate()

  if (authStore.hasRole('ADMIN') && !draft) {
    if (storedDate !== today) {
      localStorage.removeItem('auditAccepted')
      localStorage.removeItem('auditAcceptedDate')
      showAuditModal.value = true
    }
  }
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
