import { api } from "@/lib/api"
import type { Caja, CajaHistorial, AbrirCajaInput, CerrarCajaInput } from "../types/cajaTypes"

function mapCaja(raw: Record<string, unknown>): Caja {
  return {
    id: raw.id as string,
    fecha: raw.fecha as string,
    monto_inicial: Number(raw.monto_inicial),
    monto_final: raw.monto_final != null ? Number(raw.monto_final) : null,
    estado: raw.estado as Caja["estado"],
    total_efectivo: Number(raw.total_efectivo),
    total_transferencia: Number(raw.total_transferencia),
    total_qr: Number(raw.total_qr),
    total_servicios: Number(raw.total_servicios),
    observacion: raw.observacion as string | null,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}

export async function getActual(): Promise<Caja> {
  const raw = await api.get<Record<string, unknown>>("/caja/actual")
  return mapCaja(raw)
}

export async function abrirCaja(data: AbrirCajaInput): Promise<Caja> {
  const raw = await api.post<Record<string, unknown>>("/caja/abrir", data)
  return mapCaja(raw)
}

export async function cerrarCaja(data: CerrarCajaInput): Promise<Caja> {
  const raw = await api.post<Record<string, unknown>>("/caja/cerrar", data)
  return mapCaja(raw)
}

export async function getHistorial(
  skip: number = 0,
  limit: number = 10,
): Promise<CajaHistorial> {
  const params = new URLSearchParams()
  params.set("skip", String(skip))
  params.set("limit", String(limit))
  const raw = await api.get<Record<string, unknown>>(`/caja/historial?${params.toString()}`)
  return {
    total: raw.total as number,
    items: (raw.items as Record<string, unknown>[]).map(mapCaja),
  }
}

export async function getCajaById(id: string): Promise<Caja> {
  const raw = await api.get<Record<string, unknown>>(`/caja/${id}`)
  return mapCaja(raw)
}
