import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Insumo } from "../types/insumosTypes"
import MovimientosList from "./MovimientosList"

interface Props {
  insumos: Insumo[] | undefined
  isLoading: boolean
  expandedId: string | null
  onToggleMovimientos: (id: string) => void
  onEdit: (insumo: Insumo) => void
  onDelete: (insumo: Insumo) => void
  onRegistrarMovimiento: (insumo: Insumo) => void
}

export default function InsumosTable({
  insumos,
  isLoading,
  expandedId,
  onToggleMovimientos,
  onEdit,
  onDelete,
  onRegistrarMovimiento,
}: Props) {
  if (isLoading) {
    return <div className="text-muted-foreground py-8 text-center">Cargando insumos...</div>
  }

  if (!insumos || insumos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <p className="text-lg">No hay insumos registrados</p>
        <p className="text-sm">Hacé clic en "Nuevo Insumo" para agregar uno</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Stock Actual</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead className="text-right">Costo Unit.</TableHead>
            <TableHead className="text-right">Stock Mín.</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insumos.map((insumo) => (
            <>
              <TableRow key={insumo.id}>
                <TableCell className="font-medium">{insumo.nombre}</TableCell>
                <TableCell className="text-right tabular-nums">{insumo.stock_actual}</TableCell>
                <TableCell>{insumo.unidad}</TableCell>
                <TableCell className="text-right tabular-nums">
                  ${Number(insumo.costo_unitario).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right tabular-nums">{insumo.stock_minimo}</TableCell>
                <TableCell className="text-center">
                  {insumo.stock_bajo ? (
                    <Badge variant="destructive">Stock bajo</Badge>
                  ) : (
                    <Badge variant="success">OK</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="xs" onClick={() => onEdit(insumo)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => onDelete(insumo)}>
                      Eliminar
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onToggleMovimientos(insumo.id)}
                    >
                      {expandedId === insumo.id ? "Ocultar" : "Movimientos"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === insumo.id && (
                <TableRow key={`${insumo.id}-mov`}>
                  <TableCell colSpan={7} className="p-0">
                    <div className="bg-muted/30 px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold">Movimientos</h4>
                        <Button variant="outline" size="xs" onClick={() => onRegistrarMovimiento(insumo)}>
                          Registrar Movimiento
                        </Button>
                      </div>
                      <MovimientosList insumoId={insumo.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
