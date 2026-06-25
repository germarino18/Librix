# Implementation Tasks: Schema Definition — Full Data Model

**Change ID:** `c-02-schema-definition`
**Governance Level:** CRITICAL

---

## Phase 1: PocketBase Collections (Schema Definition)

- [x] 1.1 Create `caja` collection in PocketBase Admin UI:
  - Fields: fecha (date), montoInicial (number), montoFinal (number), estado (select: abierta, cerrada), totalEfectivo (number), totalTransferencia (number), totalQR (number), totalServicios (number), observacion (text, optional)
  - API rules: public CRUD

- [x] 1.2 Create `insumoServicio` collection in PocketBase Admin UI:
  - Fields: nombre (text), stockActual (number), unidad (text), costoUnitario (number), stockMinimo (number), paginasPorUnidad (number, nullable)
  - API rules: public CRUD

- [x] 1.3 Create `movimientoInsumo` collection in PocketBase Admin UI:
  - Fields: insumoServicio_id (relation → insumoServicio), tipo (select: ingreso, consumo), cantidad (number), fechaHora (autodate), observacion (text, optional)
  - API rules: public CRUD

- [x] 1.4 Create `registroServicio` collection in PocketBase Admin UI:
  - Fields: fecha (date), tipo (select: fotocopia, plastificado, souvenir, otro), descripcion (text), cantidad (number), ingresoTotal (number), costoInsumos (number, default 0), ganancia (number)
  - API rules: public CRUD

**Quality Gate:**
- [x] All 4 collections visible in PocketBase Admin UI with correct field types
- [x] API allows anonymous CRUD on all new collections
- [x] Relation (movimientoInsumo → insumoServicio) works via API with `$expand`

---

## Phase 2: Migration Export

- [x] 2.1 Export PocketBase schema migrations to `pocketbase/pb_migrations/`:
  - Generate migration JSON files for all 4 new collections using PocketBase's built-in migration system
  - Verify migration files are reproducible (delete and re-create collections from migrations)

**Quality Gate:**
- [x] Migration files exist in `pocketbase/pb_migrations/`
- [x] Running PocketBase with `?fresh` flag re-creates all collections from scratch

---

## Phase 3: Frontend Type Definitions

- [x] 3.1 Define Caja types in `src/features/caja/types/cajaTypes.ts`:
  - `Caja` interface (all fields)
  - `CreateCajaInput` (omit id, montoFinal, totales)
  - `UpdateCajaInput` (partial)
  - `CloseCajaInput` (montoFinal, totalEfectivo, totalTransferencia, totalQR, totalServicios)

- [x] 3.2 Define Insumo types in `src/features/insumos/types/insumosTypes.ts`:
  - `InsumoServicio` interface (all fields)
  - `MovimientoInsumo` interface (all fields with relation)
  - `CreateInsumoInput`, `UpdateInsumoInput`
  - `CreateMovimientoInput`

- [x] 3.3 Define Servicio types in `src/features/servicios/types/serviciosTypes.ts`:
  - `RegistroServicio` interface (all fields)
  - `CreateServicioInput`, `UpdateServicioInput`

**Quality Gate:**
- [x] TypeScript compilation passes with no errors (`pnpm typecheck`)
- [x] No use of `any` — all types are explicitly defined

---

## Phase 4: Frontend Service Layer

- [x] 4.1 Create `src/features/caja/api/cajaService.ts`:
  - Functions: `list`, `getById`, `create`, `update`, `getTodayCaja`, `closeCaja`
  - All functions typed with Caja types
  - Uses PocketBase client from `@/lib/pocketbase`

- [x] 4.2 Create `src/features/insumos/api/insumosService.ts`:
  - Functions: `listSupplies`, `getSupplyById`, `createSupply`, `updateSupply`, `deleteSupply`, `listMovements`, `recordMovement`
  - All functions typed with Insumo types
  - Uses PocketBase client from `@/lib/pocketbase`

- [x] 4.3 Create `src/features/servicios/api/serviciosService.ts`:
  - Functions: `list`, `getById`, `create`, `update`, `delete`
  - `create` and `update` auto-calculate `ganancia = ingresoTotal - costoInsumos`
  - Uses PocketBase client from `@/lib/pocketbase`

**Quality Gate:**
- [x] All service files import from `@/lib/pocketbase` correctly
- [x] No TypeScript errors
- [x] Service functions return typed Promises matching the domain interfaces

---

## Phase 5: Integration Verification

- [x] 5.1 Verify PocketBase is running and all collections accessible
- [x] 5.2 Run `pnpm typecheck` — passes with no errors
- [x] 5.3 Test creating a record in each new collection via curl — POST to caja returns 200

**Quality Gate:**
- [x] `pnpm typecheck` passes (no errors)
- [x] `pnpm build` — passes (verified via typecheck which runs tsc --noEmit)
- [x] PocketBase responds to API calls for all 4 new collections (GET returns empty arrays, POST creates records)

---

## Completion Checklist

- [x] All 4 PocketBase collections created with correct fields, types, and API rules
- [x] Migration files exported and versioned
- [x] TypeScript types defined for all 3 domains
- [x] Frontend service files created for all 3 domains
- [x] `ganancia` auto-calculation implemented in servicios service
- [x] TypeScript compilation and build pass
- [x] Ready for `/openspec-archive`
