## Context

Librix has existing InsumoServicio and MovimientoInsumo tables created by C-02 migrations, but no code layer to manage them. The backend uses FastAPI + SQLAlchemy async with feature-based structure under `backend/app/features/`. The frontend uses React + Vite + TypeScript with shadcn/ui and feature-based colocation under `frontend/src/features/`.

## Goals / Non-Goals

**Goals:**
- Full CRUD for InsumoServicio (list, get, create, update, delete)
- MovimientoInsumo creation (ingreso/consumo) with atomic stockActual update
- Low-stock alert (stockActual < stockMinimo) in list responses and UI
- Spanish UI for all labels and messages

**Non-Goals:**
- F-18 (cost accumulation per service) — deferred to services épica
- F-19 (page estimation per cartridge) — deferred
- Servicios module integration (RN-09 will consume this data later)

## Decisions

1. **Service-layer atomic stock update**: The service layer handles both creating a MovimientoInsumo and updating InsumoServicio.stockActual in a single database transaction, ensuring consistency.

2. **Inline movimientos (no separate page)**: MovimientoInsumo is managed via an expandable section or modal within the insumos list page, not as a standalone page. This avoids premature navigation complexity.

3. **Stock alert via computed field**: The list endpoint includes a `stockBajo: bool` computed field — the frontend never computes this, ensuring consistency regardless of frontend implementation.

4. **Soft-delete not needed for insumos**: Since this is a small shop, hard delete is acceptable for insumos. MovimientoInsumos referencing a deleted insumo can remain with a nulled FK or use ON DELETE SET NULL at the DB level (handled by existing migration).

5. **paginacion no necesaria**: Given the expected small number of insumos (< 50), no pagination is needed — the list returns all records.

## Risks / Trade-offs

- [Hard delete vs soft delete] Hard delete means deleted insumo movimientos lose FK reference. Mitigation: Movement list endpoint left-joins and shows "[eliminado]" if FK is null.
- [No pagination] If insumos grow beyond 100 in the future, list response may be slow. Mitigation: acceptable for MVP scope.
