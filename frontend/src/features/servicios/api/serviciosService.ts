import { pb } from "@/lib/pocketbase"
import type { RegistroServicio, CreateServicioInput, UpdateServicioInput } from "../types/serviciosTypes"

const COLLECTION = "registroServicio"

function calculateGanancia(data: { ingresoTotal: number; costoInsumos?: number }): number {
  return data.ingresoTotal - (data.costoInsumos ?? 0)
}

export async function list(): Promise<RegistroServicio[]> {
  return pb.collection(COLLECTION).getFullList<RegistroServicio>()
}

export async function getById(id: string): Promise<RegistroServicio> {
  return pb.collection(COLLECTION).getOne<RegistroServicio>(id)
}

export async function create(data: CreateServicioInput): Promise<RegistroServicio> {
  return pb.collection(COLLECTION).create<RegistroServicio>({
    ...data,
    ganancia: calculateGanancia(data),
  })
}

export async function update(id: string, data: UpdateServicioInput): Promise<RegistroServicio> {
  const payload: Record<string, unknown> = { ...data }
  if (data.ingresoTotal !== undefined || data.costoInsumos !== undefined) {
    const current = await getById(id)
    payload.ganancia = calculateGanancia({
      ingresoTotal: data.ingresoTotal ?? current.ingresoTotal,
      costoInsumos: data.costoInsumos ?? current.costoInsumos,
    })
  }
  return pb.collection(COLLECTION).update<RegistroServicio>(id, payload)
}

export async function remove(id: string): Promise<boolean> {
  return pb.collection(COLLECTION).delete(id)
}
