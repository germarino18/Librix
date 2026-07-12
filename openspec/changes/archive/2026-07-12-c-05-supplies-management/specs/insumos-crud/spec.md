## ADDED Requirements

### Requirement: List all insumos

The system SHALL return all InsumoServicio records as a JSON array, including the computed `stockBajo` field.

#### Scenario: Empty list
- **WHEN** a GET request is sent to `/api/insumos`
- **THEN** the response SHALL be an empty array `[]` with HTTP 200

#### Scenario: Returns all insumos with stockBajo
- **WHEN** a GET request is sent to `/api/insumos`
- **THEN** the response SHALL include all insumos with fields: `id`, `nombre`, `stockActual`, `unidad`, `costoUnitario`, `stockMinimo`, `paginasPorUnidad`, `stockBajo`, `createdAt`, `updatedAt`

### Requirement: Get insumo by ID

The system SHALL return a single InsumoServicio by its UUID.

#### Scenario: Existing insumo
- **WHEN** a GET request is sent to `/api/insumos/{id}`
- **THEN** the response SHALL have HTTP 200 with the insumo object

#### Scenario: Non-existent insumo
- **WHEN** a GET request is sent to `/api/insumos/00000000-0000-0000-0000-000000000000`
- **THEN** the response SHALL have HTTP 404

### Requirement: Create insumo

The system SHALL create a new InsumoServicio with the provided data.

#### Scenario: Valid creation
- **WHEN** a POST request is sent to `/api/insumos` with `{ nombre, unidad, costoUnitario, stockMinimo, paginasPorUnidad? }`
- **THEN** the response SHALL have HTTP 201 with the created insumo object including a generated UUID and stockActual=`0`

#### Scenario: Missing required fields
- **WHEN** a POST request is sent to `/api/insumos` without `nombre`
- **THEN** the response SHALL have HTTP 422 with validation error details

### Requirement: Update insumo

The system SHALL update an existing InsumoServicio.

#### Scenario: Valid update
- **WHEN** a PUT request is sent to `/api/insumos/{id}` with updated fields
- **THEN** the response SHALL have HTTP 200 with the updated insumo object

#### Scenario: Update non-existent insumo
- **WHEN** a PUT request is sent to `/api/insumos/00000000-0000-0000-0000-000000000000`
- **THEN** the response SHALL have HTTP 404

### Requirement: Delete insumo

The system SHALL delete an InsumoServicio by UUID.

#### Scenario: Delete existing insumo
- **WHEN** a DELETE request is sent to `/api/insumos/{id}`
- **THEN** the response SHALL have HTTP 204 with no content

#### Scenario: Delete non-existent insumo
- **WHEN** a DELETE request is sent to `/api/insumos/00000000-0000-0000-0000-000000000000`
- **THEN** the response SHALL have HTTP 404
