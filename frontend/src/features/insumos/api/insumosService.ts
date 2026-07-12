import { api } from "@/lib/api"
import type { CreateInsumoInput, Insumo, UpdateInsumoInput } from "../types/insumosTypes"

export async function getAllInsumos(): Promise<Insumo[]> {
  const raw = await api.get<Record<string, unknown>[]>("/insumos")
  return raw.map(mapInsumo)
}

export async function getInsumoById(id: string): Promise<Insumo> {
  const raw = await api.get<Record<string, unknown>>(`/insumos/${id}`)
  return mapInsumo(raw)
}

export async function createInsumo(data: CreateInsumoInput): Promise<Insumo> {
  const raw = await api.post<Record<string, unknown>>("/insumos", data)
  return mapInsumo(raw)
}

export async function updateInsumo(id: string, data: UpdateInsumoInput): Promise<Insumo> {
  const raw = await api.put<Record<string, unknown>>(`/insumos/${id}`, data)
  return mapInsumo(raw)
}

export async function deleteInsumo(id: string): Promise<void> {
  await api.delete(`/insumos/${id}`)
}

function mapInsumo(raw: Record<string, unknown>): Insumo {
  return {
    id: raw.id as string,
    nombre: raw.nombre as string,
    stock_actual: Number(raw.stock_actual),
    unidad: raw.unidad as string,
    costo_unitario: Number(raw.costo_unitario),
    stock_minimo: Number(raw.stock_minimo),
    paginas_por_unidad: raw.paginas_por_unidad as number | null,
    stock_bajo: raw.stock_bajo as boolean,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}
