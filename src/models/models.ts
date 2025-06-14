// src/models/models.ts
export interface AuditHeaders {
  country: string // pais
  storeName: string // nombre de tienda
  storeManager: string // nombre de jefe de tienda
  auditorName: string // nombre del auditor
  auditDate: string // fecha de auditoria
  isCompleted: boolean // estado actual de auditoria
  observations: string // observaciones generales de la auditoria
  auditModules: AuditModules[]
}

export interface AuditModules {
  id: number
  moduleName: string // nombre del modulo a auditar: existencias, rrhh, mantencion, etc.
  compliancePercentage: number // porcentaje de cumplimiento del modulo (se calcula al concluirlo)
  overallRating: string // Calificacion textual
  isCompleted: boolean
  tasks: Task[]
}

export interface Task {
  id: number
  taskCode: string // Letra de la tarea a evaluar
  procedureDescription: string // Titulo de la tarea a evaluar
  compliancePercentage: number // Cumplimiento de la tarea global
  taskRating: string // Calificacion textual dada al cumplimiento de la tarea global
  isCompleted: boolean // Estado actual de la tarea (pendiente o no)
  subtasks: AuditSubTask[]
}

export interface AuditSubTask {
  id: number
  requerimentCode: number // Numero de sub-tarea
  procedureDescription: string // Descripcion de la sub-tarea
  riskLevel: string // Valor fijo
  auditedSamples: number // Numero de muestras evaluadas en la tarea
  errorsFound: number // Errores encontrados en las muestras
  errorPercentage: number // se debe calcular en base al dato ingresado en el campo errorsFound dividido en el dato ingresado en el campo auditedSamples (errorsFound/auditedSamples),
  compliancePercentage: number // Valor inversi al errorPercentage si el errorPercentage feu de 20 este tiene que ser 80
  isCompleted: boolean // Estado de la tarea realizada
  observations: AuditObservations[]
}

export interface AuditObservations {
  id: number
  observationText: string // Observaciones encontradas en la tarea
  imageUrl: string // Ruta de accesibilidad a la imagen tomada para la observacion
}
