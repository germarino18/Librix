export interface Caja {
  id: string
  created: string
  updated: string
  fecha: string
  montoInicial: number
  montoFinal: number | null
  estado: "abierta" | "cerrada"
  totalEfectivo: number
  totalTransferencia: number
  totalQR: number
  totalServicios: number
  observacion: string
}

export interface CreateCajaInput {
  fecha: string
  montoInicial: number
  estado: "abierta"
  observacion?: string
}

export interface UpdateCajaInput {
  fecha?: string
  montoInicial?: number
  montoFinal?: number | null
  estado?: "abierta" | "cerrada"
  totalEfectivo?: number
  totalTransferencia?: number
  totalQR?: number
  totalServicios?: number
  observacion?: string
}

export interface CloseCajaInput {
  montoFinal: number
  totalEfectivo: number
  totalTransferencia: number
  totalQR: number
  totalServicios: number
}
