import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RegistroServicio, TipoServicio } from "../types/serviciosTypes"

interface Props {
  servicios: RegistroServicio[] | undefined
  isLoading: boolean
  filtroTipo: TipoServicio | "todos"
  onFiltroTipoChange: (tipo: TipoServicio | "todos") => void
  onDelete: (servicio: RegistroServicio) => void
}

const TIPO_LABELS: Record<TipoServicio, string> = {
  fotocopia: "Fotocopia",
  plastificado: "Plastificado",
  souvenir: "Souvenir",
  otro: "Otro",
}

const TIPO_VARIANT: Record<TipoServicio, "default" | "secondary" | "outline" | "destructive"> = {
  fotocopia: "default",
  plastificado: "secondary",
  souvenir: "outline",
  otro: "outline",
}

function formatCurrency(value: number): string {
  return `$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function ServiciosTable({
  servicios,
  isLoading,
  filtroTipo,
  onFiltroTipoChange,
  onDelete,
}: Props) {
  if (isLoading) {
    return <div className="text-muted-foreground py-8 text-center">Cargando servicios...</div>
  }

  const totalIngresos = servicios?.reduce((acc, s) => acc + s.ingreso_total, 0) ?? 0
  const totalCostos = servicios?.reduce((acc, s) => acc + s.costo_insumos, 0) ?? 0
  const totalGanancia = servicios?.reduce((acc, s) => acc + s.ganancia, 0) ?? 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Filtrar por tipo:</span>
        <Select
          value={filtroTipo}
          onValueChange={(v) => onFiltroTipoChange(v as TipoServicio | "todos")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="fotocopia">Fotocopia</SelectItem>
            <SelectItem value="plastificado">Plastificado</SelectItem>
            <SelectItem value="souvenir">Souvenir</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!servicios || servicios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <p className="text-lg">No hay servicios registrados</p>
          <p className="text-sm">Usá el formulario para registrar un servicio</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Ingreso</TableHead>
                <TableHead className="text-right">Costo Insumos</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="tabular-nums">{servicio.fecha}</TableCell>
                  <TableCell>
                    <Badge variant={TIPO_VARIANT[servicio.tipo]}>
                      {TIPO_LABELS[servicio.tipo]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{servicio.descripcion}</TableCell>
                  <TableCell className="text-right tabular-nums">{servicio.cantidad}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(servicio.ingreso_total)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(servicio.costo_insumos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrency(servicio.ganancia)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" onClick={() => onDelete(servicio)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="border-t-2 font-semibold">
                <TableCell colSpan={4}>Totales</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(totalIngresos)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(totalCostos)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(totalGanancia)}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
