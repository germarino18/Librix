import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Categoria } from "../types/productosTypes"

interface ProductosFiltersProps {
  search: string
  categoria: string
  categorias: Categoria[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function ProductosFilters({
  search,
  categoria,
  categorias,
  onSearchChange,
  onCategoryChange,
}: ProductosFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Buscar por nombre..."
        className="max-w-xs"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select value={categoria} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las categorías</SelectItem>
          {categorias.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
