import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllInsumos, createInsumo, updateInsumo, deleteInsumo } from "../api/insumosService"
import type { CreateInsumoInput, UpdateInsumoInput } from "../types/insumosTypes"

export function useInsumos() {
  return useQuery({
    queryKey: ["insumos"],
    queryFn: getAllInsumos,
  })
}

export function useCreateInsumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInsumoInput) => createInsumo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] })
    },
  })
}

export function useUpdateInsumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsumoInput }) => updateInsumo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] })
    },
  })
}

export function useDeleteInsumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteInsumo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] })
    },
  })
}
