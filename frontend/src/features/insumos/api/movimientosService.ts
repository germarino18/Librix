import { api } from "@/lib/api"
import type { CreateMovimientoInput, MovimientoInsumo } from "../types/insumosTypes"

export async function createMovimiento(insumoId: string, data: CreateMovimientoInput): Promise<MovimientoInsumo> {
  const raw = await api.post<Record<string, unknown>>(`/insumos/${insumoId}/movimientos`, data)
  return mapMovimiento(raw)
}

export async function getMovimientos(insumoId: string): Promise<MovimientoInsumo[]> {
  const raw = await api.get<Record<string, unknown>[]>(`/insumos/${insumoId}/movimientos`)
  return raw.map(mapMovimiento)
}

function mapMovimiento(raw: Record<string, unknown>): MovimientoInsumo {
  return {
    id: raw.id as string,
    insumo_id: raw.insumo_id as string,
    tipo: raw.tipo as "ingreso" | "consumo",
    cantidad: Number(raw.cantidad),
    fecha_hora: raw.fecha_hora as string,
    observacion: raw.observacion as string | null,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}
