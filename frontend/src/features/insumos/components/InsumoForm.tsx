import { useEffect, useMemo } from "react"
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Insumo } from "../types/insumosTypes"

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  unidad: z.string().min(1, "Seleccioná una unidad"),
  costo_unitario: z.number().min(0, "Debe ser un valor positivo"),
  stock_actual: z.number().min(0, "Debe ser un valor positivo"),
  stock_minimo: z.number().min(0, "Debe ser un valor positivo"),
  paginas_por_unidad: z.number().int("Debe ser un número entero").positive().nullable().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues) => Promise<void>
  editingInsumo: Insumo | null
}

export default function InsumoForm({ open, onOpenChange, onSubmit, editingInsumo }: Props) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      nombre: "",
      unidad: "unidad",
      costo_unitario: 0,
      stock_actual: 0,
      stock_minimo: 0,
      paginas_por_unidad: null,
    }),
    []
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const unidad = form.watch("unidad")

  useEffect(() => {
    if (editingInsumo) {
      form.reset({
        nombre: editingInsumo.nombre,
        unidad: editingInsumo.unidad,
        costo_unitario: editingInsumo.costo_unitario,
        stock_actual: editingInsumo.stock_actual,
        stock_minimo: editingInsumo.stock_minimo,
        paginas_por_unidad: editingInsumo.paginas_por_unidad,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [editingInsumo, form, defaultValues])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}</DialogTitle>
          <DialogDescription>
            {editingInsumo
              ? "Actualizá los datos del insumo"
              : "Completá los datos para registrar un nuevo insumo"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Papel A4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unidad">Unidad</SelectItem>
                      <SelectItem value="resma">Resma</SelectItem>
                      <SelectItem value="cartucho">Cartucho</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costo_unitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Unitario</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock_actual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Actual</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {unidad === "cartucho" && (
              <FormField
                control={form.control}
                name="paginas_por_unidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Páginas por Cartucho</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val === "" ? null : parseInt(val, 10))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingInsumo ? "Guardar Cambios" : "Crear Insumo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
