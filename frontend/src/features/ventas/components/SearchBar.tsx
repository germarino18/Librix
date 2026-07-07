import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useProductSearch } from "../hooks/useVentas"
import type { CartItem } from "../types/ventasTypes"

interface SearchBarProps {
  onAddToCart: (item: CartItem) => void
}

export default function SearchBar({ onAddToCart }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [showResults, setShowResults] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebounced(query), 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  const { data: results = [], isLoading } = useProductSearch(debounced)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSelect(product: (typeof results)[0]) {
    onAddToCart({
      productoId: product.id,
      nombre: product.nombre,
      precioUnitario: product.precioVenta,
      cantidad: 1,
      stockActual: product.stockActual,
      subtotal: product.precioVenta,
    })
    setQuery("")
    setDebounced("")
    setShowResults(false)
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar producto..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length >= 2) setShowResults(true)
          }}
          onFocus={() => {
            if (query.length >= 2) setShowResults(true)
          }}
          className="pl-10 h-12 text-lg"
        />
      </div>
      {showResults && debounced.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-md">
          {isLoading && (
            <div className="p-3 text-sm text-muted-foreground">Buscando...</div>
          )}
          {!isLoading && results.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              Sin resultados
            </div>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors"
            >
              <span className="font-medium">{p.nombre}</span>
              <span className="text-sm text-muted-foreground">
                ${Number(p.precioVenta).toLocaleString("es-AR")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
