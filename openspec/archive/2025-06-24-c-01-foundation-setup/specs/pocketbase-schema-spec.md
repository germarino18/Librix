## ADDED Requirements

### Requirement: PocketBase standalone binary
The system SHALL use PocketBase as a standalone binary (`pocketbase.exe`) running locally. The binary SHALL NOT be versioned in the repository — only the schema/configuration files.

#### Scenario: PocketBase starts with serve command
- **WHEN** running `pocketbase serve` in the `pocketbase/` directory
- **THEN** PocketBase API is available at `http://localhost:8090`

### Requirement: Categoria collection
The system SHALL have a `categoria` collection with fields: `id` (auto), `nombre` (text, required, unique).

#### Scenario: Categoria collection exists in PocketBase
- **WHEN** querying the PocketBase API at `/api/collections/categoria/records`
- **THEN** it returns records with `id` and `nombre` fields

### Requirement: Producto collection
The system SHALL have a `producto` collection with fields: `id` (auto), `nombre` (text, required), `precioCompra` (number), `precioVenta` (number), `stockActual` (number), `stockMinimo` (number), `unidad` (text), `activo` (bool, default true), `categoria_id` (relation to categoria).

#### Scenario: Producto collection exists in PocketBase
- **WHEN** querying the PocketBase API at `/api/collections/producto/records`
- **THEN** it returns records with all defined fields and expandable `categoria_id`

### Requirement: Venta collection
The system SHALL have a `venta` collection with fields: `id` (auto), `fechaHora` (autodate), `total` (number), `metodoPago` (select: efectivo, transferencia, qr_mercadopago), `estado` (select: completada, cancelada), `observacion` (text, optional).

#### Scenario: Venta collection exists in PocketBase
- **WHEN** querying the PocketBase API at `/api/collections/venta/records`
- **THEN** it returns records with all defined fields

### Requirement: DetalleVenta collection
The system SHALL have a `detalleVenta` collection with fields: `id` (auto), `venta_id` (relation to venta), `producto_id` (relation to producto), `cantidad` (number), `precioUnitario` (number), `subtotal` (number).

#### Scenario: DetalleVenta collection exists in PocketBase
- **WHEN** querying the PocketBase API at `/api/collections/detalleVenta/records`
- **THEN** it returns records with all defined fields

### Requirement: MovimientoStock collection
The system SHALL have a `movimientoStock` collection with fields: `id` (auto), `producto_id` (relation to producto), `tipo` (select: ingreso, venta, ajuste), `cantidad` (number), `fechaHora` (autodate), `observacion` (text, optional).

#### Scenario: MovimientoStock collection exists in PocketBase
- **WHEN** querying the PocketBase API at `/api/collections/movimientoStock/records`
- **THEN** it returns records with all defined fields

### Requirement: API rules set to public for MVP
All collections SHALL have their API rules configured to allow public read/write access (no auth required), since the MVP does not have user authentication. This is acceptable only because PocketBase runs in the local network only.

#### Scenario: API allows anonymous writes
- **WHEN** sending a POST request to any collection endpoint without authentication
- **THEN** the request is accepted and the record is created

### Requirement: PocketBase schema is versionable
The collection schemas SHALL be exported to `pocketbase/pb_migrations/` as JSON migration files so they can be versioned in git and reproduced on fresh installations.

#### Scenario: Migration files exist for all collections
- **WHEN** running PocketBase with migrations enabled
- **THEN** all required collections are automatically created if they don't exist
