import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StockAlertBadge } from "./StockAlertBadge"
import type { Producto } from "../types/productosTypes"

interface ProductosTableProps {
  productos: Producto[]
  onEdit: (producto: Producto) => void
  onToggleActivo: (producto: Producto) => void
  onDelete: (producto: Producto) => void
}

export function ProductosTable({
  productos,
  onEdit,
  onToggleActivo,
  onDelete,
}: ProductosTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border">
        <p className="text-sm text-muted-foreground">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Precio Venta</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Stock Mínimo</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((producto) => (
          <TableRow
            key={producto.id}
            className={
              producto.stockActual < producto.stockMinimo
                ? "bg-red-50 dark:bg-red-950/20"
                : producto.stockActual <= producto.stockMinimo * 1.5
                  ? "bg-orange-50 dark:bg-orange-950/20"
                  : undefined
            }
          >
            <TableCell className="font-medium">{producto.nombre}</TableCell>
            <TableCell>{producto.expand?.categoria_id?.nombre ?? "-"}</TableCell>
            <TableCell>${Number(producto.precioVenta).toFixed(2)}</TableCell>
            <TableCell>
              <StockAlertBadge
                stockActual={producto.stockActual}
                stockMinimo={producto.stockMinimo}
              />
            </TableCell>
            <TableCell>{producto.stockMinimo}</TableCell>
            <TableCell>{producto.unidad === "unidad" ? "Unidad" : producto.unidad === "kg" ? "Kg" : "m"}</TableCell>
            <TableCell>
              {producto.activo ? (
                <span className="text-green-600 dark:text-green-400">Activo</span>
              ) : (
                <span className="text-muted-foreground">Inactivo</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(producto)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleActivo(producto)}
                >
                  {producto.activo ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onDelete(producto)}
                >
                  Eliminar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
