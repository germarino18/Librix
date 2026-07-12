export type TipoServicio = "fotocopia" | "plastificado" | "souvenir" | "otro"

export interface RegistroServicio {
  id: string
  fecha: string
  tipo: TipoServicio
  descripcion: string
  cantidad: number
  ingreso_total: number
  costo_insumos: number
  ganancia: number
  created_at: string
  updated_at: string
}

export interface CreateServicioInput {
  fecha: string
  tipo: TipoServicio
  descripcion: string
  cantidad: number
  ingreso_total: number
  costo_insumos?: number
}

export interface FiltrosServicio {
  fecha?: string
  tipo?: TipoServicio
}

export const PRECIO_FOTOCOPIA_POR_HOJA = 50

export const PRECIOS_PLASTIFICADO: Record<string, number> = {
  A4: 100,
  A5: 80,
  "10x15": 50,
  tarjeta: 40,
}

export const TIPOS_FRECUENTES_PLASTIFICADO = ["A4", "A5", "10x15", "tarjeta"] as const
