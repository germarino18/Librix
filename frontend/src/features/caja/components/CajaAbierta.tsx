import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Caja } from "../types/cajaTypes"
import CajaResumen from "./CajaResumen"

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface Props {
  caja: Caja
  onCerrar: () => void
}

export default function CajaAbierta({ caja, onCerrar }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Caja del día</CardTitle>
          <Badge variant="default">Abierta</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Monto inicial:</span>
            <span className="text-lg font-bold">{formatMoney(caja.monto_inicial)}</span>
          </div>
          {caja.observacion && (
            <p className="text-sm text-muted-foreground">{caja.observacion}</p>
          )}
        </CardContent>
      </Card>

      <CajaResumen caja={caja} />

      <div className="flex justify-end">
        <Button variant="destructive" onClick={onCerrar}>
          Cerrar caja
        </Button>
      </div>
    </div>
  )
}
