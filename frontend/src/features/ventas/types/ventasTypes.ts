export interface ProductoSearchResult {
  id: string
  nombre: string
  precioVenta: number
  stockActual: number
}

export interface DetalleVentaInput {
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface CreateVentaInput {
  metodo_pago: "efectivo" | "transferencia" | "qr_mercadopago"
  observacion?: string
  detalles: DetalleVentaInput[]
}

export interface DetalleVenta {
  id: string
  venta_id: string
  producto_id: string
  producto_nombre: string | null
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface VentaResumen {
  id: string
  fecha_hora: string
  total: number
  metodo_pago: string
  estado: string
  observacion: string | null
  created_at: string
  updated_at: string
}

export interface VentaListResponse {
  items: VentaResumen[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface Venta extends VentaResumen {
  detalles: DetalleVenta[]
}

// Cart item (frontend-only state)
export interface CartItem {
  productoId: string
  nombre: string
  precioUnitario: number
  cantidad: number
  stockActual: number
  subtotal: number
}
