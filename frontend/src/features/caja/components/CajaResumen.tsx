import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Caja } from "../types/cajaTypes"

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface Props {
  caja: Caja
}

export default function CajaResumen({ caja }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Efectivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{formatMoney(caja.total_efectivo)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Transferencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{formatMoney(caja.total_transferencia)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            QR / MercadoPago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{formatMoney(caja.total_qr)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{formatMoney(caja.total_servicios)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
