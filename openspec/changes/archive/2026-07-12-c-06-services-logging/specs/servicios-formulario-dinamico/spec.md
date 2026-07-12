## ADDED Requirements

### Requirement: Selector de tipo de servicio

El frontend SHALL mostrar un selector (tabs o dropdown) con los tipos válidos: Fotocopia, Plastificado, Souvenir, Otro.

#### Scenario: Selector visible al abrir formulario
- **WHEN** el operador abre el formulario de nuevo servicio
- **THEN** se SHALL mostrar un selector con los 4 tipos disponibles

#### Scenario: Cambio de tipo actualiza campos
- **WHEN** el operador cambia el tipo seleccionado
- **THEN** los campos del formulario SHALL actualizarse dinámicamente según el tipo

### Requirement: Campos dinámicos según tipo — Fotocopia

Para tipo "fotocopia", el formulario SHALL mostrar solo: cantidad de hojas. El ingresoTotal se calcula automáticamente.

#### Scenario: Formulario de fotocopia
- **WHEN** el operador selecciona tipo "fotocopia"
- **THEN** el formulario SHALL mostrar campo "Cantidad de hojas" y un display del ingreso calculado (cantidad × precio por hoja)

#### Scenario: Cálculo en tiempo real
- **WHEN** el operador escribe 150 en cantidad de hojas
- **THEN** el sistema SHALL mostrar ingreso = 150 × precioPorHoja y ganancia = ingreso - costoInsumos

### Requirement: Campos dinámicos según tipo — Plastificado

Para tipo "plastificado", el formulario SHALL mostrar: selector de tipo frecuente (A4, A5, 10×15, etc.) + cantidad. El ingresoTotal se calcula automáticamente.

#### Scenario: Formulario de plastificado
- **WHEN** el operador selecciona tipo "plastificado"
- **THEN** el formulario SHALL mostrar un dropdown de tipos frecuentes y campo de cantidad

#### Scenario: Selección de tipo frecuente calcula ingreso
- **WHEN** el operador selecciona "A4" y cantidad 10
- **THEN** el sistema SHALL calcular ingresoTotal = precioDelTipo × cantidad

### Requirement: Campos dinámicos según tipo — Souvenir

Para tipo "souvenir", el formulario SHALL mostrar: descripción libre (textarea) + ingresoTotal (input numérico manual).

#### Scenario: Formulario de souvenir
- **WHEN** el operador selecciona tipo "souvenir"
- **THEN** el formulario SHALL mostrar campo "Descripción" (textarea) y campo "Ingreso total" (numérico)

### Requirement: Campos dinámicos según tipo — Otro

Para tipo "otro", el formulario SHALL mostrar: descripción libre + ingresoTotal + costoInsumos (opcional).

#### Scenario: Formulario de otro
- **WHEN** el operador selecciona tipo "otro"
- **THEN** el formulario SHALL mostrar campo "Descripción", "Ingreso total" y "Costo de insumos" (opcional, default 0)

### Requirement: Listado de servicios del día con totales

El frontend SHALL mostrar una tabla con los servicios del día seleccionado y totales calculados.

#### Scenario: Listado con servicios
- **WHEN** el operador está en la página `/servicios`
- **THEN** se SHALL mostrar una tabla con todos los servicios del día actual, incluyendo: fecha, tipo, descripción, cantidad, ingresoTotal, costoInsumos, ganancia

#### Scenario: Totales calculados
- **WHEN** hay servicios en el listado
- **THEN** se SHALL mostrar una fila de totales con: suma de ingresoTotal, suma de costoInsumos, suma de ganancia

#### Scenario: Filtro por tipo
- **WHEN** el operador selecciona un filtro de tipo en el listado
- **THEN** la tabla SHALL mostrar solo servicios de ese tipo
