import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as productosService from "../api/productosService"
import type {
  CreateProductoInput,
  UpdateProductoInput,
  ProductoListParams,
} from "../types/productosTypes"

export function useProductos(params: ProductoListParams) {
  return useQuery({
    queryKey: ["productos", params] as const,
    queryFn: () => productosService.list(params),
  })
}

export function useProducto(id: string) {
  return useQuery({
    queryKey: ["productos", id] as const,
    queryFn: () => productosService.getById(id),
    enabled: !!id,
  })
}

export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductoInput) => productosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export function useUpdateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoInput }) =>
      productosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export function useToggleActivo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      productosService.update(id, { activo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}
