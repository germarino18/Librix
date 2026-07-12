import { api } from "@/lib/api"
import type { RegistroServicio, CreateServicioInput, FiltrosServicio } from "../types/serviciosTypes"

function mapServicio(raw: Record<string, unknown>): RegistroServicio {
  return {
    id: raw.id as string,
    fecha: raw.fecha as string,
    tipo: raw.tipo as RegistroServicio["tipo"],
    descripcion: raw.descripcion as string,
    cantidad: Number(raw.cantidad),
    ingreso_total: Number(raw.ingreso_total),
    costo_insumos: Number(raw.costo_insumos),
    ganancia: Number(raw.ganancia),
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}

export async function getAllServicios(filtros?: FiltrosServicio): Promise<RegistroServicio[]> {
  const params = new URLSearchParams()
  if (filtros?.fecha) params.set("fecha", filtros.fecha)
  if (filtros?.tipo) params.set("tipo", filtros.tipo)
  const qs = params.toString()
  const path = qs ? `/servicios?${qs}` : "/servicios"
  const raw = await api.get<Record<string, unknown>[]>(path)
  return raw.map(mapServicio)
}

export async function getServicioById(id: string): Promise<RegistroServicio> {
  const raw = await api.get<Record<string, unknown>>(`/servicios/${id}`)
  return mapServicio(raw)
}

export async function createServicio(data: CreateServicioInput): Promise<RegistroServicio> {
  const raw = await api.post<Record<string, unknown>>("/servicios", data)
  return mapServicio(raw)
}

export async function deleteServicio(id: string): Promise<void> {
  await api.delete(`/servicios/${id}`)
}
