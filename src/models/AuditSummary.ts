// src/models/AuditSummary.ts
export interface AuditSummary {
  country: string
  storeName: string
  storeManager: string
  auditorName: string
  auditDate: string
  isCompleted: boolean
  observations: string
  compliancePercentage: number
  overallRating: string
}
