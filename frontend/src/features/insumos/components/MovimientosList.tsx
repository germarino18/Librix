import { useMovimientos } from "../hooks/useMovimientos"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Props {
  insumoId: string
}

export default function MovimientosList({ insumoId }: Props) {
  const { data: movimientos, isLoading } = useMovimientos(insumoId)

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Cargando movimientos...</div>
  }

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No hay movimientos registrados para este insumo
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Movimientos</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Observación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimientos.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                {new Date(m.fecha_hora).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {m.tipo === "ingreso" ? (
                  <Badge variant="success">Ingreso</Badge>
                ) : (
                  <Badge variant="destructive">Consumo</Badge>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{m.cantidad}</TableCell>
              <TableCell className="text-muted-foreground">{m.observacion ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
