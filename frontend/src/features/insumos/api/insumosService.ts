import { pb } from "@/lib/pocketbase"
import type {
  InsumoServicio,
  MovimientoInsumo,
  CreateInsumoInput,
  UpdateInsumoInput,
  CreateMovimientoInput,
} from "../types/insumosTypes"

const SUPPLIES_COLLECTION = "insumoServicio"
const MOVEMENTS_COLLECTION = "movimientoInsumo"

export async function listSupplies(): Promise<InsumoServicio[]> {
  return pb.collection(SUPPLIES_COLLECTION).getFullList<InsumoServicio>()
}

export async function getSupplyById(id: string): Promise<InsumoServicio> {
  return pb.collection(SUPPLIES_COLLECTION).getOne<InsumoServicio>(id)
}

export async function createSupply(data: CreateInsumoInput): Promise<InsumoServicio> {
  return pb.collection(SUPPLIES_COLLECTION).create<InsumoServicio>(data)
}

export async function updateSupply(id: string, data: UpdateInsumoInput): Promise<InsumoServicio> {
  return pb.collection(SUPPLIES_COLLECTION).update<InsumoServicio>(id, data)
}

export async function deleteSupply(id: string): Promise<boolean> {
  return pb.collection(SUPPLIES_COLLECTION).delete(id)
}

export async function listMovements(supplyId?: string): Promise<MovimientoInsumo[]> {
  const options: Record<string, unknown> = {}
  if (supplyId) {
    options.filter = `insumoServicio_id = "${supplyId}"`
    options.sort = "-fechaHora"
  }
  return pb.collection(MOVEMENTS_COLLECTION).getFullList<MovimientoInsumo>(options)
}

export async function recordMovement(data: CreateMovimientoInput): Promise<MovimientoInsumo> {
  return pb.collection(MOVEMENTS_COLLECTION).create<MovimientoInsumo>(data)
}
