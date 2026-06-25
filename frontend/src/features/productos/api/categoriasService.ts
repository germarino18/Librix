import { pb } from "@/lib/pocketbase"
import type { Categoria, CreateCategoriaInput, UpdateCategoriaInput } from "../types/productosTypes"

const COLLECTION = "categoria"

export async function list(): Promise<Categoria[]> {
  return pb.collection(COLLECTION).getFullList<Categoria>({
    sort: "nombre",
  })
}

export async function getById(id: string): Promise<Categoria> {
  return pb.collection(COLLECTION).getOne<Categoria>(id)
}

export async function create(data: CreateCategoriaInput): Promise<Categoria> {
  return pb.collection(COLLECTION).create<Categoria>(data)
}

export async function update(id: string, data: UpdateCategoriaInput): Promise<Categoria> {
  return pb.collection(COLLECTION).update<Categoria>(id, data)
}

export async function remove(id: string): Promise<boolean> {
  const products = await pb.collection("producto").getList(1, 1, {
    filter: `categoria_id="${id}"`,
  })
  if (products.totalItems > 0) {
    throw new Error("No se puede eliminar la categoría porque tiene productos asociados")
  }
  return pb.collection(COLLECTION).delete(id)
}
