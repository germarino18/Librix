## ADDED Requirements

### Requirement: List endpoint includes stockBajo flag

The GET `/api/insumos` endpoint SHALL compute and return a `stockBajo` boolean field for each insumo, where `stockBajo = stockActual < stockMinimo`.

#### Scenario: Stock OK
- **WHEN** an insumo has stockActual=20 and stockMinimo=10
- **THEN** `stockBajo` SHALL be `false`

#### Scenario: Stock below minimum
- **WHEN** an insumo has stockActual=5 and stockMinimo=10
- **THEN** `stockBajo` SHALL be `true`

#### Scenario: Stock equals minimum
- **WHEN** an insumo has stockActual=10 and stockMinimo=10
- **THEN** `stockBajo` SHALL be `false`

### Requirement: Get-by-ID endpoint includes stockBajo

The GET `/api/insumos/{id}` endpoint SHALL also include the `stockBajo` computed field.

#### Scenario: Single insumo with stock bajo
- **WHEN** a GET request is sent to `/api/insumos/{id}` for an insumo where stockActual < stockMinimo
- **THEN** the response SHALL include `stockBajo: true`

### Requirement: Insumos list page shows low-stock badge

The frontend `/insumos` page SHALL display a color-coded badge for each row where stockBajo is true.

#### Scenario: Low stock badge visible
- **WHEN** the insumos list renders and an insumo has `stockBajo: true`
- **THEN** the stockActual cell SHALL show a red/orange badge with the text "Stock bajo" or similar visual indicator

#### Scenario: Normal stock no badge
- **WHEN** the insumos list renders and an insumo has `stockBajo: false`
- **THEN** the stockActual cell SHALL show only the number without a badge
