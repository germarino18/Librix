import { Button } from "@/components/ui/button"
import type { CartItem } from "../types/ventasTypes"

interface FrequentProductsGridProps {
  products: Array<{
    id: string
    nombre: string
    precioVenta: number
    stockActual: number
  }>
  onAddToCart: (item: CartItem) => void
}

export default function FrequentProductsGrid({ products, onAddToCart }: FrequentProductsGridProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Productos Frecuentes
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {products.map((p) => (
          <Button
            key={p.id}
            variant="outline"
            className="h-auto flex-col py-3 px-2 gap-1"
            onClick={() =>
              onAddToCart({
                productoId: p.id,
                nombre: p.nombre,
                precioUnitario: p.precioVenta,
                cantidad: 1,
                stockActual: p.stockActual,
                subtotal: p.precioVenta,
              })
            }
          >
            <span className="text-sm font-medium leading-tight text-center line-clamp-2">
              {p.nombre}
            </span>
            <span className="text-xs text-muted-foreground">
              ${Number(p.precioVenta).toLocaleString("es-AR")}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
