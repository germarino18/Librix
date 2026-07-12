import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import InsumosTable from "../components/InsumosTable"
import InsumoForm from "../components/InsumoForm"
import DeleteInsumoDialog from "../components/DeleteInsumoDialog"
import MovimientoForm from "../components/MovimientoForm"
import { useInsumos, useCreateInsumo, useUpdateInsumo, useDeleteInsumo } from "../hooks/useInsumos"
import { useCreateMovimiento } from "../hooks/useMovimientos"
import type { Insumo } from "../types/insumosTypes"

export default function InsumosPage() {
  const { data: insumos, isLoading } = useInsumos()
  const createInsumo = useCreateInsumo()
  const updateInsumo = useUpdateInsumo()
  const deleteInsumo = useDeleteInsumo()
  const createMovimiento = useCreateMovimiento()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [deletingInsumo, setDeletingInsumo] = useState<Insumo | null>(null)
  const [movimientoInsumo, setMovimientoInsumo] = useState<Insumo | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggleMovimientos = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleDelete = (insumo: Insumo) => {
    setDeletingInsumo(insumo)
  }

  const handleFormSubmit = async (data: {
    nombre: string
    unidad: string
    costo_unitario: number
    stock_actual: number
    stock_minimo: number
    paginas_por_unidad?: number | null
  }) => {
    try {
      const payload = { ...data, paginas_por_unidad: data.paginas_por_unidad ?? null }
      if (editingInsumo) {
        await updateInsumo.mutateAsync({ id: editingInsumo.id, data: payload })
        toast.success("Insumo actualizado correctamente")
        setEditingInsumo(null)
      } else {
        await createInsumo.mutateAsync(payload)
        toast.success("Insumo creado correctamente")
        setShowCreateDialog(false)
      }
    } catch {
      toast.error("Error al guardar el insumo")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingInsumo) return
    try {
      await deleteInsumo.mutateAsync(deletingInsumo.id)
      toast.success("Insumo eliminado")
      setDeletingInsumo(null)
    } catch {
      toast.error("Error al eliminar el insumo")
    }
  }

  const handleMovimientoSubmit = async (tipo: "ingreso" | "consumo", cantidad: number, observacion: string) => {
    if (!movimientoInsumo) return
    try {
      await createMovimiento.mutateAsync({
        insumoId: movimientoInsumo.id,
        data: { tipo, cantidad, observacion: observacion || undefined },
      })
      toast.success("Movimiento registrado correctamente")
      setMovimientoInsumo(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar el movimiento"
      toast.error(msg)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insumos de Servicio</h1>
          <p className="text-sm text-muted-foreground">Gestión de stock de insumos</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>Nuevo Insumo</Button>
      </div>

      <InsumosTable
        insumos={insumos}
        isLoading={isLoading}
        expandedId={expandedId}
        onToggleMovimientos={handleToggleMovimientos}
        onEdit={(insumo) => {
          setEditingInsumo(insumo)
          setShowCreateDialog(true)
        }}
        onDelete={handleDelete}
        onRegistrarMovimiento={(insumo) => setMovimientoInsumo(insumo)}
      />

      <InsumoForm
        open={showCreateDialog || !!editingInsumo}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false)
            setEditingInsumo(null)
          }
        }}
        onSubmit={handleFormSubmit}
        editingInsumo={editingInsumo}
      />

      <DeleteInsumoDialog
        insumo={deletingInsumo}
        open={!!deletingInsumo}
        onOpenChange={(open) => {
          if (!open) setDeletingInsumo(null)
        }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteInsumo.isPending}
      />

      <MovimientoForm
        insumo={movimientoInsumo}
        open={!!movimientoInsumo}
        onOpenChange={(open) => {
          if (!open) setMovimientoInsumo(null)
        }}
        onSubmit={handleMovimientoSubmit}
        isPending={createMovimiento.isPending}
      />
    </div>
  )
}
