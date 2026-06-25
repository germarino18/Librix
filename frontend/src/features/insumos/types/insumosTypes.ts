export interface InsumoServicio {
  id: string
  created: string
  updated: string
  nombre: string
  stockActual: number
  unidad: string
  costoUnitario: number
  stockMinimo: number
  paginasPorUnidad: number | null
}

export interface MovimientoInsumo {
  id: string
  created: string
  updated: string
  insumoServicio_id: string
  tipo: "ingreso" | "consumo"
  cantidad: number
  fechaHora: string
  observacion: string
}

export interface CreateInsumoInput {
  nombre: string
  stockActual?: number
  unidad: string
  costoUnitario?: number
  stockMinimo?: number
  paginasPorUnidad?: number | null
}

export interface UpdateInsumoInput {
  nombre?: string
  stockActual?: number
  unidad?: string
  costoUnitario?: number
  stockMinimo?: number
  paginasPorUnidad?: number | null
}

export interface CreateMovimientoInput {
  insumoServicio_id: string
  tipo: "ingreso" | "consumo"
  cantidad: number
  observacion?: string
}
