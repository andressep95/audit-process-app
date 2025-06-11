<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden relative">
    <div
      :class="{ 'opacity-40 pointer-events-none': showAuditModal }"
      class="flex flex-1 overflow-hidden"
    >
      <AppSidebar class="h-full overflow-hidden flex flex-col" />
      <main class="flex-1 overflow-hidden px-4 py-1 flex flex-col">
        <router-view class="flex-1 overflow-hidden" />
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

onMounted(() => {
  const draft = localStorage.getItem('moduloDraft')
  if (authStore.hasRole('ADMIN') && !draft && localStorage.getItem('auditAccepted') !== 'true') {
    showAuditModal.value = true
  }
})

const handleAuditConfirm = () => {
  localStorage.setItem('auditAccepted', 'true')
  showAuditModal.value = false
  router.push('/audits')
}

const handleAuditCancel = () => {
  showAuditModal.value = false
}
</script>
