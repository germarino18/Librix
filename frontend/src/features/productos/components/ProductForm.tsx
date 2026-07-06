import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import type { Producto, Categoria } from "../types/productosTypes"

function PrecioCalculado({ precioCompra, porcentaje }: { precioCompra?: number; porcentaje?: number }) {
  if (precioCompra == null || porcentaje == null || precioCompra <= 0) return null
  const precioVenta = precioCompra * (1 + porcentaje / 100)
  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950">
      <span className="font-medium text-green-700 dark:text-green-300">Precio venta sugerido: </span>
      <span className="text-lg font-bold text-green-800 dark:text-green-200">
        ${precioVenta.toFixed(2)}
      </span>
    </div>
  )
}

const productSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  categoria_id: z.string().optional(),
  precioCompra: z.number().positive("El precio debe ser mayor a 0").optional(),
  porcentajeGanancia: z.number().min(0, "El porcentaje no puede ser negativo").max(99, "Máximo 99%").optional(),
  stockActual: z.number().min(0, "El stock no puede ser negativo").optional(),
  stockMinimo: z.number().optional(),
  unidad: z.enum(["unidad", "kg", "m"]).optional(),
  activo: z.boolean().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  producto?: Producto
  categorias: Categoria[]
  onSubmit: (data: ProductFormValues) => void
  disabled?: boolean
}

export function ProductForm({ producto, categorias, onSubmit, disabled }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: producto?.nombre ?? "",
      categoria_id: producto?.categoria_id ?? "",
      precioCompra: producto?.precioCompra ?? undefined,
      porcentajeGanancia: producto?.porcentajeGanancia ?? undefined,
      stockActual: producto?.stockActual ?? undefined,
      stockMinimo: producto?.stockMinimo ?? undefined,
      unidad: producto?.unidad ?? undefined,
      activo: producto?.activo ?? true,
    },
  })

  return (
    <Form {...form}>
      <form key={producto?.id ?? "new"} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nombre del producto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="precioCompra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio compra ($)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    defaultValue={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value
                      if (raw === "") return
                      const cleaned = raw.replace(",", ".")
                      if (/^\d*\.?\d{0,2}$/.test(cleaned)) {
                        field.onChange(Number(cleaned))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="porcentajeGanancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ganancia (%)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    defaultValue={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value
                      if (raw === "") return
                      if (/^\d{0,2}$/.test(raw)) {
                        field.onChange(Number(raw))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Precio venta calculado automáticamente */}
        <PrecioCalculado
          precioCompra={form.watch("precioCompra")}
          porcentaje={form.watch("porcentajeGanancia")}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stockActual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock actual</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    defaultValue={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value
                      if (raw === "") return
                      if (/^\d{0,9}$/.test(raw)) {
                        field.onChange(Number(raw))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockMinimo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock mínimo</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    defaultValue={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value
                      if (raw === "") return
                      if (/^\d{0,9}$/.test(raw)) {
                        field.onChange(Number(raw))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidad</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="kg">Kilogramo</SelectItem>
                  <SelectItem value="m">Metro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="size-4"
                  checked={field.value ?? true}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mb-0">Activo</FormLabel>
            </FormItem>
          )}
        />

        <button type="submit" hidden disabled={disabled} />
      </form>
    </Form>
  )
}
