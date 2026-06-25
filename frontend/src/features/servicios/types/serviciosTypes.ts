export interface RegistroServicio {
  id: string
  created: string
  updated: string
  fecha: string
  tipo: "fotocopia" | "plastificado" | "souvenir" | "otro"
  descripcion: string
  cantidad: number
  ingresoTotal: number
  costoInsumos: number
  ganancia: number
}

export interface CreateServicioInput {
  fecha: string
  tipo: "fotocopia" | "plastificado" | "souvenir" | "otro"
  descripcion: string
  cantidad: number
  ingresoTotal: number
  costoInsumos?: number
}

export interface UpdateServicioInput {
  fecha?: string
  tipo?: "fotocopia" | "plastificado" | "souvenir" | "otro"
  descripcion?: string
  cantidad?: number
  ingresoTotal?: number
  costoInsumos?: number
}
