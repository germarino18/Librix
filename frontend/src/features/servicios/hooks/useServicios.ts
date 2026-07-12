import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllServicios, createServicio, deleteServicio } from "../api/serviciosService"
import type { CreateServicioInput, FiltrosServicio } from "../types/serviciosTypes"

export function useServicios(filtros?: FiltrosServicio) {
  return useQuery({
    queryKey: ["servicios", filtros],
    queryFn: () => getAllServicios(filtros),
  })
}

export function useCreateServicio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServicioInput) => createServicio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] })
    },
  })
}

export function useDeleteServicio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteServicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] })
    },
  })
}
