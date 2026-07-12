export interface Insumo {
  id: string
  nombre: string
  stock_actual: number
  unidad: string
  costo_unitario: number
  stock_minimo: number
  paginas_por_unidad: number | null
  stock_bajo: boolean
  created_at: string
  updated_at: string
}

export interface MovimientoInsumo {
  id: string
  insumo_id: string
  tipo: "ingreso" | "consumo"
  cantidad: number
  fecha_hora: string
  observacion: string | null
  created_at: string
  updated_at: string
}

export interface CreateInsumoInput {
  nombre: string
  unidad: string
  costo_unitario?: number
  stock_actual?: number
  stock_minimo?: number
  paginas_por_unidad?: number | null
}

export interface UpdateInsumoInput {
  nombre?: string
  unidad?: string
  costo_unitario?: number
  stock_minimo?: number
  paginas_por_unidad?: number | null
}

export interface CreateMovimientoInput {
  tipo: "ingreso" | "consumo"
  cantidad: number
  observacion?: string
}
