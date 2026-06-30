import { api } from "@/lib/api"
import type {
  Producto,
  CreateProductoInput,
  UpdateProductoInput,
  ProductoListParams,
  ProductoListResponse,
} from "../types/productosTypes"

function mapProducto(raw: Record<string, unknown>): Producto {
  const categoriaNombre = raw.categoria_nombre as string | null
  return {
    id: raw.id as string,
    nombre: raw.nombre as string,
    categoria_id: raw.categoria_id as string,
    precioCompra: Number(raw.precio_compra),
    precioVenta: Number(raw.precio_venta),
    porcentajeGanancia: Number(raw.porcentaje_ganancia ?? 30),
    stockActual: Number(raw.stock_actual),
    stockMinimo: Number(raw.stock_minimo),
    unidad: raw.unidad as "unidad" | "kg" | "m",
    activo: raw.activo as boolean,
    created: raw.created_at as string,
    updated: raw.updated_at as string,
    expand: categoriaNombre
      ? { categoria_id: { id: raw.categoria_id as string, nombre: categoriaNombre, created: "", updated: "" } }
      : undefined,
  }
}

function mapListResponse(raw: Record<string, unknown>): ProductoListResponse {
  const items = (raw.items as Record<string, unknown>[]).map(mapProducto)
  return {
    items,
    totalItems: raw.total as number,
    totalPages: raw.total_pages as number,
    page: raw.page as number,
    perPage: raw.per_page as number,
  }
}

export async function list(params: ProductoListParams = {}): Promise<ProductoListResponse> {
  const { categoria, search, page = 1, perPage = 20 } = params

  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("per_page", String(perPage))
  if (categoria) query.set("categoria_id", categoria)
  if (search) query.set("search", search)

  const raw = await api.get<Record<string, unknown>>(`/productos?${query.toString()}`)
  return mapListResponse(raw)
}

export async function getById(id: string): Promise<Producto> {
  const raw = await api.get<Record<string, unknown>>(`/productos/${id}`)
  return mapProducto(raw)
}

export async function create(data: CreateProductoInput): Promise<Producto> {
  const body: Record<string, unknown> = {
    nombre: data.nombre,
  }
  if (data.categoria_id !== undefined) body.categoria_id = data.categoria_id
  if (data.precioCompra !== undefined) body.precio_compra = data.precioCompra
  if (data.porcentajeGanancia !== undefined) body.porcentaje_ganancia = data.porcentajeGanancia
  if (data.stockActual !== undefined) body.stock_actual = data.stockActual
  if (data.stockMinimo !== undefined) body.stock_minimo = data.stockMinimo
  if (data.unidad !== undefined) body.unidad = data.unidad
  if (data.activo !== undefined) body.activo = data.activo

  const raw = await api.post<Record<string, unknown>>("/productos", body)
  return mapProducto(raw)
}

export async function update(id: string, data: UpdateProductoInput): Promise<Producto> {
  const body: Record<string, unknown> = {}
  if (data.nombre !== undefined) body.nombre = data.nombre
  if (data.categoria_id !== undefined) body.categoria_id = data.categoria_id
  if (data.precioCompra !== undefined) body.precio_compra = data.precioCompra
  if (data.porcentajeGanancia !== undefined) body.porcentaje_ganancia = data.porcentajeGanancia
  if (data.stockActual !== undefined) body.stock_actual = data.stockActual
  if (data.stockMinimo !== undefined) body.stock_minimo = data.stockMinimo
  if (data.unidad !== undefined) body.unidad = data.unidad
  if (data.activo !== undefined) body.activo = data.activo

  const raw = await api.put<Record<string, unknown>>(`/productos/${id}`, body)
  return mapProducto(raw)
}

export async function toggleActivo(id: string): Promise<Producto> {
  const raw = await api.patch<Record<string, unknown>>(`/productos/${id}/toggle-activo`)
  return mapProducto(raw)
}
