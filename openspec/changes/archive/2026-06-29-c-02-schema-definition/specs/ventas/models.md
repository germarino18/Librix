# Ventas — Especificación de Modelos

## Requirements

### R-VEN-01: Venta con múltiples detalles
Una venta contiene uno o más detalles (líneas de producto), cada uno con cantidad, precio unitario y subtotal.

#### Scenario: Crear venta con un detalle
- GIVEN existe un producto "Resma A4" con precioVenta=10.00
- WHEN se crea una venta con 1 detalle: producto="Resma A4", cantidad=2, precioUnitario=10.00
- THEN el detalle tiene subtotal = 20.00
- THEN la venta queda con estado "completada"

#### Scenario: Crear venta con múltiples detalles
- GIVEN existen productos "Resma A4" (precio=10.00) y "Tóner" (precio=50.00)
- WHEN se crea una venta con 2 detalles: Resma×2=20.00, Tóner×1=50.00
- THEN la venta tiene 2 detalles asociados
- THEN cada detalle es accesible desde la relación venta.detalles

#### Scenario: Venta sin detalles es rechazada
- WHEN se intenta crear una venta sin detalles
- THEN el sistema rechaza la operación (validación en service layer)

### R-VEN-02: Cálculo del total
El total de la venta se calcula como la suma de todos los subtotales de sus detalles.

#### Scenario: Total calculado automáticamente
- GIVEN una venta con detalles: [cant=3, pu=10.00 → subtotal=30.00], [cant=1, pu=50.00 → subtotal=50.00]
- WHEN se guarda la venta
- THEN total = 80.00

#### Scenario: Subtotal de cada detalle
- GIVEN un detalle con cantidad=2.5 y precioUnitario=8.00
- WHEN se calcula el subtotal
- THEN subtotal = 20.00 (cantidad × precioUnitario)

### R-VEN-03: Venta cancelada no elimina registro
Las ventas canceladas permanecen en la base de datos con estado "cancelada".

#### Scenario: Cancelar venta completada
- GIVEN existe una venta con estado "completada"
- WHEN se cambia estado a "cancelada"
- THEN la venta persiste con estado "cancelada"
- THEN todos los detalles asociados persisten

#### Scenario: Venta cancelada no se cuenta en ingresos
- GIVEN existe una venta cancelada con total=100.00
- WHEN se consultan las ventas del día
- THEN la venta cancelada aparece en el listado
- THEN la venta cancelada no se incluye en el total de ingresos (filtro por estado)
