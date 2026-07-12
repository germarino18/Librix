import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHistorialCaja } from "../hooks/useCaja"

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR")
}

const PAGE_SIZE = 10

export default function HistorialCaja() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useHistorialCaja(page, PAGE_SIZE)

  const total = data?.total ?? 0
  const items = data?.items ?? []
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Historial de cierres</h2>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando historial...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay cierres registrados.</p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Inicial</TableHead>
                  <TableHead className="text-right">Efectivo</TableHead>
                  <TableHead className="text-right">Transf.</TableHead>
                  <TableHead className="text-right">QR</TableHead>
                  <TableHead className="text-right">Servicios</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((caja) => (
                  <TableRow key={caja.id}>
                    <TableCell>{formatDate(caja.fecha)}</TableCell>
                    <TableCell className="text-right">{formatMoney(caja.monto_inicial)}</TableCell>
                    <TableCell className="text-right">{formatMoney(caja.total_efectivo)}</TableCell>
                    <TableCell className="text-right">{formatMoney(caja.total_transferencia)}</TableCell>
                    <TableCell className="text-right">{formatMoney(caja.total_qr)}</TableCell>
                    <TableCell className="text-right">{formatMoney(caja.total_servicios)}</TableCell>
                    <TableCell className="text-right font-bold">
                      {caja.monto_final != null ? formatMoney(caja.monto_final) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages} ({total} registros)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
