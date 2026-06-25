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
import type { Categoria } from "../types/productosTypes"

const categorySchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  categoria?: Categoria
  onSubmit: (data: CategoryFormValues) => void
  disabled?: boolean
}

export function CategoryForm({ categoria, onSubmit, disabled }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombre: categoria?.nombre ?? "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nombre de la categoría" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" hidden disabled={disabled} />
      </form>
    </Form>
  )
}
