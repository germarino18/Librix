export interface Categoria {
  id: string
  created: string
  updated: string
  nombre: string
}

export interface CreateCategoriaInput {
  nombre: string
}

export interface UpdateCategoriaInput {
  nombre?: string
}

export interface Producto {
  id: string
  created: string
  updated: string
  nombre: string
  categoria_id: string
  precioCompra: number
  precioVenta: number
  stockActual: number
  stockMinimo: number
  unidad: "unidad" | "kg" | "m"
  activo: boolean
  expand?: {
    categoria_id?: Categoria
  }
}

export interface CreateProductoInput {
  nombre: string
  categoria_id?: string
  precioCompra?: number
  precioVenta?: number
  stockActual?: number
  stockMinimo?: number
  unidad?: "unidad" | "kg" | "m"
  activo?: boolean
}

export interface UpdateProductoInput {
  nombre?: string
  categoria_id?: string
  precioCompra?: number
  precioVenta?: number
  stockActual?: number
  stockMinimo?: number
  unidad?: "unidad" | "kg" | "m"
  activo?: boolean
}

export interface ProductoListParams {
  categoria?: string
  search?: string
  page?: number
  perPage?: number
}

export interface ProductoListResponse {
  items: Producto[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
}
