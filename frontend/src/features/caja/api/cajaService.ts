import { pb } from "@/lib/pocketbase"
import type { Caja, CreateCajaInput, UpdateCajaInput, CloseCajaInput } from "../types/cajaTypes"

const COLLECTION = "caja"

export async function list(): Promise<Caja[]> {
  return pb.collection(COLLECTION).getFullList<Caja>()
}

export async function getById(id: string): Promise<Caja> {
  return pb.collection(COLLECTION).getOne<Caja>(id)
}

export async function create(data: CreateCajaInput): Promise<Caja> {
  return pb.collection(COLLECTION).create<Caja>(data)
}

export async function update(id: string, data: UpdateCajaInput): Promise<Caja> {
  return pb.collection(COLLECTION).update<Caja>(id, data)
}

export async function getTodayCaja(): Promise<Caja | null> {
  const today = new Date().toISOString().slice(0, 10)
  const records = await pb.collection(COLLECTION).getFullList<Caja>({
    filter: `fecha = "${today}" && estado = "abierta"`,
  })
  return records.length > 0 ? records[0] : null
}

export async function closeCaja(id: string, totals: CloseCajaInput): Promise<Caja> {
  return pb.collection(COLLECTION).update<Caja>(id, {
    ...totals,
    estado: "cerrada",
  })
}
