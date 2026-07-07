import { useQuery } from "@tanstack/react-query"
import { getVenta } from "../api/ventasService"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Props {
  ventaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SaleDetailDialog({ ventaId, open, onOpenChange }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["ventas", ventaId],
    queryFn: () => getVenta(ventaId!),
    enabled: !!ventaId,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle de Venta</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : data ? (
          <div className="space-y-4">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <p className="font-medium">
                  {new Date(data.fecha_hora).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Método de pago:</span>
                <p className="font-medium capitalize">
                  {data.metodo_pago.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <p className="font-medium">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      data.estado === "completada"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {data.estado === "completada" ? "Completada" : data.estado}
                  </span>
                </p>
              </div>
              {data.observacion && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Observación:</span>
                  <p className="font-medium">{data.observacion}</p>
                </div>
              )}
            </div>

            {/* Items table */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Productos</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Producto</th>
                    <th className="text-center py-2 font-medium">Cant.</th>
                    <th className="text-right py-2 font-medium">Precio</th>
                    <th className="text-right py-2 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detalles.map((d) => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="py-2">{d.producto_nombre ?? d.producto_id.slice(0, 8) + "…"}</td>
                      <td className="py-2 text-center">{d.cantidad}</td>
                      <td className="py-2 text-right tabular-nums">
                        ${Number(d.precio_unitario).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 text-right font-medium tabular-nums">
                        ${Number(d.subtotal).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold text-base">
                    <td colSpan={3} className="py-3 text-right">
                      Total
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      ${Number(data.total).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No se pudo cargar el detalle</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
