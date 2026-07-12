import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getActual,
  abrirCaja,
  cerrarCaja,
  getHistorial,
} from "../api/cajaService"
import type { AbrirCajaInput, CerrarCajaInput } from "../types/cajaTypes"

export function useCajaActual() {
  return useQuery({
    queryKey: ["caja", "actual"],
    queryFn: getActual,
    retry: false,
  })
}

export function useAbrirCaja() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AbrirCajaInput) => abrirCaja(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja", "actual"] })
    },
  })
}

export function useCerrarCaja() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CerrarCajaInput) => cerrarCaja(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja", "actual"] })
      queryClient.invalidateQueries({ queryKey: ["caja", "historial"] })
    },
  })
}

export function useHistorialCaja(page: number = 0, limit: number = 10) {
  const skip = page * limit
  return useQuery({
    queryKey: ["caja", "historial", page],
    queryFn: () => getHistorial(skip, limit),
  })
}
