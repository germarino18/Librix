import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Caja } from "../types/cajaTypes"

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface Props {
  caja: Caja
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (observacion: string) => void
  isPending: boolean
}

export default function CerrarCajaDialog({
  caja,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: Props) {
  const [observacion, setObservacion] = useState("")

  const handleConfirm = () => {
    onConfirm(observacion)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Caja</DialogTitle>
          <DialogDescription>
            Revisá los totales antes de confirmar el cierre.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto inicial:</span>
            <span className="font-medium">{formatMoney(caja.monto_inicial)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Efectivo:</span>
            <span className="font-medium">{formatMoney(caja.total_efectivo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transferencia:</span>
            <span className="font-medium">{formatMoney(caja.total_transferencia)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">QR / MercadoPago:</span>
            <span className="font-medium">{formatMoney(caja.total_qr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Servicios:</span>
            <span className="font-medium">{formatMoney(caja.total_servicios)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Monto final:</span>
            <span>
              {formatMoney(
                caja.monto_inicial +
                  caja.total_efectivo +
                  caja.total_transferencia +
                  caja.total_qr +
                  caja.total_servicios,
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="observacion-cierre">Observación (opcional)</Label>
          <Input
            id="observacion-cierre"
            placeholder="Ej: Cierre normal del día"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Cerrando..." : "Confirmar cierre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
