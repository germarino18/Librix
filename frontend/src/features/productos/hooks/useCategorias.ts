import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as categoriasService from "../api/categoriasService"
import type { CreateCategoriaInput, UpdateCategoriaInput } from "../types/productosTypes"

const QUERY_KEY = ["categorias"] as const

export function useCategorias() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: categoriasService.list,
  })
}

export function useCategoria(id: string) {
  return useQuery({
    queryKey: ["categorias", id] as const,
    queryFn: () => categoriasService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoriaInput) => categoriasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
  })
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaInput }) =>
      categoriasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
  })
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriasService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
  })
}
