import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface CobrarButtonProps {
  disabled: boolean
  total: number
  metodoPago: string
  onConfirm: () => Promise<void>
}

export default function CobrarButton({ disabled, total, metodoPago, onConfirm }: CobrarButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      setOpen(false)
      toast.success("Venta registrada con éxito")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrar la venta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        size="lg"
        disabled={disabled}
        className="w-full h-14 text-lg font-bold"
        onClick={() => setOpen(true)}
      >
        Cobrar ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Venta</DialogTitle>
            <DialogDescription>
              ¿Confirma que desea registrar esta venta?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">
                ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago</span>
              <span className="capitalize">{metodoPago.replace("_", " ")}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Venta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
