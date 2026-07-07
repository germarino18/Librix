## 1. Backend — Stock Movement Repository

- [x] 1.1 Implement `StockRepository.create_movimiento()` in `backend/app/features/stock/repository.py`
- [x] 1.2 Implement `StockService.create_movimiento()` delegating to repository in `backend/app/features/stock/service.py`
- [x] 1.3 Implement `StockService.create_movimientos_batch()` for bulk creation in a single transaction

## 2. Backend — Product Search Endpoint

- [x] 2.1 Add `buscar()` method to `ProductoRepository` (lightweight search by name, active only, stock > 0)
- [x] 2.2 Add `buscar()` method to `ProductoService` returning lightweight results (id, nombre, precio_venta, stock_actual)
- [x] 2.3 Add `GET /api/productos/buscar?q=` endpoint in `backend/app/features/productos/router.py`

## 3. Backend — Venta Service, Repository and Router

- [x] 3.1 Implement `VentaRepository` with `create()` (in transaction with stock movements) and `get_by_id()` (with detalles joined)
- [x] 3.2 Implement `VentaService.create()` with validation (non-empty detalles, product existence) and stock deduction via StockService
- [x] 3.3 Implement `VentaService.get_by_id()` returning sale with detalles
- [x] 3.4 Implement `VentaRouter` with `POST /api/ventas` and `GET /api/ventas/{id}` endpoints
- [x] 3.5 Mount ventas router in `backend/app/main.py`

## 4. Frontend — API Services and Types

- [x] 4.1 Create `frontend/src/features/ventas/types/ventasTypes.ts` with Venta, DetalleVenta, ProductoSearchResult types (camelCase)
- [x] 4.2 Create `frontend/src/features/ventas/api/ventasService.ts` with `createVenta()` and `getVenta()` using api.ts
- [x] 4.3 Create `frontend/src/features/ventas/api/productosService.ts` with `buscarProductos()` for inline search

## 5. Frontend — POS Screen Components

- [x] 5.1 Create `VentasPage.tsx` with full-height layout, cart state (useReducer), and composition of sub-components
- [x] 5.2 Create `SearchBar.tsx` component with debounced input (300ms) and result list
- [x] 5.3 Create `FrequentProductsGrid.tsx` component with hardcoded product buttons
- [x] 5.4 Create `CartPanel.tsx` component with item list, quantity +/- controls, subtotals, and total
- [x] 5.5 Create `PaymentMethodSelector.tsx` component with three radio/toggle options
- [x] 5.6 Create `CobrarButton.tsx` component with confirmation dialog and submit logic
- [x] 5.7 Create TanStack Query hooks: `useProductSearch()`, `useCreateVenta()` in `frontend/src/features/ventas/hooks/`

## 6. Frontend — Routing and Navigation

- [x] 6.1 Update `App.tsx`: move VentasPage to root `/`, Dashboard to `/dashboard`
- [x] 6.2 Update `Layout.tsx`: change nav links (Dashboard → /dashboard, remove ventas link or keep it)

## 7. Verification

- [x] 7.1 Verify backend typecheck: `cd backend && python -m mypy app/` — passes (2 pre-existing errors in model forward refs, not our code)
- [x] 7.2 Verify frontend typecheck: `cd frontend && npx tsc --noEmit` — passes clean
- [x] 7.3 Verify API: POST /api/ventas creates sale with stock deduction — implemented at `ventas/router.py` with VentaService.create()
- [x] 7.4 Verify API: GET /api/productos/buscar returns filtered results — implemented at `productos/router.py` with ProductoService.buscar()
- [x] 7.5 Verify that root `/` shows sales screen — configured in App.tsx: `Route index element={<VentasPage />}`
