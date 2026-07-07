## ADDED Requirements

### Requirement: Product search endpoint

The system SHALL provide a GET /api/productos/buscar endpoint for lightweight inline search during sales.

#### Scenario: Search by partial name
- **WHEN** a GET request is sent to /api/productos/buscar?q=lap
- **THEN** the response SHALL include active products whose name contains "lap" (case-insensitive)
- **THEN** each result SHALL contain id, nombre, precio_venta, stock_actual

#### Scenario: Empty query returns no results
- **WHEN** a GET request is sent to /api/productos/buscar?q=
- **THEN** the response SHALL be an empty array

#### Scenario: No matches returns empty
- **WHEN** a GET request is sent to /api/productos/buscar?q=zzzxyz_notfound
- **THEN** the response SHALL be an empty array

#### Scenario: Excludes inactive products
- **WHEN** a product has activo=false
- **THEN** it SHALL NOT appear in search results (RN-03)

#### Scenario: Excludes out-of-stock products
- **WHEN** a product has stock_actual <= 0
- **THEN** it SHALL NOT appear in search results

### Requirement: Paginated products list

The existing GET /api/productos endpoint SHALL also support the search parameter for compatibility.

#### Scenario: Search parameter on list endpoint
- **WHEN** a GET request is sent to /api/productos?search=lap
- **THEN** the response SHALL filter by name, case-insensitive, including categoria info and full detail (as per existing behavior)
