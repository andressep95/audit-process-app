// stores/auditStore.ts
import { defineStore } from 'pinia'

export const useAuditStore = defineStore('audit', {
  state: () => ({
    showAuditForm: false,
    auditDateKey: '', // podría ser útil si usas localStorage también
  }),
  actions: {
    toggleAuditForm(show: boolean) {
      this.showAuditForm = show
    },
    updateAuditDateKey(key: string) {
      this.auditDateKey = key
    },
  },
})
