## ADDED Requirements

### Requirement: Listar productos con paginación

El sistema SHALL listar productos con paginación offset-based.

#### Scenario: Listado exitoso
- **WHEN** se envía GET /api/productos
- **THEN** se retorna un objeto con `items` (array de ProductoResponse), `total`, `page`, `per_page`, `total_pages` con HTTP 200

#### Scenario: Listado sin productos
- **WHEN** no existen productos
- **THEN** se retorna `items` vacío, `total: 0` con HTTP 200

#### Scenario: Paginación con page y per_page
- **WHEN** se envía GET /api/productos?page=2&per_page=10
- **THEN** se retorna la página 2 con 10 items por página

### Requirement: Filtrar productos por categoría

El sistema SHALL filtrar productos por categoría mediante query param.

#### Scenario: Filtro por categoría
- **WHEN** se envía GET /api/productos?categoria_id={id}
- **THEN** se retornan solo los productos de esa categoría

### Requirement: Buscar productos por nombre

El sistema SHALL buscar productos por nombre mediante búsqueda parcial (ILIKE).

#### Scenario: Búsqueda por nombre
- **WHEN** se envía GET /api/productos?search=libro
- **THEN** se retornan productos cuyo nombre contenga "libro" (case-insensitive)

### Requirement: Excluir productos inactivos por defecto

El sistema SHALL excluir productos con `activo=false` del listado por defecto (RN-03).

#### Scenario: Listado solo activos
- **WHEN** se envía GET /api/productos
- **THEN** solo se retornan productos con `activo=true`

#### Scenario: Incluir inactivos explícitamente
- **WHEN** se envía GET /api/productos?include_inactivos=true
- **THEN** se retornan todos los productos incluyendo inactivos

### Requirement: Incluir datos de categoría en respuesta

El sistema SHALL incluir el nombre de la categoría en la respuesta de productos.

#### Scenario: Producto con categoría
- **WHEN** se envía GET /api/productos
- **THEN** cada item incluye `categoria_nombre` con el nombre de la categoría

#### Scenario: Producto sin categoría
- **WHEN** se envía GET /api/productos
- **THEN** los items sin categoría tienen `categoria_nombre: null`

### Requirement: Obtener producto por ID

El sistema SHALL retornar un producto por su ID.

#### Scenario: Producto existe
- **WHEN** se envía GET /api/productos/{id}
- **THEN** se retorna un objeto ProductoResponse con HTTP 200

#### Scenario: Producto no existe
- **WHEN** se envía GET /api/productos/{id} con ID inexistente
- **THEN** se retorna HTTP 404 con mensaje de error

### Requirement: Crear producto

El sistema SHALL crear un producto con los campos requeridos.

#### Scenario: Creación exitosa
- **WHEN** se envía POST /api/productos con datos válidos
- **THEN** se retorna un objeto ProductoResponse con HTTP 201

#### Scenario: Nombre vacío
- **WHEN** se envía POST /api/productos con nombre vacío
- **THEN** se retorna HTTP 422 con error de validación

#### Scenario: Categoría inexistente
- **WHEN** se envía POST /api/productos con categoria_id inexistente
- **THEN** se retorna HTTP 404 con mensaje de error

### Requirement: Actualizar producto

El sistema SHALL actualizar parcialmente un producto.

#### Scenario: Actualización exitosa
- **WHEN** se envía PUT /api/productos/{id} con campos a actualizar
- **THEN** se retorna el ProductoResponse actualizado con HTTP 200

#### Scenario: Actualizar a categoría inexistente
- **WHEN** se envía PUT /api/productos/{id} con categoria_id inexistente
- **THEN** se retorna HTTP 404 con mensaje de error

### Requirement: Baja lógica de producto

El sistema SHALL permitir desactivar un producto sin eliminarlo (baja lógica).

#### Scenario: Desactivar producto
- **WHEN** se envía PATCH /api/productos/{id}/toggle-activo
- **THEN** se invierte el valor de `activo` y se retorna el producto actualizado con HTTP 200

#### Scenario: Producto inexistente
- **WHEN** se envía PATCH /api/productos/{id}/toggle-activo con ID inexistente
- **THEN** se retorna HTTP 404

### Requirement: Alerta visual de stock bajo (RN-02)

El sistema SHALL retornar indicación de stock bajo en el listado.

#### Scenario: Stock bajo en respuesta
- **WHEN** se envía GET /api/productos
- **THEN** cada item incluye `stock_bajo: true` si stockActual < stockMinimo
