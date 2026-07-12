import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCategorias } from "../hooks/useCategorias"
import { useCreateProducto, useUpdateProducto } from "../hooks/useProductos"
import { ProductForm } from "./ProductForm"
import type { Producto } from "../types/productosTypes"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  producto?: Producto
}

export function ProductDialog({ open, onOpenChange, onSuccess, producto }: ProductDialogProps) {
  const { data: categorias = [] } = useCategorias()
  const createMutation = useCreateProducto()
  const updateMutation = useUpdateProducto()

  const isEditing = !!producto
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  function handleSubmit(data: {
    nombre: string
    categoria_id?: string
    precioCompra?: number
    precioVenta?: number
    stockActual?: number
    stockMinimo?: number
    unidad?: "unidad" | "kg" | "m"
    activo?: boolean
  }) {
    const payload = {
      ...data,
      categoria_id: data.categoria_id || undefined,
    }

    if (isEditing) {
      updateMutation.mutate(
        { id: producto.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Producto actualizado")
            onOpenChange(false)
            onSuccess?.()
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Error al actualizar producto")
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Producto creado")
          onOpenChange(false)
          onSuccess?.()
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Error al crear producto")
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique los datos del producto"
              : "Complete los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          producto={producto}
          categorias={categorias}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            onClick={() => {
              const form = document.querySelector("form")
              form?.requestSubmit()
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
