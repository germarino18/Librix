import { api } from "@/lib/api"
import type { Categoria, CreateCategoriaInput, UpdateCategoriaInput } from "../types/productosTypes"

function mapCategoria(raw: Record<string, unknown>): Categoria {
  return {
    id: raw.id as string,
    nombre: raw.nombre as string,
    created: raw.created_at as string,
    updated: raw.updated_at as string,
  }
}

export async function list(): Promise<Categoria[]> {
  const raw = await api.get<Record<string, unknown>[]>("/categorias")
  return raw.map(mapCategoria)
}

export async function getById(id: string): Promise<Categoria> {
  const raw = await api.get<Record<string, unknown>>(`/categorias/${id}`)
  return mapCategoria(raw)
}

export async function create(data: CreateCategoriaInput): Promise<Categoria> {
  const raw = await api.post<Record<string, unknown>>("/categorias", data)
  return mapCategoria(raw)
}

export async function update(id: string, data: UpdateCategoriaInput): Promise<Categoria> {
  const raw = await api.put<Record<string, unknown>>(`/categorias/${id}`, data)
  return mapCategoria(raw)
}

export async function remove(id: string): Promise<void> {
  await api.delete<void>(`/categorias/${id}`)
}
