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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (montoInicial: number) => void
  isPending: boolean
}

export default function AbrirCajaDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: Props) {
  const [montoInicial, setMontoInicial] = useState("")

  const handleConfirm = () => {
    const value = parseFloat(montoInicial)
    if (isNaN(value) || value < 0) return
    onConfirm(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
      setMontoInicial(val)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Abrir Caja</DialogTitle>
          <DialogDescription>
            Ingresá el monto inicial con el que abrís la caja del día.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="monto-inicial">Monto inicial</Label>
          <Input
            id="monto-inicial"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={montoInicial}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !montoInicial}>
            {isPending ? "Abriendo..." : "Abrir caja"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
