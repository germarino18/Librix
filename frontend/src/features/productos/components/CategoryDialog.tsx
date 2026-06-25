import { useState } from "react"
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
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from "../hooks/useCategorias"
import { CategoryForm } from "./CategoryForm"
import type { Categoria } from "../types/productosTypes"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list")
  const [editingCategory, setEditingCategory] = useState<Categoria | undefined>()

  const { data: categorias = [], isLoading } = useCategorias()
  const createMutation = useCreateCategoria()
  const updateMutation = useUpdateCategoria()
  const deleteMutation = useDeleteCategoria()

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setMode("list")
      setEditingCategory(undefined)
    }
    onOpenChange(newOpen)
  }

  function handleCreate(data: { nombre: string }) {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Categoría creada")
        setMode("list")
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Error al crear categoría")
      },
    })
  }

  function handleUpdate(data: { nombre: string }) {
    if (!editingCategory) return
    updateMutation.mutate(
      { id: editingCategory.id, data },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada")
          setMode("list")
          setEditingCategory(undefined)
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Error al actualizar categoría")
        },
      },
    )
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Categoría eliminada")
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Error al eliminar categoría")
      },
    })
  }

  if (mode === "create" || mode === "edit") {
    const isSubmitting = createMutation.isPending || updateMutation.isPending
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Nueva categoría" : "Editar categoría"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Ingrese el nombre de la nueva categoría"
                : "Modifique el nombre de la categoría"}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            categoria={editingCategory}
            onSubmit={mode === "create" ? handleCreate : handleUpdate}
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar categorías</DialogTitle>
          <DialogDescription>
            Administre las categorías de productos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : categorias.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay categorías</p>
          ) : (
            categorias.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <span className="text-sm font-medium">{cat.nombre}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(cat)
                      setMode("edit")
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => setMode("create")}>
            Nueva categoría
          </Button>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
