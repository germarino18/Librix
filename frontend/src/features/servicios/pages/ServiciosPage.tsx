import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import ServiciosTable from "../components/ServiciosTable"
import ServicioForm from "../components/ServicioForm"
import DeleteServicioDialog from "../components/DeleteServicioDialog"
import { useServicios, useCreateServicio, useDeleteServicio } from "../hooks/useServicios"
import type { RegistroServicio, TipoServicio } from "../types/serviciosTypes"

function todayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function ServiciosPage() {
  const [filtroTipo, setFiltroTipo] = useState<TipoServicio | "todos">("todos")
  const [showForm, setShowForm] = useState(false)
  const [deletingServicio, setDeletingServicio] = useState<RegistroServicio | null>(null)

  const { data: servicios, isLoading } = useServicios({
    fecha: todayString(),
    tipo: filtroTipo === "todos" ? undefined : filtroTipo,
  })

  const createServicio = useCreateServicio()
  const deleteServicio = useDeleteServicio()

  const handleFormSubmit = async (data: {
    fecha: string
    tipo: TipoServicio
    descripcion: string
    cantidad: number
    ingreso_total: number
    costo_insumos: number
  }) => {
    try {
      await createServicio.mutateAsync({
        fecha: data.fecha,
        tipo: data.tipo,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        ingreso_total: data.ingreso_total,
        costo_insumos: data.costo_insumos,
      })
      toast.success("Servicio registrado correctamente")
    } catch {
      toast.error("Error al registrar el servicio")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingServicio) return
    try {
      await deleteServicio.mutateAsync(deletingServicio.id)
      toast.success("Servicio eliminado")
      setDeletingServicio(null)
    } catch {
      toast.error("Error al eliminar el servicio")
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Registro de servicios del día — {todayString()}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>Registrar Servicio</Button>
      </div>

      <ServiciosTable
        servicios={servicios}
        isLoading={isLoading}
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        onDelete={setDeletingServicio}
      />

      <ServicioForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteServicioDialog
        servicio={deletingServicio}
        open={!!deletingServicio}
        onOpenChange={(open) => {
          if (!open) setDeletingServicio(null)
        }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteServicio.isPending}
      />
    </div>
  )
}
