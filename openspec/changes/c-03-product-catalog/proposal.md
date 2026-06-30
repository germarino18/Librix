## Why

Actualmente los modelos y schemas de Producto y Categoria están definidos en el backend (C-02), pero el service, repository y router están vacíos. En el frontend, los API calls usan PocketBase SDK en lugar del cliente HTTP genérico existente (`src/lib/api.ts`). Esto impide que la página `/productos` funcione contra la API real de FastAPI.

## What Changes

- **Backend**: Implementar service, repository y router para Categoria y Producto con CRUD completo, filtros (por categoría, búsqueda por nombre), paginación y baja lógica
- **Frontend**: Refactorizar `src/features/productos/api/` para usar `api.ts` (fetch contra FastAPI) en lugar de PocketBase SDK
- **Frontend**: Alinear tipos (`productosTypes.ts`) con los schemas de respuesta de FastAPI (snake_case → camelCase)
- **Frontend**: Agregar endpoint de eliminación (DELETE) de categorías en el API service

## Capabilities

### New Capabilities
- `category-crud`: CRUD de categorías con validación de integridad referencial (no eliminar si tiene productos asociados)
- `product-crud`: CRUD de productos con filtros, paginación, búsqueda por nombre y baja lógica
- `product-catalog-api-refactor`: Refactor del frontend para consumir la API FastAPI en lugar de PocketBase

### Modified Capabilities
- *(ninguna — no cambian requirements de specs existentes)*

## Impact

- **Backend**: `backend/app/features/productos/` — service.py, repository.py, router.py (implementar lógica); schemas.py (agregar `CategoriaUpdate` si falta)
- **Frontend**: `frontend/src/features/productos/api/` — refactor completo; `frontend/src/features/productos/types/productosTypes.ts` — alinear campos; `frontend/src/features/productos/hooks/` — sin cambios (TanStack Query se mantiene)
- **No afecta** otras features ni el routing de la app
