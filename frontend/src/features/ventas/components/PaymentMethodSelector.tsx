import { Button } from "@/components/ui/button"
import { Banknote, Building2, QrCode } from "lucide-react"

type MetodoPago = "efectivo" | "transferencia" | "qr_mercadopago"

interface PaymentMethodSelectorProps {
  value: MetodoPago
  onChange: (method: MetodoPago) => void
}

const methods: { value: MetodoPago; label: string; icon: React.ReactNode }[] = [
  { value: "efectivo", label: "Efectivo", icon: <Banknote className="size-5" /> },
  { value: "transferencia", label: "Transferencia", icon: <Building2 className="size-5" /> },
  { value: "qr_mercadopago", label: "QR M.P.", icon: <QrCode className="size-5" /> },
]

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Método de Pago</h3>
      <div className="flex gap-2">
        {methods.map((m) => (
          <Button
            key={m.value}
            variant={value === m.value ? "default" : "outline"}
            className="flex-1 flex-col gap-1 h-auto py-3"
            onClick={() => onChange(m.value)}
          >
            {m.icon}
            <span className="text-xs">{m.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
