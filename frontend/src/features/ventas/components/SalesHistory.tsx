import { useVentas } from "../hooks/useVentas"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SaleDetailDialog from "./SaleDetailDialog"

export default function SalesHistory() {
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isLoading } = useVentas(page)

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Cargando...</div>
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <p className="text-lg">No hay ventas registradas</p>
        <p className="text-sm">Las ventas aparecerán acá una vez que las registres</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Fecha</th>
              <th className="text-left py-3 px-2 font-medium">Método</th>
              <th className="text-right py-3 px-2 font-medium">Total</th>
              <th className="text-center py-3 px-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((v) => (
              <tr
                key={v.id}
                className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedId(v.id)}
              >
                <td className="py-2 px-2">
                  {new Date(v.fecha_hora).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-2 px-2 capitalize">
                  {v.metodo_pago.replace("_", " ")}
                </td>
                <td className="py-2 px-2 text-right font-medium tabular-nums">
                  ${Number(v.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.estado === "completada"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {v.estado === "completada" ? "Completada" : v.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      <SaleDetailDialog
        ventaId={selectedId}
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      />
    </div>
  )
}
