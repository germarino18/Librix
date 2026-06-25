# Proposal: Schema Definition — Full Data Model

**Change ID:** `c-02-schema-definition`
**Created:** 2026-06-24
**Status:** Completed
**Governance Level:** CRITICAL (database schema changes)

---

## Why

C-01 already created the first 5 PocketBase collections (Categoria, Producto, Venta, DetalleVenta, MovimientoStock). To support cash register operations, supplies management, and service logging (coming in C-05/C-06/C-07), we need the remaining 4 collections: Caja, InsumoServicio, MovimientoInsumo, and RegistroServicio. Without these, downstream changes are blocked — C-02 is the critical dependency for GATE 2 of the roadmap.

## What Changes

- **Add Caja collection** — daily cash register (apertura/cierre, totals by payment method)
- **Add InsumoServicio collection** — supplies inventory for services (paper, toner, etc.)
- **Add MovimientoInsumo collection** — supply movements (ingreso/consumo)
- **Add RegistroServicio collection** — end-of-day service logging with auto-calculated profit
- **Create frontend service files** for each new domain (caja, insumos, servicios)
- Configure all new collections with **public CRUD API rules** (consistent with existing C-01 collections)
- **No UI changes** — this is schema definition only. UIs come in C-05, C-06, C-07.

## Capabilities

### New Capabilities

- `caja-schema`: Caja collection definition (fields, relations, API rules) + frontend service layer
- `insumo-servicio-schema`: InsumoServicio + MovimientoInsumo collections + frontend service
- `registro-servicio-schema`: RegistroServicio collection (fields, types, auto-calculated ganancia) + frontend service

### Modified Capabilities

_(None — no existing specs have requirement changes)_

## Impact

| Component | Change Required | Details |
|-----------|-----------------|---------|
| Database | Yes | 4 new PocketBase collections |
| API | Yes | New API endpoints: `/api/collections/caja`, `/api/collections/insumoServicio`, `/api/collections/movimientoInsumo`, `/api/collections/registroServicio` |
| Frontend Services | Yes | 3 new service files under `src/features/*/api/` |
| State | No | No state management changes (not yet needed) |
| UI | No | Out of scope — UI handled by C-05, C-06, C-07 |
| Dependencies | No | No new npm packages needed. PocketBase handles relations natively. |

## Success Criteria

- [x] All 4 new collections exist in PocketBase with correct fields, types, and relations
- [x] Caja collection has select options: estado (abierta/cerrada)
- [x] InsumoServicio collection has `paginasPorUnidad` as nullable number (only for toner)
- [x] MovimientoInsumo has relation to InsumoServicio with select tipo (ingreso/consumo)
- [x] RegistroServicio has select tipo (fotocopia/plastificado/souvenir/otro) and auto-calculated ganancia
- [x] All collections have public CRUD API rules (no auth required)
- [x] Frontend service files exist and connect to the correct API endpoints
- [x] Migration files exported to `pocketbase/pb_migrations/` for versioning

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Schema changes break existing C-01 data | Low | High | C-02 does NOT modify existing collections — only adds new ones. C-01 data is untouched. |
| Field type mismatch between KB and implementation | Medium | Medium | KB `04_modelo_de_datos.md` is the source of truth; all fields verified against it before creating. |
| Missing `ganancia` auto-calculation | Medium | Medium | `ganancia` is stored as plain number in PocketBase (no formula support). Frontend/service layer must calculate it on write. |

---

## Archive Information

**Archived:** 2026-06-25 11:09
**Duration:** 1 day (2026-06-24 → 2026-06-25)
**Outcome:** Successfully implemented

### Files Modified
- `pocketbase/pb_migrations/` — Migration files for all 4 collections (caja, insumoServicio, movimientoInsumo, registroServicio)
- `src/features/caja/types/cajaTypes.ts` — Caja TypeScript interfaces
- `src/features/caja/api/cajaService.ts` — Caja frontend service layer
- `src/features/insumos/types/insumosTypes.ts` — Insumo TypeScript interfaces
- `src/features/insumos/api/insumosService.ts` — Insumo frontend service layer
- `src/features/servicios/types/serviciosTypes.ts` — Servicio TypeScript interfaces
- `src/features/servicios/api/serviciosService.ts` — Servicio frontend service layer (with ganancia auto-calculation)

### Specs Canonized
- `openspec/specs/caja-schema/spec.md` — Caja collection + service spec
- `openspec/specs/insumo-servicio-schema/spec.md` — InsumoServicio + MovimientoInsumo + service spec
- `openspec/specs/registro-servicio-schema/spec.md` — RegistroServicio + service spec
