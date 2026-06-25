import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCategorias } from "../hooks/useCategorias"
import { useProductos, useToggleActivo } from "../hooks/useProductos"
import { ProductosFilters } from "../components/ProductosFilters"
import { ProductosTable } from "../components/ProductosTable"
import { ProductosPagination } from "../components/ProductosPagination"
import { ProductDialog } from "../components/ProductDialog"
import { CategoryDialog } from "../components/CategoryDialog"
import type { Producto } from "../types/productosTypes"

export default function ProductosPage() {
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const [page, setPage] = useState(1)

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productoToDelete, setProductoToDelete] = useState<Producto | undefined>()
  const [toggleConfirmOpen, setToggleConfirmOpen] = useState(false)
  const [productoToToggle, setProductoToToggle] = useState<Producto | undefined>()

  const { data: categorias = [] } = useCategorias()
  const { data: productosData, isLoading } = useProductos({
    search: search || undefined,
    categoria: categoriaFilter || undefined,
    page,
    perPage: 20,
  })
  const toggleMutation = useToggleActivo()

  const productos = productosData?.items ?? []
  const totalPages = productosData?.totalPages ?? 1
  const totalItems = productosData?.totalItems ?? 0

  function handleEdit(producto: Producto) {
    setEditingProducto(producto)
    setProductDialogOpen(true)
  }

  function handleNewProducto() {
    setEditingProducto(undefined)
    setProductDialogOpen(true)
  }

  function handleToggleActivo(producto: Producto) {
    if (producto.activo) {
      setProductoToToggle(producto)
      setToggleConfirmOpen(true)
    } else {
      toggleMutation.mutate(
        { id: producto.id, activo: true },
        {
          onSuccess: () => toast.success("Producto reactivado"),
          onError: () => toast.error("Error al reactivar producto"),
        },
      )
    }
  }

  function confirmToggle() {
    if (!productoToToggle) return
    toggleMutation.mutate(
      { id: productoToToggle.id, activo: false },
      {
        onSuccess: () => {
          toast.success("Producto desactivado")
          setToggleConfirmOpen(false)
          setProductoToToggle(undefined)
        },
        onError: () => {
          toast.error("Error al desactivar producto")
        },
      },
    )
  }

  function handleDelete(producto: Producto) {
    setProductoToDelete(producto)
    setDeleteConfirmOpen(true)
  }

  function confirmDelete() {
    if (!productoToDelete) return
    toggleMutation.mutate(
      { id: productoToDelete.id, activo: false },
      {
        onSuccess: () => {
          toast.success("Producto desactivado")
          setDeleteConfirmOpen(false)
          setProductoToDelete(undefined)
        },
        onError: () => {
          toast.error("Error al desactivar producto")
        },
      },
    )
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryChange(value: string) {
    setCategoriaFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">Gestión de productos y categorías</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            Gestionar Categorías
          </Button>
          <Button onClick={handleNewProducto}>Nuevo Producto</Button>
        </div>
      </div>

      <ProductosFilters
        search={search}
        categoria={categoriaFilter}
        categorias={categorias}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-md border">
          <p className="text-sm text-muted-foreground">Cargando productos...</p>
        </div>
      ) : (
        <ProductosTable
          productos={productos}
          onEdit={handleEdit}
          onToggleActivo={handleToggleActivo}
          onDelete={handleDelete}
        />
      )}

      <ProductosPagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={(open) => {
          setProductDialogOpen(open)
          if (!open) setEditingProducto(undefined)
        }}
        producto={editingProducto}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />

      <Dialog open={toggleConfirmOpen} onOpenChange={setToggleConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desactivar producto</DialogTitle>
            <DialogDescription>
              ¿Desactivar producto? No aparecerá en ventas
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmToggle}>
              Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desactivar producto</DialogTitle>
            <DialogDescription>
              ¿Desactivar producto? No aparecerá en ventas
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
