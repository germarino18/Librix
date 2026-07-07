## ADDED Requirements

### Requirement: Create sale endpoint

The system SHALL provide a POST /api/ventas endpoint to create a sale with automatic stock deduction.

#### Scenario: Successful sale creation
- **WHEN** a POST request is sent to /api/ventas with metodo_pago, observacion (optional), and detalles array
- **THEN** the system SHALL create a Venta with estado "completada"
- **THEN** the system SHALL create DetalleVenta records for each item
- **THEN** the system SHALL create MovimientoStock records (tipo="venta", cantidad negativa) for each product
- **THEN** the system SHALL decrement Producto.stock_actual for each product
- **THEN** the response SHALL include the created Venta with HTTP 201

#### Scenario: Sale with empty detalles
- **WHEN** a POST request is sent to /api/ventas with an empty detalles array
- **THEN** the system SHALL return HTTP 422 validation error (RN-04)

#### Scenario: Sale with non-existent product
- **WHEN** a POST request includes a producto_id that does not exist
- **THEN** the system SHALL return HTTP 404

#### Scenario: Transaction rollback on failure
- **WHEN** any step of the sale creation fails (venta, detalle, stock movement)
- **THEN** the entire operation SHALL be rolled back (no partial stock deductions)

### Requirement: Get sale endpoint

The system SHALL provide a GET /api/ventas/{id} endpoint to retrieve a sale with its details.

#### Scenario: Get existing sale
- **WHEN** a GET request is sent to /api/ventas/{id} for an existing sale
- **THEN** the response SHALL include the Venta with its DetalleVenta items (HTTP 200)

#### Scenario: Get non-existent sale
- **WHEN** a GET request is sent to /api/ventas/{id} for a non-existent sale
- **THEN** the system SHALL return HTTP 404

### Requirement: Router mount

The ventas router SHALL be mounted in main.py.

#### Scenario: Router mounted at /api/ventas
- **WHEN** the FastAPI app starts
- **THEN** the ventas router SHALL be accessible at /api/ventas/...

### Requirement: Stock movement records on sale

The system SHALL record a MovimientoStock for each product in a sale.

#### Scenario: MovimientoStock created with tipo "venta"
- **WHEN** a sale is created
- **THEN** for each product in the sale, a MovimientoStock SHALL be created with tipo="venta", cantidad = -(cantidad vendida), and observacion indicating the venta_id
