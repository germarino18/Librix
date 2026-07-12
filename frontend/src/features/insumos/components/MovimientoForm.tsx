import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Insumo } from "../types/insumosTypes"

interface Props {
  insumo: Insumo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tipo: "ingreso" | "consumo", cantidad: number, observacion: string) => Promise<void>
  isPending: boolean
}

export default function MovimientoForm({ insumo, open, onOpenChange, onSubmit, isPending }: Props) {
  const [tipo, setTipo] = useState<"ingreso" | "consumo">("ingreso")
  const [cantidad, setCantidad] = useState("")
  const [observacion, setObservacion] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(cantidad)
    if (!cantidad || num <= 0) return
    await onSubmit(tipo, num, observacion)
    setCantidad("")
    setObservacion("")
    setTipo("ingreso")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setCantidad("")
          setObservacion("")
          setTipo("ingreso")
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento</DialogTitle>
          <DialogDescription>
            {insumo ? `${insumo.nombre} — Stock actual: ${insumo.stock_actual}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as "ingreso" | "consumo")}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingreso">Ingreso</SelectItem>
                <SelectItem value="consumo">Consumo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="text"
              inputMode="decimal"
              value={cantidad}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === "" || /^\d*\.?\d{0,2}$/.test(raw)) {
                  setCantidad(raw)
                }
              }}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacion">Observación</Label>
            <Input
              id="observacion"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
