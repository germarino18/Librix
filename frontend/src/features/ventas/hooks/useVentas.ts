import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { buscarProductos } from "../api/productosService"
import { createVenta, listVentas } from "../api/ventasService"
import type { CreateVentaInput } from "../types/ventasTypes"

export function useProductSearch(q: string) {
  return useQuery({
    queryKey: ["productos", "buscar", q],
    queryFn: () => buscarProductos(q),
    enabled: q.length >= 2,
    staleTime: 30_000,
  })
}

export function useCreateVenta(onVentaCreada?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVentaInput) => createVenta(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      queryClient.invalidateQueries({ queryKey: ["caja"] })
      onVentaCreada?.()
    },
  })
}

export function useVentas(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ["ventas", page, perPage],
    queryFn: () => listVentas(page, perPage),
  })
}
