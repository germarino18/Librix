import { api } from "@/lib/api"
import type { CreateVentaInput, Venta, VentaResumen, VentaListResponse } from "../types/ventasTypes"

export async function createVenta(data: CreateVentaInput): Promise<Venta> {
  const raw = await api.post<Record<string, unknown>>("/ventas", data)
  return mapVenta(raw)
}

export async function getVenta(id: string): Promise<Venta> {
  const raw = await api.get<Record<string, unknown>>(`/ventas/${id}`)
  return mapVenta(raw)
}

export async function listVentas(page = 1, perPage = 20): Promise<VentaListResponse> {
  const raw = await api.get<Record<string, unknown>>(`/ventas?page=${page}&per_page=${perPage}`)
  return {
    items: (raw.items as Record<string, unknown>[]).map(mapVentaResumen),
    total: raw.total as number,
    page: raw.page as number,
    perPage: raw.per_page as number,
    totalPages: raw.total_pages as number,
  }
}

function mapVentaResumen(raw: Record<string, unknown>): VentaResumen {
  return {
    id: raw.id as string,
    fecha_hora: raw.fecha_hora as string,
    total: Number(raw.total),
    metodo_pago: raw.metodo_pago as string,
    estado: raw.estado as string,
    observacion: raw.observacion as string | null,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}

function mapVenta(raw: Record<string, unknown>): Venta {
  return {
    id: raw.id as string,
    fecha_hora: raw.fecha_hora as string,
    total: Number(raw.total),
    metodo_pago: raw.metodo_pago as string,
    estado: raw.estado as string,
    observacion: raw.observacion as string | null,
    detalles: (raw.detalles as Record<string, unknown>[]).map((d) => ({
      id: d.id as string,
      venta_id: d.venta_id as string,
      producto_id: d.producto_id as string,
      producto_nombre: d.producto_nombre as string | null,
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      subtotal: Number(d.subtotal),
    })),
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}
