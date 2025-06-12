// src/models/models.ts
export interface Modulo {
  pais: string
  tienda: string
  jefeTienda: string
  auditor: string
  fechaAuditoria: string
  estado: boolean
  observacionesGenerales: string
  subModulo: SubModulo[]
}

export interface SubModulo {
  id: number
  nombre: string
  tasks: Task[]
}

export interface Task {
  id: number
  rc: string
  procedimiento: string
  riesgo: string
  muestra: number
  errores: number
  errorPorcentual: string
  cumplimientoPorcentual: string
  calificacion: string
  estado: boolean
  observaciones: Observacion[]
}

export interface Observacion {
  id: number
  observacion: string
  image: string
}
