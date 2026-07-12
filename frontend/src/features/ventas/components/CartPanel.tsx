import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import type { CartItem } from "../types/ventasTypes"

interface CartPanelProps {
  items: CartItem[]
  onUpdateQty: (productoId: string, cantidad: number) => void
  onRemove: (productoId: string) => void
}

export default function CartPanel({ items, onUpdateQty, onRemove }: CartPanelProps) {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-lg">Carrito vacío</p>
        <p className="text-sm">Busque o seleccione productos</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {items.map((item) => (
          <div
            key={item.productoId}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.nombre}</p>
              <p className="text-xs text-muted-foreground">
                ${Number(item.precioUnitario).toLocaleString("es-AR")} c/u
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => {
                  if (item.cantidad <= 1) {
                    onRemove(item.productoId)
                  } else {
                    onUpdateQty(item.productoId, item.cantidad - 1)
                  }
                }}
              >
                <Minus className="size-3" />
              </Button>

              <Input
                type="text"
                inputMode="numeric"
                value={item.cantidad}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === "") return
                  const val = parseInt(raw, 10)
                  if (val >= 1 && !isNaN(val)) onUpdateQty(item.productoId, val)
                }}
                className="w-14 h-8 text-center"
              />

              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => onUpdateQty(item.productoId, item.cantidad + 1)}
              >
                <Plus className="size-3" />
              </Button>
            </div>

            <div className="text-right min-w-[70px]">
              <p className="text-sm font-medium">
                ${Number(item.subtotal).toLocaleString("es-AR")}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(item.productoId)}
              className="text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold">
            ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}
