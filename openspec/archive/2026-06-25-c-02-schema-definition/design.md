# Design: Schema Definition — Full Data Model

**Change ID:** `c-02-schema-definition`
**Status:** Draft

---

## Overview

Add the remaining 4 PocketBase collections required for the full Librix data model. Each collection follows the same pattern as C-01: schema defined via PocketBase admin UI and exported as migration files, with public API rules.

## Collections

### 1. Caja (Daily Cash Register)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| id | text (PK) | auto | — | Auto-generated |
| fecha | date | sí | — | Date of register opening |
| montoInicial | number | sí | 0 | Starting cash amount |
| montoFinal | number | no | — | Set on close (calculated) |
| estado | select | sí | "abierta" | Options: "abierta", "cerrada" |
| totalEfectivo | number | no | 0 | Sum of cash sales for the day |
| totalTransferencia | number | no | 0 | Sum of transfer sales for the day |
| totalQR | number | no | 0 | Sum of QR sales for the day |
| totalServicios | number | no | 0 | Sum of service income for the day |
| observacion | text (optional) | no | — | Free text note |

**API rules:** Public CRUD

### 2. InsumoServicio (Service Supplies)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| id | text (PK) | auto | — | Auto-generated |
| nombre | text | sí | — | e.g. "Resma A4", "Tóner HP 123" |
| stockActual | number | sí | 0 | Current stock |
| unidad | text | sí | — | "unidad", "resma", "cartucho" |
| costoUnitario | number | sí | 0 | Cost per unit |
| stockMinimo | number | sí | 0 | Minimum stock alert threshold |
| paginasPorUnidad | number (nullable) | no | null | Only for toner (estimated page yield) |

**API rules:** Public CRUD

### 3. MovimientoInsumo (Supply Movements)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| id | text (PK) | auto | — | Auto-generated |
| insumoServicio_id | relation → InsumoServicio | sí | — | Which supply |
| tipo | select | sí | — | Options: "ingreso", "consumo" |
| cantidad | number | sí | — | Positive number |
| fechaHora | autodate | auto | — | Auto-set on create |
| observacion | text (optional) | no | — | Free text note |

**API rules:** Public CRUD

### 4. RegistroServicio (Service Log)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| id | text (PK) | auto | — | Auto-generated |
| fecha | date | sí | — | Date of service |
| tipo | select | sí | — | Options: "fotocopia", "plastificado", "souvenir", "otro" |
| descripcion | text | sí | — | Description of service |
| cantidad | number | sí | — | Quantity |
| ingresoTotal | number | sí | 0 | Total income from this service |
| costoInsumos | number | no | 0 | Cost of supplies used (optional) |
| ganancia | number | sí | 0 | ingresoTotal - costoInsumos (calculated by client before write) |

**API rules:** Public CRUD

## PocketBase Notes

- PocketBase does NOT support auto-calculated fields. The `ganancia` field in RegistroServicio must be calculated by the frontend service layer before creating/updating the record.
- All relations use PocketBase's native relation type. The API returns `@collectionId` and `@collectionName` metadata automatically.
- The `autodate` type in PocketBase sets `fechaHora` automatically on create (and optionally on update). No manual timestamp needed.
- Migration files should be exported to `pocketbase/pb_migrations/` for version control reproducibility.

## Frontend Service Files

### Pattern (matching C-01 services)

All service files follow the same pattern using PocketBase's REST API via the configured client in `src/lib/pocketbase.ts`:

```
collection name → src/features/<domain>/api/<name>Service.ts
```

### New Files

| File | Collection(s) | Key Operations |
|------|--------------|----------------|
| `src/features/caja/api/cajaService.ts` | `caja` | `list()`, `getById(id)`, `create(data)`, `update(id, data)`, `getToday()`, `closeCaja(id, data)` |
| `src/features/insumos/api/insumosService.ts` | `insumoServicio`, `movimientoInsumo` | `list()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`, `recordMovimiento(insumoId, tipo, cantidad)` |
| `src/features/servicios/api/serviciosService.ts` | `registroServicio` | `list()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` |

### Architecture

All services:
- Import PocketBase client from `@/lib/pocketbase`
- Return typed responses using TypeScript interfaces defined in `src/features/<domain>/types/`
- Use TanStack Query compatible patterns (async functions returning Promises)

## Security

All 4 collections use **public CRUD rules** (no auth required), consistent with the existing C-01 collections. This is acceptable because:
- PocketBase runs on local network only (not exposed to internet)
- MVP has no user authentication
- Per project convention: `knowledge-base/08_arquitectura_propuesta.md` §Seguridad
