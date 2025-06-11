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
  nombreModulo: string
  tasks: Task[]
}

export interface Task {
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
  observacion: string
  image: string
}
