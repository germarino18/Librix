## ADDED Requirements

### Requirement: Create ingreso de insumo

The system SHALL create a MovimientoInsumo with tipo="ingreso" and atomically increase InsumoServicio.stockActual by the specified cantidad in a single database transaction.

#### Scenario: Successful ingreso
- **WHEN** a POST request is sent to `/api/insumos/{id}/movimientos` with `{ tipo: "ingreso", cantidad: 10, observacion? }`
- **THEN** the response SHALL have HTTP 201 with the created MovimientoInsumo object AND the referenced insumo's stockActual SHALL be increased by 10

#### Scenario: Ingreso with zero cantidad
- **WHEN** a POST request is sent with `cantidad: 0`
- **THEN** the response SHALL have HTTP 422 with validation error

#### Scenario: Ingreso for non-existent insumo
- **WHEN** a POST request is sent to `/api/insumos/00000000-0000-0000-0000-000000000000/movimientos`
- **THEN** the response SHALL have HTTP 404

### Requirement: Create consumo de insumo

The system SHALL create a MovimientoInsumo with tipo="consumo" and atomically decrease InsumoServicio.stockActual by the specified cantidad.

#### Scenario: Successful consumo
- **WHEN** a POST request is sent to `/api/insumos/{id}/movimientos` with `{ tipo: "consumo", cantidad: 5, observacion? }`
- **THEN** the response SHALL have HTTP 201 with the created MovimientoInsumo AND the referenced insumo's stockActual SHALL be decreased by 5

#### Scenario: Consumo exceeds available stock
- **WHEN** a POST request is sent with `tipo: "consumo"` and `cantidad` greater than current stockActual
- **THEN** the response SHALL have HTTP 400 with an error message indicating insufficient stock

### Requirement: List movimientos for an insumo

The system SHALL return all MovimientoInsumo records for a given InsumoServicio, ordered by fechaHora descending.

#### Scenario: List with records
- **WHEN** a GET request is sent to `/api/insumos/{id}/movimientos`
- **THEN** the response SHALL be a JSON array of MovimientoInsumo objects with fields: `id`, `tipo`, `cantidad`, `fechaHora`, `observacion`

#### Scenario: List with no records
- **WHEN** a GET request is sent to `/api/insumos/{id}/movimientos` for an insumo with no movements
- **THEN** the response SHALL be an empty array `[]` with HTTP 200

#### Scenario: List for non-existent insumo
- **WHEN** a GET request is sent to `/api/insumos/00000000-0000-0000-0000-000000000000/movimientos`
- **THEN** the response SHALL have HTTP 404
