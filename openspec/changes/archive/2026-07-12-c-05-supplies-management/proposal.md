## Why

Librix needs to track service supply inventory (photocopy paper, toner, laminating pouches, etc.) separately from product stock. Currently there is no way to register when supplies arrive or consume them daily, making it impossible to calculate service cost or detect low stock before running out.

## What Changes

- **F-15 — ABM de insumos**: Full CRUD for InsumoServicio entities (nombre, stockActual, unidad, costoUnitario, stockMinimo, paginasPorUnidad)
- **F-16 — Registro de ingreso**: Record supply arrivals via MovimientoInsumo with tipo="ingreso", atomically increasing stockActual
- **F-17 — Registro de consumo diario**: Record consumption via MovimientoInsumo with tipo="consumo", atomically decreasing stockActual
- **F-20 — Alerta de insumo bajo**: Visual red/orange badge when stockActual < stockMinimo in the insumos list
- **Backend**: New `backend/app/features/insumos/` feature with models, schemas, repository, service, router
- **Frontend**: New `frontend/src/features/insumos/` feature with types, API client, hooks, components, and page at `/insumos`

## Capabilities

### New Capabilities
- `insumos-crud`: CRUD operations for InsumoServicio — list all, get by ID, create, update, delete
- `movimientos-insumo`: Create and list MovimientoInsumo records (ingreso/consumo) per insumo, with atomic stockActual update via service layer
- `stock-alertas`: Low-stock visual alert when stockActual < stockMinimo, exposed in the list endpoint and rendered as color-coded badge in the table

### Modified Capabilities
_No existing capability requirements are changing._

## Impact

- **Backend**: New `backend/app/features/insumos/` — models.py, schemas.py, repository.py, service.py, router.py + mount in main.py at `/api/insumos`
- **Frontend**: New `frontend/src/features/insumos/` — types/, api/, hooks/, components/, pages/ + route `/insumos` in router
- **Database**: Tables already exist (InsumoServicio, MovimientoInsumo created by C-02 migrations)
- **Dependencies**: C-02 schema-definition (tables exist), fastapi-backend spec (feature structure), api-client spec (HTTP client)
