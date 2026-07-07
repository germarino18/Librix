## ADDED Requirements

### Requirement: API service de productos usa fetch contra FastAPI

El sistema SHALL usar el cliente HTTP genérico (`api.ts`) en lugar de PocketBase SDK para todas las operaciones de productos.

#### Scenario: list() usa api.get
- **WHEN** se llama a `productosService.list({ search, categoria, page, perPage })`
- **THEN** se envía GET /api/productos con query params `search`, `categoria_id`, `page`, `per_page`
- **THEN** se retorna la respuesta tipada como ProductoListResponse

#### Scenario: getById() usa api.get
- **WHEN** se llama a `productosService.getById(id)`
- **THEN** se envía GET /api/productos/{id}

#### Scenario: create() usa api.post
- **WHEN** se llama a `productosService.create(data)`
- **THEN** se envía POST /api/productos con el body serializado

#### Scenario: update() usa api.put
- **WHEN** se llama a `productosService.update(id, data)`
- **THEN** se envía PUT /api/productos/{id} con el body serializado

#### Scenario: toggleActivo() usa api.patch
- **WHEN** se llama a `productosService.toggleActivo(id)`
- **THEN** se envía PATCH /api/productos/{id}/toggle-activo

### Requirement: API service de categorías usa fetch contra FastAPI

El sistema SHALL usar el cliente HTTP genérico para todas las operaciones de categorías.

#### Scenario: list() usa api.get
- **WHEN** se llama a `categoriasService.list()`
- **THEN** se envía GET /api/categorias

#### Scenario: getById() usa api.get
- **WHEN** se llama a `categoriasService.getById(id)`
- **THEN** se envía GET /api/categorias/{id}

#### Scenario: create() usa api.post
- **WHEN** se llama a `categoriasService.create(data)`
- **THEN** se envía POST /api/categorias con el body serializado

#### Scenario: update() usa api.put
- **WHEN** se llama a `categoriasService.update(id, data)`
- **THEN** se envía PUT /api/categorias/{id} con el body serializado

#### Scenario: remove() usa api.delete con validación
- **WHEN** se llama a `categoriasService.remove(id)`
- **THEN** se envía DELETE /api/categorias/{id}
- **THEN** si la categoría tiene productos, el backend retorna 409 y el service propaga el error

### Requirement: Tipos alineados con FastAPI (snake_case → camelCase)

El sistema SHALL mapear los campos snake_case de la API FastAPI a camelCase para los componentes existentes.

#### Scenario: ProductoResponse mapea campos
- **WHEN** se recibe `{ "precio_venta": 100, "precio_compra": 50, ... }` del backend
- **THEN** el service transforma a `{ precioVenta: 100, precioCompra: 50, ... }`

#### Scenario: CategoriaResponse mapea campos
- **WHEN** se recibe `{ "nombre": "Libros" }` del backend
- **THEN** el service retorna `{ nombre: "Libros" }`

#### Scenario: Paginación mapea campos
- **WHEN** se recibe `{ "total": 50, "page": 1, "per_page": 20, "total_pages": 3 }`
- **THEN** el service retorna `{ totalItems: 50, page: 1, perPage: 20, totalPages: 3 }`

#### Scenario: Producto incluye categoria_nombre
- **WHEN** se recibe `{ "categoria_nombre": "Libros" }` del backend
- **THEN** el service retorna `{ "expand": { "categoria_id": { "nombre": "Libros" } } }` para compatibilidad con componentes existentes
