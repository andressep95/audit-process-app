// src/services/AuditService.ts
import apiClient from '@/services/Api'
import type { AuditHeaders } from '@/models/models'

const AuditService = {
  /**
   * Envía una nueva auditoría al backend.
   * @param auditData Los datos completos de la auditoría.
   * @returns Una promesa que resuelve con los datos de la auditoría creada.
   */
  async createAudit(auditData: AuditHeaders): Promise<AuditHeaders> {
    try {
      // Ajusta el endpoint según tu API. Asumo que es POST /audits para crear.
      const response = await apiClient.post<AuditHeaders>('/audits', auditData)
      return response.data
    } catch (error) {
      console.error('Error al crear la auditoría:', error)
      throw error
    }
  },
}

export default AuditService
