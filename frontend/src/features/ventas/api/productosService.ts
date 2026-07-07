import { api } from "@/lib/api"
import type { ProductoSearchResult } from "../types/ventasTypes"

export async function buscarProductos(q: string): Promise<ProductoSearchResult[]> {
  const raw = await api.get<Record<string, unknown>[]>(`/productos/buscar?q=${encodeURIComponent(q)}`)
  return raw.map((p) => ({
    id: p.id as string,
    nombre: p.nombre as string,
    precioVenta: Number(p.precio_venta),
    stockActual: Number(p.stock_actual),
  }))
}
