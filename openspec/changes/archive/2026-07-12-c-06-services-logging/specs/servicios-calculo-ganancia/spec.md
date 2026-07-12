## ADDED Requirements

### Requirement: Cálculo automático de ganancia al crear

El sistema SHALL calcular `ganancia = ingresoTotal - costoInsumos` automáticamente al momento de crear el registro, sin que el cliente envíe el campo ganancia.

#### Scenario: Ganancia con costo cero
- **WHEN** se crea un servicio con `ingresoTotal: 5000` y `costoInsumos: 0`
- **THEN** el registro guardado SHALL tener `ganancia = 5000`

#### Scenario: Ganancia con costo de insumos
- **WHEN** se crea un servicio con `ingresoTotal: 3000` y `costoInsumos: 1250`
- **THEN** el registro guardado SHALL tener `ganancia = 1750`

#### Scenario: Ganancia negativa (servicio a pérdida)
- **WHEN** se crea un servicio con `ingresoTotal: 1000` y `costoInsumos: 1500`
- **THEN** el registro guardado SHALL tener `ganancia = -500` (es válido, aunque inusual)

### Requirement: Cálculo de ingreso automático para fotocopias

El sistema SHALL calcular el ingresoTotal automáticamente para servicios de tipo "fotocopia" basado en la cantidad de hojas y un precio fijo por hoja, si el cliente no provee ingresoTotal.

#### Scenario: Fotocopia calcula ingreso
- **WHEN** se crea un servicio con `tipo: "fotocopia"`, `cantidad: 100` y sin `ingresoTotal`
- **THEN** el sistema SHALL calcular `ingresoTotal = cantidad × precioPorHoja` (ej: 100 × 50 = 5000)

#### Scenario: Fotocopia con ingreso explícito
- **WHEN** se crea un servicio con `tipo: "fotocopia"`, `cantidad: 100` y `ingresoTotal: 5000` explícito
- **THEN** el sistema SHALL usar el `ingresoTotal` provisto (no recalcular)

### Requirement: Preview de ganancia en el frontend

El frontend SHALL calcular y mostrar la ganancia estimada en tiempo real mientras el operador completa el formulario, antes de guardar.

#### Scenario: Preview se actualiza al cambiar cantidad
- **WHEN** el operador cambia la cantidad en el formulario de fotocopia
- **THEN** el frontend SHALL mostrar la ganancia estimada actualizada inmediatamente

#### Scenario: Preview con costo de insumos
- **WHEN** el operador ingresa un costo de insumos en el formulario
- **THEN** el frontend SHALL mostrar `ganancia = ingresoTotal - costoInsumos` actualizada
