## Context

The POS screen is the primary interface of Librix — what the operator sees when they open the app. Currently there's a placeholder VentasPage at `/ventas` and the root `/` shows a Dashboard. The backend has Venta and DetalleVenta models from C-02 but empty service/repository/router. Stock feature has MovimientoStock model ready.

## Goals / Non-Goals

**Goals:**
- Root `/` becomes the sales screen (full-height, no header chrome)
- Inline product search by name (one word, debounced)
- Grid of frequent products (top sellers) as quick-access buttons
- Cart with add/remove/edit quantity, real-time total
- Payment method selection: Efectivo, Transferencia, QR Mercado Pago
- "Cobrar" button with confirmation dialog
- Backend: POST /api/ventas creates sale + details + stock movements in a single transaction
- Backend: GET /api/ventas/{id} returns sale with details
- Backend: GET /api/productos/buscar returns lightweight active product list
- Dashboard moves from `/` to `/dashboard`

**Non-Goals:**
- No cancellation/reversal of sales in this change (C-07 cash register will handle that)
- No caja validation (RN-07 — deferred to C-07)
- No PDF receipt generation
- No multi-session sales (one cart at a time)
- No authentication or user management

## Decisions

### 1. Sales screen gets its own full-height layout

The POS needs maximum screen real estate. Instead of nesting inside the shared `<Layout>` (which has a header + padding), VentasPage will be a standalone route without the `<Layout>` wrapper. This means the route tree changes from `<Route element={<Layout />}>` to:
```
<Route index element={<VentasPage />} />
<Route element={<Layout />}>
  <Route path="dashboard" element={<DashboardPage />} />
  ...
</Route>
```

Rationale: The header with nav links is unnecessary during peak-hour sales. The operator needs every pixel for products and cart.

### 2. Cart state as plain React state (useReducer)

The cart is ephemeral — it resets after each sale. No database persistence needed. Using `useReducer` with actions (ADD_ITEM, REMOVE_ITEM, UPDATE_QTY, SET_METODO_PAGO, RESET) keeps state predictable without external dependencies.

Alternatives considered: TanStack Query (overkill for ephemeral state), Context (unnecessary indirection for a single page), Zustand (extra dependency).

### 3. Product search: debounced inline GET to /api/productos/buscar

The search endpoint returns lightweight results (id, nombre, precioVenta, stockActual) for active products with stock > 0. Frontend debounces at 300ms to avoid excessive requests.

Alternative considered: Using the existing GET /api/productos endpoint — but that's paginated with full detail, which is too heavy for inline autocomplete.

### 4. Frequent products list from a simple fixed set (no analytics)

For MVP, the "frecuentes" grid uses a predefined set of product IDs (seed data). Analytics-based top-sellers (F-34) is deferred to C-08 profit-dashboard.

Alternative considered: Querying top sellers from sales history — adds complexity without value at this stage since there's no sales data yet.

### 5. Transactional stock deduction in VentaService

Creating a sale involves: insert Venta → insert DetalleVenta rows → for each product: create MovimientoStock (tipo="venta", cantidad negativa) → update Producto.stockActual. All wrapped in a single SQLAlchemy unit of work (`async with session.begin()`). If any step fails, everything rolls back (no partial deductions).

### 6. Repository pattern: StockRepository for MovimientoStock

The existing `backend/app/features/stock/` has empty service/repository. We add a `create_movimiento` method to StockRepository and expose it via StockService. The VentaService will call StockService to register stock movements, maintaining separation of concerns.

Alternative considered: VentaService writing MovimientoStock directly — violates domain separation (stock movements belong to the stock domain).

### 7. CamelCase mapping on frontend

Following the C-03 pattern, the frontend API services explicitly map snake_case (backend) to camelCase (frontend components). Types defined in `types/ventasTypes.ts`.

### 8. Payment method: simple radio/toggle selector

Three options: Efectivo, Transferencia, QR Mercado Pago. No amount breakdown per method (a sale uses one method). Defaults to Efectivo.

## Risks / Trade-offs

- **Risk**: Lossy transitions — route change clears the cart (stale state)
  → **Mitigation**: Cart lives in VentasPage component state; navigating away naturally resets it, which is acceptable behavior for a POS
- **Risk**: Stock deduction race condition on concurrent sales
  → **Mitigation**: Single-user scenario (no concurrent operators); future optimization with `SELECT ... FOR UPDATE` if needed
- **Risk**: Frequent products hardcoded — won't adapt to actual sales trends
  → **Mitigation**: Acceptable for MVP; C-08 will implement analytics-based top sellers
