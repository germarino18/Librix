## Why

The bookstore needs a fast, touch-friendly point-of-sale screen to process sales during peak hours. Currently there's only an empty placeholder for VentasPage at `/ventas` — no product search, no cart, no checkout workflow.

## What Changes

- **Reroute**: Make `/` (root) the sales screen; move Dashboard to `/dashboard`
- **Frontend**: Build full POS interface at `frontend/src/features/ventas/` — inline product search, frequent products grid, cart with quantity editing, payment method selection (Efectivo / Transferencia / QR Mercado Pago), "Cobrar" button with confirmation
- **Backend**: Implement `VentaService` + `VentaRepository` — create sale with automatic stock discount (RN-01), get sale by id
- **Backend**: Add `GET /api/productos/buscar` for inline search (lightweight, returns only active products)
- **Backend**: Wire `GET /api/ventas/{id}` endpoint
- **Stock**: Register `MovimientoStock` tipo "venta" on each product when sale is confirmed (RN-01)
- **Validation**: Reject empty cart (RN-04), handle cancellation/reversal (RN-05)

## Capabilities

### New Capabilities
- `sales-point-of-sale`: Full POS screen — product search, frequent products grid, cart, payment methods, Cobrar workflow
- `ventas-api`: Backend endpoints for ventas (POST /ventas, GET /ventas/{id}) with automatic stock deduction
- `product-search`: Lightweight search endpoint for active products during sale

### Modified Capabilities
- *(none — first change touching these capabilities)*

## Impact

- **Frontend**: `frontend/src/features/ventas/` — pages, components, hooks, api, types
- **Frontend**: `frontend/src/App.tsx` — route changes (root → VentasPage)
- **Frontend**: `frontend/src/components/Layout.tsx` — nav link update
- **Backend**: `backend/app/features/ventas/` — service.py, repository.py, router.py (implement from C-02 placeholders)
- **Backend**: `backend/app/features/productos/router.py` — add GET /buscar endpoint
- **Backend**: `backend/app/features/stock/` — add repository method to create MovimientoStock
- **Backend**: `backend/app/main.py` — register ventas router
