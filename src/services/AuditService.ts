// src/services/AuditService.ts
import apiClient from '@/services/Api'
import type { AuditHeaders } from '@/models/models'
import type { AuditReadHeaders, PaginatedResponse } from '@/models/audit-read-models'

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
  /**
   * Obtiene un resumen de todas las auditorías (para ADMIN y AUDITOR).
   * @param page El número de página (por defecto 0).
   * @param size El tamaño de la página (por defecto 6).
   * @returns Una promesa que resuelve con una lista paginada de cabeceras de auditoría.
   */
  async getAudits(page: number = 0, size: number = 6): Promise<any> {
    // Puedes tipar 'any' o crear un tipo para la respuesta paginada
    try {
      const response = await apiClient.get('/audits', {
        params: { page, size },
      })
      // La respuesta del backend de Spring Data JPA para paginación suele tener 'content', 'totalPages', 'totalElements', etc.
      return response.data // Esto contendrá el objeto Page de Spring
    } catch (error) {
      console.error('Error al obtener todas las auditorías:', error)
      throw error
    }
  },

  async getAuditsFullDetails(
    page: number = 0,
    size: number = 6,
  ): Promise<PaginatedResponse<AuditReadHeaders>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AuditReadHeaders>>(
        '/audits/full-details',
        {
          params: { page, size },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener todas las auditorías (detalles completos):', error)
      throw error
    }
  },
  /**
   * Obtiene un resumen de las auditorías para el Jefe de Tienda logueado.
   * El nombre del gerente de tienda se obtiene del token en el backend.
   * @param page El número de página (por defecto 0).
   * @param size El tamaño de la página (por defecto 6).
   * @returns Una promesa que resuelve con una lista paginada de cabeceras de auditoría.
   */
  async getAuditsForStoreChief(page: number = 0, size: number = 6): Promise<any> {
    // Puedes tipar 'any' o crear un tipo para la respuesta paginada
    try {
      // No se envía 'storeManager' como parámetro ya que el backend lo extrae del token
      const response = await apiClient.get('/audits/by-store', {
        params: { page, size },
      })
      // La respuesta del backend de Spring Data JPA para paginación suele tener 'content', 'totalPages', 'totalElements', etc.
      return response.data // Esto contendrá el objeto Page de Spring
    } catch (error) {
      console.error('Error al obtener auditorías para el Jefe de Tienda:', error)
      throw error
    }
  },
  /**
   * Obtiene los detalles completos de una auditoría basándose en el nombre de la tienda, la fecha y el país.
   * @param storeName El nombre de la tienda.
   * @param auditDate La fecha de la auditoría (en formato de cadena, ej. 'YYYY-MM-DD').
   * @param country El país de la auditoría.
   * @returns Una promesa que resuelve con los datos completos de AuditHeaders.
   */
  async getAuditFullDetailsByStoreAndDate(
    storeName: string,
    auditDate: string, // Asegúrate de que el formato de fecha coincida con lo que espera tu backend
    country: string,
  ): Promise<AuditHeaders> {
    try {
      // Ajusta la URL del endpoint según la configuración de tu API.
      // Puedes usar parámetros de consulta o una ruta con variables, según cómo diseñes tu API.
      const response = await apiClient.get<AuditHeaders>(
        `/audits/details`, // Endpoint genérico para obtener detalles
        {
          params: {
            storeName: storeName,
            auditDate: auditDate,
            country: country,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error(
        'Error al obtener detalles completos de la auditoría por tienda y fecha:',
        error,
      )
      throw error // Re-lanza el error para que el componente que llama lo maneje
    }
  },
}

export default AuditService
