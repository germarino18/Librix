## 1. Backend — CRUD de Categorías

- [x] 1.1 Implementar `CategoriaRepository` con métodos list (ordenado por nombre), get_by_id, create, update, delete
- [x] 1.2 Implementar `CategoriaService` con validación de nombre único y verificación de integridad referencial en delete
- [x] 1.3 Implementar `CategoriaRouter` con endpoints GET /api/categorias, GET /api/categorias/{id}, POST /api/categorias, PUT /api/categorias/{id}, DELETE /api/categorias/{id}
- [x] 1.4 Agregar schema `CategoriaUpdate` en schemas.py (opcional para PUT)
- [x] 1.5 Montar router de categorías en main.py

## 2. Backend — CRUD de Productos

- [x] 2.1 Implementar `ProductoRepository` con métodos list (paginado, filtros, búsqueda), get_by_id, create, update, toggle_activo
- [x] 2.2 Implementar `ProductoService` con lógica de negocio (excluir inactivos por defecto, incluir categoria_nombre, validar categoria_id existente)
- [x] 2.3 Implementar `ProductoRouter` con endpoints GET /api/productos, GET /api/productos/{id}, POST /api/productos, PUT /api/productos/{id}, PATCH /api/productos/{id}/toggle-activo
- [x] 2.4 Agregar schema `ProductoListResponse` con paginación y `ProductoResponse.categoria_nombre`

## 3. Frontend — Refactor API Services

- [x] 3.1 Refactorizar `productosService.ts`: reemplazar PocketBase SDK por api.get/post/put con mapeo snake_case → camelCase
- [x] 3.2 Refactorizar `categoriasService.ts`: reemplazar PocketBase SDK por api.get/post/put/delete con mapeo snake_case → camelCase
- [x] 3.3 Agregar método `toggleActivo` en productosService.ts
- [x] 3.4 Eliminar import de `@/lib/pocketbase` de ambos services (mantener archivo pocketbase.ts por si otras features lo usan)

## 4. Frontend — Tipos y Compatibilidad

- [x] 4.1 Actualizar `Producto` type en `productosTypes.ts`: alinear campos con FastAPI (precioCompra, precioVenta, stockActual, stockMinimo, categoria_id, activo, created_at/created, updated_at/updated)
- [x] 4.2 Agregar campo `categoria_nombre` en respuesta y mapear a `expand.categoria_id.nombre` para componentes existentes
- [x] 4.3 Actualizar `ProductoListResponse` para coincidir con formato de paginación del backend (total → totalItems, page, perPage → perPage, totalPages)

## 5. Verificación

- [x] 5.1 Verificar typecheck del backend: `cd backend && python -m mypy app/`
- [x] 5.2 Verificar typecheck del frontend: `cd frontend && npx tsc --noEmit`
- [x] 5.3 Verificar que la página /productos carga y muestra datos correctamente
