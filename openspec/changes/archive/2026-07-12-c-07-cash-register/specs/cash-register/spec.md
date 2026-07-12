## ADDED Requirements

### Requirement: Open daily cash register

The system SHALL allow opening a new cash register for the current day with an initial amount.

#### Scenario: Successful opening
- **WHEN** `POST /api/caja/abrir` is called with `{ "monto_inicial": 5000 }`
- **THEN** the system SHALL create a new Caja record with `fecha` = today, `estado` = "abierta", `monto_inicial` = 5000, and all totals = 0
- **AND** the response SHALL be the created Caja with HTTP 201

#### Scenario: Reject opening when one is already open
- **WHEN** `POST /api/caja/abrir` is called and a Caja with `estado` = "abierta" exists for today
- **THEN** the system SHALL return HTTP 409 with detail "Ya existe una caja abierta para el día de hoy"

#### Scenario: Optional observation on opening
- **WHEN** `POST /api/caja/abrir` is called with `{ "monto_inicial": 5000, "observacion": "Inicio del día" }`
- **THEN** the created Caja SHALL have `observacion` = "Inicio del día"

### Requirement: Close daily cash register

The system SHALL close the open cash register for today, calculating totals automatically from completed sales and services.

#### Scenario: Successful closing with calculated totals
- **WHEN** `POST /api/caja/cerrar` is called with `{ "observacion": "Cierre normal" }`
- **AND** there is an open Caja for today
- **AND** there are completed sales today: 2 with metodo_pago="efectivo" (total 3000), 1 with metodo_pago="transferencia" (total 1500), 1 with metodo_pago="qr_mercadopago" (total 800)
- **AND** there are 3 services today with ganancia: 200, 150, 100
- **THEN** the Caja SHALL be updated with:
  - `estado` = "cerrada"
  - `total_efectivo` = 3000
  - `total_transferencia` = 1500
  - `total_qr` = 800
  - `total_servicios` = 450
  - `monto_final` = `monto_inicial` + 3000 + 1500 + 800 + 450
  - `observacion` = "Cierre normal"
- **AND** the response SHALL be the updated Caja with HTTP 200

#### Scenario: Cancelled sales excluded from totals
- **WHEN** `POST /api/caja/cerrar` is called
- **AND** there is a sale with `estado` = "cancelada" today
- **THEN** that sale's total SHALL NOT be included in any payment method total

#### Scenario: Reject closing when no open register
- **WHEN** `POST /api/caja/cerrar` is called and no Caja with `estado` = "abierta" exists for today
- **THEN** the system SHALL return HTTP 404 with detail "No hay caja abierta para el día de hoy"

### Requirement: Get current day cash register

The system SHALL return the cash register for today if it exists.

#### Scenario: Open register exists
- **WHEN** `GET /api/caja/actual` is called and a Caja exists for today
- **THEN** the system SHALL return the Caja with HTTP 200

#### Scenario: No register for today
- **WHEN** `GET /api/caja/actual` is called and no Caja exists for today
- **THEN** the system SHALL return HTTP 404 with detail "No hay caja para el día de hoy"

### Requirement: Cash register history with pagination

The system SHALL list closed cash registers with pagination, ordered by date descending.

#### Scenario: List with pagination
- **WHEN** `GET /api/caja/historial?skip=0&limit=10` is called
- **THEN** the system SHALL return a list of Caja records ordered by `fecha` descending
- **AND** the response SHALL include `total` count and `items` array

#### Scenario: Empty history
- **WHEN** `GET /api/caja/historial` is called and no closed registers exist
- **THEN** the system SHALL return `{ "total": 0, "items": [] }` with HTTP 200

### Requirement: Get cash register by ID

The system SHALL return a specific cash register by its ID.

#### Scenario: Register exists
- **WHEN** `GET /api/caja/{id}` is called with a valid Caja ID
- **THEN** the system SHALL return the Caja with HTTP 200

#### Scenario: Register not found
- **WHEN** `GET /api/caja/{id}` is called with an invalid ID
- **THEN** the system SHALL return HTTP 404 with detail "Caja no encontrada"

### Requirement: Frontend cash register page

The frontend SHALL display the cash register page with state-aware UI.

#### Scenario: No open register — show open button
- **WHEN** the user navigates to `/caja` and no open Caja exists for today
- **THEN** the page SHALL display a message "No hay caja abierta" and a button "Abrir caja"

#### Scenario: Open register — show summary
- **WHEN** the user navigates to `/caja` and an open Caja exists for today
- **THEN** the page SHALL display:
  - Caja status indicator (abierta/cerrada)
  - Initial amount
  - Totals by payment method (efectivo, transferencia, QR)
  - Total services
  - A "Cerrar caja" button

#### Scenario: Close register — confirmation modal
- **WHEN** the user clicks "Cerrar caja"
- **THEN** a confirmation modal SHALL appear showing all calculated totals and an observation text field
- **AND** the modal SHALL have a "Confirmar cierre" button

#### Scenario: History section
- **WHEN** the user scrolls to the history section or clicks the history tab
- **THEN** the page SHALL display a table of previous closed registers with date, totals, and pagination
