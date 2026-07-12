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
  onAbrir: () => void
}

export default function CajaCerrada({ caja, onAbrir }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Caja cerrada</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAbrir}>
              Abrir nueva caja
            </Button>
            <Badge variant="secondary">Cerrada</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Monto inicial:</span>
            <span className="font-bold">{formatMoney(caja.monto_inicial)}</span>
          </div>
          {caja.monto_final != null && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Monto final:</span>
              <span className="text-lg font-bold text-green-600">
                {formatMoney(caja.monto_final)}
              </span>
            </div>
          )}
          {caja.observacion && (
            <p className="text-sm text-muted-foreground">{caja.observacion}</p>
          )}
        </CardContent>
      </Card>

      <CajaResumen caja={caja} />
    </div>
  )
}
