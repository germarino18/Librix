import { useEffect, useMemo, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCalculoServicio } from "../hooks/useCalculoServicio"
import { TIPOS_FRECUENTES_PLASTIFICADO, PRECIO_FOTOCOPIA_POR_HOJA, PRECIOS_PLASTIFICADO } from "../types/serviciosTypes"
import type { TipoServicio } from "../types/serviciosTypes"

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  tipo: z.enum(["fotocopia", "plastificado", "souvenir", "otro"]),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.number().min(1, "La cantidad debe ser al menos 1"),
  tipoPlastificado: z.string().optional(),
  precioUnitario: z.number().min(0, "El precio debe ser positivo"),
  ingresoTotal: z.number().min(0, "El ingreso debe ser positivo"),
  costoInsumos: z.number().min(0, "El costo debe ser positivo"),
})

type FormValues = z.infer<typeof formSchema>

function formatCurrency(value: number): string {
  return `$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function todayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    fecha: string
    tipo: TipoServicio
    descripcion: string
    cantidad: number
    ingreso_total: number
    costo_insumos: number
  }) => Promise<void>
}

export default function ServicioForm({ open, onOpenChange, onSubmit }: Props) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      fecha: todayString(),
      tipo: "fotocopia",
      descripcion: "",
      cantidad: 1,
      tipoPlastificado: "A4",
      precioUnitario: PRECIO_FOTOCOPIA_POR_HOJA,
      ingresoTotal: 0,
      costoInsumos: 0,
    }),
    []
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const [submitting, setSubmitting] = useState(false)

  const tipo = form.watch("tipo")
  const tipoPlastificado = form.watch("tipoPlastificado")
  const cantidad = form.watch("cantidad")
  const precioUnitario = form.watch("precioUnitario")
  const ingresoTotal = form.watch("ingresoTotal")
  const costoInsumos = form.watch("costoInsumos")

  const calculo = useCalculoServicio({
    tipo,
    cantidad,
    precioUnitario,
    ingresoTotalManual: ingresoTotal,
    costoInsumos,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
    }
  }, [open, form, defaultValues])

  // When plastificado type changes, update the unit price
  useEffect(() => {
    if (tipo === "plastificado" && tipoPlastificado) {
      const precio = PRECIOS_PLASTIFICADO[tipoPlastificado] ?? 100
      form.setValue("precioUnitario", precio)
    }
  }, [tipoPlastificado, tipo, form])

  // Setear descripcion y defaults cada vez que se abre el diálogo o cambia el tipo
  useEffect(() => {
    if (!open) return
    if (tipo === "fotocopia") {
      form.setValue("descripcion", "Fotocopias")
      form.setValue("precioUnitario", PRECIO_FOTOCOPIA_POR_HOJA)
    } else if (tipo === "plastificado") {
      form.setValue("descripcion", "Plastificado")
      const plastificado = form.getValues("tipoPlastificado") ?? "A4"
      form.setValue("precioUnitario", PRECIOS_PLASTIFICADO[plastificado] ?? 100)
    } else {
      form.setValue("descripcion", "")
    }
    form.setValue("cantidad", 1)
    form.setValue("ingresoTotal", 0)
    form.setValue("costoInsumos", 0)
  }, [tipo, form, open])

  // Check if there are form errors
  const formErrors = form.formState.errors
  const hasErrors = Object.keys(formErrors).length > 0

  const handleFormSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      await onSubmit({
        fecha: data.fecha,
        tipo: data.tipo,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        ingreso_total: calculo.ingresoCalculado,
        costo_insumos: data.costoInsumos,
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  // Generic handler for numeric inputs: type="text" + inputMode
  const handleNumericChange = useCallback(
    (fieldName: "cantidad" | "precioUnitario" | "ingresoTotal" | "costoInsumos") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        if (raw === "") {
          form.setValue(fieldName, 0 as unknown as number)
          return
        }
        const num = Number(raw)
        if (!isNaN(num)) {
          form.setValue(fieldName, num)
        }
      },
    [form]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        // Prevent dialog from closing on accidental outside clicks
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Registrar Servicio</DialogTitle>
          <DialogDescription>Completá los datos del servicio realizado</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Global errors banner */}
          {hasErrors && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Revisá los campos del formulario antes de guardar.
              {Object.entries(formErrors).map(([key, err]) => (
                <p key={key} className="mt-1">
                  • {key}: {err?.message as string}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input type="date" {...form.register("fecha")} />
              {form.formState.errors.fecha && (
                <p className="text-sm text-destructive">{form.formState.errors.fecha.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(v) => form.setValue("tipo", v as TipoServicio)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fotocopia">Fotocopia</SelectItem>
                  <SelectItem value="plastificado">Plastificado</SelectItem>
                  <SelectItem value="souvenir">Souvenir</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tipo === "fotocopia" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Cantidad de hojas</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    defaultValue={1}
                    onChange={handleNumericChange("cantidad")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio por hoja ($)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    defaultValue={PRECIO_FOTOCOPIA_POR_HOJA}
                    onChange={handleNumericChange("precioUnitario")}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ingreso calculado: {formatCurrency(calculo.ingresoCalculado)} {" "}
                <span className="text-xs">
                  ({cantidad} hojas × ${precioUnitario}/hoja)
                </span>
              </p>
            </>
          )}

          {tipo === "plastificado" && (
            <>
              <div className="space-y-1.5">
                <Label>Tipo frecuente</Label>
                <Select
                  value={tipoPlastificado ?? "A4"}
                  onValueChange={(v) => form.setValue("tipoPlastificado", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_FRECUENTES_PLASTIFICADO.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Cantidad</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    defaultValue={1}
                    onChange={handleNumericChange("cantidad")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio por unidad ($)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    defaultValue={tipoPlastificado ? (PRECIOS_PLASTIFICADO[tipoPlastificado] ?? 100) : 100}
                    onChange={handleNumericChange("precioUnitario")}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ingreso calculado: {formatCurrency(calculo.ingresoCalculado)} {" "}
                <span className="text-xs">
                  ({cantidad} × ${precioUnitario}/unidad)
                </span>
              </p>
            </>
          )}

          {(tipo === "souvenir" || tipo === "otro") && (
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Input
                placeholder="Ej: Llaveros personalizados"
                {...form.register("descripcion")}
              />
              {form.formState.errors.descripcion && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.descripcion.message}
                </p>
              )}
            </div>
          )}

          {tipo === "souvenir" && (
            <div className="space-y-1.5">
              <Label>Ingreso total ($)</Label>
              <Input
                type="text"
                inputMode="decimal"
                defaultValue={0}
                onChange={handleNumericChange("ingresoTotal")}
              />
            </div>
          )}

          {tipo === "otro" && (
            <>
              <div className="space-y-1.5">
                <Label>Ingreso total ($)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  defaultValue={0}
                  onChange={handleNumericChange("ingresoTotal")}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Costo de insumos ($, opcional)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  defaultValue={0}
                  onChange={handleNumericChange("costoInsumos")}
                />
              </div>
            </>
          )}

          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancia estimada:</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(calculo.gananciaEstimada)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Registrar Servicio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
