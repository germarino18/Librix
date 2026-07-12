export interface Caja {
  id: string
  fecha: string
  monto_inicial: number
  monto_final: number | null
  estado: "abierta" | "cerrada"
  total_efectivo: number
  total_transferencia: number
  total_qr: number
  total_servicios: number
  observacion: string | null
  created_at: string
  updated_at: string
}

export interface CajaHistorial {
  total: number
  items: Caja[]
}

export interface AbrirCajaInput {
  monto_inicial: number
  observacion?: string
}

export interface CerrarCajaInput {
  observacion?: string
}
