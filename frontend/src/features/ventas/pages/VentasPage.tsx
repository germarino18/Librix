import { useReducer, useCallback, useEffect, useState } from "react"
import SearchBar from "../components/SearchBar"
import FrequentProductsGrid from "../components/FrequentProductsGrid"
import CartPanel from "../components/CartPanel"
import PaymentMethodSelector from "../components/PaymentMethodSelector"
import CobrarButton from "../components/CobrarButton"
import SalesHistory from "../components/SalesHistory"
import { useProductSearch } from "../hooks/useVentas"
import { useCreateVenta } from "../hooks/useVentas"
import type { CartItem } from "../types/ventasTypes"
import { cn } from "@/shared/utils/cn"

type MetodoPago = "efectivo" | "transferencia" | "qr_mercadopago"

interface CartState {
  items: CartItem[]
  metodoPago: MetodoPago
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { productoId: string; cantidad: number } }
  | { type: "SET_METODO_PAGO"; payload: MetodoPago }
  | { type: "RESET" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productoId === action.payload.productoId)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productoId === action.payload.productoId
              ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioUnitario }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.productoId !== action.payload) }
    case "UPDATE_QTY": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.productoId === action.payload.productoId
            ? { ...i, cantidad: action.payload.cantidad, subtotal: action.payload.cantidad * i.precioUnitario }
            : i
        ),
      }
    }
    case "SET_METODO_PAGO":
      return { ...state, metodoPago: action.payload }
    case "RESET":
      return { items: [], metodoPago: "efectivo" }
    default:
      return state
  }
}

type ViewMode = "pos" | "historial"

export default function VentasPage() {
  const [view, setView] = useState<ViewMode>("pos")
  const [state, dispatch] = useReducer(cartReducer, { items: [], metodoPago: "efectivo" })
  const createVenta = useCreateVenta(() => dispatch({ type: "RESET" }))
  const [frequentProducts, setFrequentProducts] = useState<
    Array<{ id: string; nombre: string; precioVenta: number; stockActual: number }>
  >([])

  const { data: searchResults } = useProductSearch("a")
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setFrequentProducts(searchResults.slice(0, 9))
    }
  }, [searchResults])

  const total = state.items.reduce((sum, i) => sum + i.subtotal, 0)

  const handleAddToCart = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
    []
  )

  const handleUpdateQty = useCallback(
    (productoId: string, cantidad: number) =>
      dispatch({ type: "UPDATE_QTY", payload: { productoId, cantidad } }),
    []
  )

  const handleRemove = useCallback(
    (productoId: string) => dispatch({ type: "REMOVE_ITEM", payload: productoId }),
    []
  )

  const handleCobrar = useCallback(async () => {
    await createVenta.mutateAsync({
      metodo_pago: state.metodoPago,
      detalles: state.items.map((i) => ({
        producto_id: i.productoId,
        cantidad: i.cantidad,
        precio_unitario: i.precioUnitario,
        subtotal: i.subtotal,
      })),
    })
  }, [state, createVenta])

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tab bar */}
      <div className="flex border-b px-4">
        <button
          onClick={() => setView("pos")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            view === "pos"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Punto de Venta
        </button>
        <button
          onClick={() => setView("historial")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            view === "historial"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Historial de Ventas
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {view === "pos" ? (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
              <SearchBar onAddToCart={handleAddToCart} />
              <FrequentProductsGrid products={frequentProducts} onAddToCart={handleAddToCart} />
            </div>

            <div className="w-[420px] border-l bg-background flex flex-col p-4">
              <h2 className="text-lg font-semibold mb-4">Carrito</h2>
              <CartPanel
                items={state.items}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />

              <div className="mt-auto space-y-4 pt-4 border-t">
                <PaymentMethodSelector
                  value={state.metodoPago}
                  onChange={(m) => dispatch({ type: "SET_METODO_PAGO", payload: m })}
                />
                <CobrarButton
                  disabled={state.items.length === 0}
                  total={total}
                  metodoPago={state.metodoPago}
                  onConfirm={handleCobrar}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full">
            <SalesHistory />
          </div>
        )}
      </div>
    </div>
  )
}
