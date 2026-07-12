import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createMovimiento, getMovimientos } from "../api/movimientosService"
import type { CreateMovimientoInput } from "../types/insumosTypes"

export function useMovimientos(insumoId: string | null) {
  return useQuery({
    queryKey: ["movimientos", insumoId],
    queryFn: () => getMovimientos(insumoId!),
    enabled: !!insumoId,
  })
}

export function useCreateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ insumoId, data }: { insumoId: string; data: CreateMovimientoInput }) =>
      createMovimiento(insumoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] })
      queryClient.invalidateQueries({ queryKey: ["insumos"] })
    },
  })
}
