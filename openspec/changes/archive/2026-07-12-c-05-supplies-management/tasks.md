## 1. Backend — InsumoServicio CRUD

- [x] 1.1 Create `backend/app/features/insumos/models.py` with InsumoServicio SQLAlchemy model (if not already present in shared models)
- [x] 1.2 Create `backend/app/features/insumos/schemas.py` with Pydantic schemas: InsumoCreate, InsumoUpdate, InsumoResponse (with stockBajo computed field)
- [x] 1.3 Create `backend/app/features/insumos/repository.py` with async CRUD methods for InsumoServicio
- [x] 1.4 Create `backend/app/features/insumos/service.py` with business logic (stockBajo computation)
- [x] 1.5 Create `backend/app/features/insumos/router.py` with CRUD endpoints (GET list, GET by id, POST, PUT, DELETE)
- [x] 1.6 Mount `router.py` in `backend/app/main.py` under prefix `/api/insumos`

## 2. Backend — MovimientoInsumo

- [x] 2.1 Create `backend/app/features/insumos/models.py` with MovimientoInsumo SQLAlchemy model (if not already in shared models)
- [x] 2.2 Add MovimientoCreate, MovimientoResponse schemas to schemas.py
- [x] 2.3 Add movimiento repository methods to repository.py (create, list_by_insumo)
- [x] 2.4 Add movimiento service methods to service.py (create_movimiento with atomic stockActual update in transaction, list_movimientos)
- [x] 2.5 Add movimiento endpoints to router.py (POST `/api/insumos/{id}/movimientos`, GET `/api/insumos/{id}/movimientos`)

## 3. Frontend — Types and API Client

- [x] 3.1 Create `frontend/src/features/insumos/types/insumo.ts` with Insumo and MovimientoInsumo TypeScript interfaces
- [x] 3.2 Create `frontend/src/features/insumos/api/insumos.ts` with API functions (getAll, getById, create, update, delete) using the shared api client
- [x] 3.3 Create `frontend/src/features/insumos/api/movimientos.ts` with API functions (createMovimiento, getMovimientos)

## 4. Frontend — TanStack Query Hooks

- [x] 4.1 Create `frontend/src/features/insumos/hooks/useInsumos.ts` with useQuery for list and useMutation for create/update/delete
- [x] 4.2 Create `frontend/src/features/insumos/hooks/useMovimientos.ts` with useQuery for list and useMutation for create

## 5. Frontend — Components

- [x] 5.1 Create `frontend/src/features/insumos/components/InsumosTable.tsx` with table listing all insumos, low-stock badge, and action buttons
- [x] 5.2 Create `frontend/src/features/insumos/components/InsumoForm.tsx` with React Hook Form + Zod modal/form for create/edit
- [x] 5.3 Create `frontend/src/features/insumos/components/DeleteInsumoDialog.tsx` with confirmation dialog for delete
- [x] 5.4 Create `frontend/src/features/insumos/components/MovimientoForm.tsx` with modal/form for ingreso/consumo
- [x] 5.5 Create `frontend/src/features/insumos/components/MovimientosList.tsx` with expandable table of movements per insumo

## 6. Frontend — Page and Routing

- [x] 6.1 Create `frontend/src/features/insumos/pages/InsumosPage.tsx` composing all components
- [x] 6.2 Add `/insumos` route in the frontend router (e.g., App.tsx or router config)
- [x] 6.3 Add "Insumos" navigation link in the sidebar or main navigation
