## Context

El backend de Librix tiene modelos SQLAlchemy y schemas Pydantic para Categoria y Producto definidos (C-02), pero el service, repository y router están vacíos. El frontend tiene la página `/productos` completa con componentes, hooks (TanStack Query) y formularios (React Hook Form + Zod), pero los API services usan PocketBase SDK en lugar del cliente HTTP genérico `src/lib/api.ts`. Los tipos del frontend usan camelCase (PocketBase style) mientras que los schemas del backend usan snake_case.

## Goals / Non-Goals

**Goals:**
- Implementar CRUD completo de categorías en backend (router + service + repository)
- Implementar CRUD completo de productos en backend (router + service + repository) con filtros, paginación y baja lógica
- Refactorizar los API services del frontend para usar `fetch` contra FastAPI en lugar de PocketBase SDK
- Alinear tipos del frontend con los schemas de respuesta de FastAPI
- La página `/productos` debe funcionar end-to-end contra la API FastAPI real

**Non-Goals:**
- No se modifican hooks de TanStack Query (solo los services subyacentes)
- No se modifican componentes UI ni formularios
- No se implementa historial de movimientos de stock (C-09)
- No se agrega autenticación ni autorización

## Decisions

### 1. Ubicación de categorías: feature `productos`

Categoria se implementa dentro de `backend/app/features/productos/` en lugar de crear un feature separado `categorias`. Esto sigue la relación natural del dominio (una categoría no existe sin productos) y evita duplicación de imports.

### 2. Patrón Repository → Service → Router

Se mantiene la arquitectura existente de C-02:
- **Repository**: consultas SQLAlchemy puras (select, insert, update, delete)
- **Service**: lógica de negocio (validación de integridad referencial, baja lógica)
- **Router**: definición de endpoints FastAPI con dependencia `get_db`

### 3. Paginación: offset-based con query params

Se usa `page` y `per_page` (offset-based) para consistencia con el frontend existente que ya maneja `ProductoListParams { page, perPage }`.

### 4. Baja lógica con campo `activo`

Producto usa `activo: bool` para baja lógica (RN-03). El endpoint GET /api/productos excluye productos con `activo=false` por defecto, con opción `includeInactivos=true` para el dashboard.

### 5. CamelCase en frontend ↔ snake_case en backend

El cliente API (`api.ts`) no hace transformación automática. Los services del frontend mapean explícitamente los campos de snake_case (respuesta del backend) a camelCase (uso en componentes). Esto mantiene el frontend independiente de la convención del backend.

### 6. DELETE para categorías con validación

El endpoint DELETE /api/categorias/{id} valida que no existan productos asociados (código 409 Conflict si los hay). Esto replica la lógica existente en el frontend PocketBase.

### 7. Endpoint PATCH para toggle activo

Se agrega un endpoint `PATCH /api/productos/{id}/toggle-activo` para cambiar el estado sin enviar el payload completo del producto.

## Risks / Trade-offs

- **Riesgo**: El mapeo explícito camelCase ↔ snake_case en services puede omitir campos si cambian los schemas del backend
  → **Mitigación**: Uso de tipos compartidos con validación en tiempo de compilación (TypeScript)
- **Riesgo**: Eliminación de categoría con productos asociados genera error 409
  → **Mitigación**: El frontend ya maneja este error (CategoryDialog.tsx muestra toast de error)
- **Riesgo**: Campos `precioCompra`/`precioVenta` como `number` en frontend vs `Decimal` en backend pueden perder precisión
  → **Mitigación**: Se redondea a 2 decimales en la transformación; el backend acepta la conversión automática de FastAPI
