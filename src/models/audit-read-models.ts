// src/types/api-response-types.ts

// --- INTERFACES PARA RESPUESTAS PAGINADAS (Genérica) ---
export interface PaginatedResponse<T> {
  content: T[] // El array de datos que viene en la página
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// --- INTERFACES ESPECÍFICAS PARA LA LECTURA DETALLADA DEL ENDPOINT /audits/full-details ---
// (Estas interfaces reflejan EXACTAMENTE el JSON que obtienes de /audits/full-details)

export interface AuditReadObservation {
  id?: number
  observationText: string
  imageUrl: string
}

export interface AuditReadSubTask {
  id?: number
  requerimentCode: number // Coincide con 'requerimentCode' en el JSON
  procedureDescription: string
  riskLevel: string
  auditedSamples: number
  errorsFound: number
  errorPercentage: number
  compliancePercentage: number
  isCompleted: boolean
  auditObservations?: AuditReadObservation[] // Coincide con 'auditObservations' en el JSON
}

export interface AuditReadTask {
  id?: number
  taskCode: string
  procedureDescription: string
  compliancePercentage: number
  taskRating: string
  isCompleted: boolean
  auditSubtasks: AuditReadSubTask[] // Coincide con 'auditSubtasks' en el JSON
}

export interface AuditReadModule {
  id?: number
  moduleName: string
  compliancePercentage: number
  overallRating: string
  isCompleted: boolean
  auditTasks: AuditReadTask[]
}

export interface AuditReadHeaders {
  // Interfaz principal para la lectura del endpoint /full-details
  country: string
  storeName: string
  storeManager: string
  auditorName: string
  auditDate: string
  isCompleted: boolean
  observations: string // Observaciones generales
  compliancePercentage: number
  overallRating: string
  auditModules?: AuditReadModule[] // Coincide con 'auditModules' en el JSON
}
