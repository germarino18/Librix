## 1. Backend — Schemas

- [x] 1.1 Update `CajaCierre` schema to only accept `observacion` (remove monto_final, total_efectivo, total_transferencia, total_qr, total_servicios from input)
- [x] 1.2 Add `CajaHistorialResponse` schema with `total: int` and `items: list[CajaResponse]`

## 2. Backend — Repository

- [x] 2.1 Implement `CajaRepository` class with `__init__(session)`
- [x] 2.2 Implement `get_abierta_hoy()` — query Caja where fecha=today AND estado=ABIERTA
- [x] 2.3 Implement `get_by_fecha(fecha)` — query Caja by date
- [x] 2.4 Implement `get_by_id(id)` — get Caja by primary key
- [x] 2.5 Implement `create(data)` — insert new Caja record
- [x] 2.6 Implement `update(id, data)` — update Caja fields
- [x] 2.7 Implement `list_historial(skip, limit)` — list cerradas ordered by fecha desc with count

## 3. Backend — Service

- [x] 3.1 Implement `CajaService` class with `__init__(session)`
- [x] 3.2 Implement `abrir(monto_inicial, observacion)` — validate no open caja today (RN-06), create Caja
- [x] 3.3 Implement `cerrar(observacion)` — find open caja, query ventas COMPLETADAS today by metodo_pago, query servicios today ganancia, calculate monto_final, update caja
- [x] 3.4 Implement `get_actual()` — return caja for today or None
- [x] 3.5 Implement `get_by_id(id)` — return caja by id
- [x] 3.6 Implement `list_historial(skip, limit)` — return paginated closed cajas

## 4. Backend — Router

- [x] 4.1 Implement `POST /api/caja/abrir` endpoint
- [x] 4.2 Implement `POST /api/caja/cerrar` endpoint
- [x] 4.3 Implement `GET /api/caja/actual` endpoint
- [x] 4.4 Implement `GET /api/caja/historial` endpoint with skip/limit query params
- [x] 4.5 Implement `GET /api/caja/{id}` endpoint

## 5. Backend — Register Router

- [x] 5.1 Import and register caja router in `backend/app/main.py`

## 6. Frontend — Types

- [x] 6.1 Create `frontend/src/features/caja/types/cajaTypes.ts` with Caja, CajaHistorial, AbrirCajaInput, CerrarCajaInput types

## 7. Frontend — API Service

- [x] 7.1 Create `frontend/src/features/caja/api/cajaService.ts` with getActual, abrirCaja, cerrarCaja, getHistorial, getCajaById functions

## 8. Frontend — Hooks

- [x] 8.1 Create `frontend/src/features/caja/hooks/useCaja.ts` with useCajaActual, useAbrirCaja, useCerrarCaja, useHistorialCaja hooks using TanStack Query

## 9. Frontend — Components

- [x] 9.1 Create `CajaAbierta.tsx` — shows open caja summary with totals and "Cerrar caja" button
- [x] 9.2 Create `CajaCerrada.tsx` — shows closed caja state (after closing)
- [x] 9.3 Create `AbrirCajaDialog.tsx` — modal with monto_inicial input
- [x] 9.4 Create `CerrarCajaDialog.tsx` — modal showing calculated totals + observacion field + confirm button
- [x] 9.5 Create `HistorialCaja.tsx` — table of previous closes with pagination
- [x] 9.6 Create `CajaResumen.tsx` — card showing totals breakdown (efectivo, transferencia, QR, servicios)

## 10. Frontend — Page

- [x] 10.1 Rewrite `CajaPage.tsx` with state-aware UI: no caja → open button, caja abierta → summary + close, historial tab
- [x] 10.2 Update `frontend/src/features/caja/index.ts` to export all components and hooks

## 11. Verification

- [x] 11.1 Test backend endpoints manually: abrir → verificar caja creada → cerrar → verificar totales
- [x] 11.2 Test frontend flow: open caja → see summary → close caja → see history
- [x] 11.3 Verify RN-06: try to open second caja on same day → should get 409
- [x] 11.4 Verify RN-10: cancelled sales excluded from totals
