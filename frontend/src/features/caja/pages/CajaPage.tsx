import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCajaActual, useAbrirCaja, useCerrarCaja } from "../hooks/useCaja"
import CajaAbierta from "../components/CajaAbierta"
import CajaCerrada from "../components/CajaCerrada"
import AbrirCajaDialog from "../components/AbrirCajaDialog"
import CerrarCajaDialog from "../components/CerrarCajaDialog"
import HistorialCaja from "../components/HistorialCaja"

export default function CajaPage() {
  const [showAbrirDialog, setShowAbrirDialog] = useState(false)
  const [showCerrarDialog, setShowCerrarDialog] = useState(false)

  const { data: caja, isLoading } = useCajaActual()
  const abrirCaja = useAbrirCaja()
  const cerrarCaja = useCerrarCaja()

  const handleAbrir = async (montoInicial: number) => {
    try {
      await abrirCaja.mutateAsync({ monto_inicial: montoInicial })
      toast.success("Caja abierta correctamente")
      setShowAbrirDialog(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al abrir la caja")
    }
  }

  const handleCerrar = async (observacion: string) => {
    try {
      await cerrarCaja.mutateAsync({ observacion })
      toast.success("Caja cerrada correctamente")
      setShowCerrarDialog(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cerrar la caja")
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-6">
      <div>
        <h1 className="text-2xl font-bold">Caja</h1>
        <p className="text-sm text-muted-foreground">Gestión de caja diaria</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : caja ? (
        caja.estado === "abierta" ? (
          <CajaAbierta caja={caja} onCerrar={() => setShowCerrarDialog(true)} />
        ) : (
          <CajaCerrada caja={caja} onAbrir={() => setShowAbrirDialog(true)} />
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-lg text-muted-foreground">No hay caja abierta</p>
          <Button onClick={() => setShowAbrirDialog(true)}>Abrir caja</Button>
        </div>
      )}

      <div className="border-t pt-6">
        <HistorialCaja />
      </div>

      <AbrirCajaDialog
        open={showAbrirDialog}
        onOpenChange={setShowAbrirDialog}
        onConfirm={handleAbrir}
        isPending={abrirCaja.isPending}
      />

      {caja && caja.estado === "abierta" && (
        <CerrarCajaDialog
          caja={caja}
          open={showCerrarDialog}
          onOpenChange={setShowCerrarDialog}
          onConfirm={handleCerrar}
          isPending={cerrarCaja.isPending}
        />
      )}
    </div>
  )
}
