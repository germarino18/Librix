## ADDED Requirements

### Requirement: Listar servicios con filtros por fecha y tipo

El sistema SHALL retornar los registros de servicio filtrados por fecha y/o tipo como JSON array.

#### Scenario: Listar todos los servicios de una fecha
- **WHEN** se envía un GET a `/api/servicios?fecha=2026-07-12`
- **THEN** la respuesta SHALL ser un array con todos los servicios de esa fecha, HTTP 200

#### Scenario: Filtrar por fecha y tipo
- **WHEN** se envía un GET a `/api/servicios?fecha=2026-07-12&tipo=fotocopia`
- **THEN** la respuesta SHALL contener solo servicios de tipo "fotocopia" de esa fecha

#### Scenario: Sin resultados
- **WHEN** se envía un GET a `/api/servicios?fecha=2026-01-01` y no hay registros
- **THEN** la respuesta SHALL ser un array vacío `[]` con HTTP 200

#### Scenario: Sin filtros
- **WHEN** se envía un GET a `/api/servicios` sin parámetros de filtro
- **THEN** la respuesta SHALL retornar todos los servicios ordenados por fecha descendente

### Requirement: Obtener servicio por ID

El sistema SHALL retornar un RegistroServicio por su UUID.

#### Scenario: Servicio existente
- **WHEN** se envía un GET a `/api/servicios/{id}` con un ID válido
- **THEN** la respuesta SHALL tener HTTP 200 con el objeto del servicio

#### Scenario: Servicio no existente
- **WHEN** se envía un GET a `/api/servicios/00000000-0000-0000-0000-000000000000`
- **THEN** la respuesta SHALL tener HTTP 404

### Requirement: Crear servicio

El sistema SHALL crear un nuevo RegistroServicio con los datos provistos, calculando la ganancia automáticamente.

#### Scenario: Creación válida de fotocopia
- **WHEN** se envía un POST a `/api/servicios` con `{ fecha: "2026-07-12", tipo: "fotocopia", descripcion: "Fotocopias A4 B/N", cantidad: 100, ingresoTotal: 5000, costoInsumos: 0 }`
- **THEN** la respuesta SHALL tener HTTP 201 con el objeto creado incluyendo UUID generado y `ganancia = 5000`

#### Scenario: Creación válida con costo de insumos
- **WHEN** se envía un POST con `{ tipo: "plastificado", cantidad: 10, ingresoTotal: 3000, costoInsumos: 1250 }`
- **THEN** la respuesta SHALL tener HTTP 201 y `ganancia = 1750`

#### Scenario: Campos requeridos faltantes
- **WHEN** se envía un POST sin `fecha` o sin `tipo`
- **THEN** la respuesta SHALL tener HTTP 422 con detalles de validación

#### Scenario: Tipo inválido
- **WHEN** se envía un POST con `tipo: "escaneo"`
- **THEN** la respuesta SHALL tener HTTP 422 (solo "fotocopia", "plastificado", "souvenir", "otro" son válidos)

### Requirement: Eliminar servicio

El sistema SHALL eliminar un RegistroServicio por UUID.

#### Scenario: Eliminar servicio existente
- **WHEN** se envía un DELETE a `/api/servicios/{id}`
- **THEN** la respuesta SHALL tener HTTP 204 sin contenido

#### Scenario: Eliminar servicio no existente
- **WHEN** se envía un DELETE a `/api/servicios/00000000-0000-0000-0000-000000000000`
- **THEN** la respuesta SHALL tener HTTP 404
