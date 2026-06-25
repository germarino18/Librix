# Stock — Especificación de Modelos

## Requirements

### R-STK-01: Registrar ingreso de stock
Se puede registrar un ingreso de stock para incrementar el inventario de un producto.

#### Scenario: Ingreso de stock con cantidad positiva
- GIVEN existe un producto "Resma A4" con stockActual=0
- WHEN se crea un MovimientoStock de tipo="ingreso", cantidad=10, producto="Resma A4"
- THEN el movimiento se guarda con fechaHora automática
- THEN el movimiento tiene cantidad positiva (+10)

#### Scenario: Ingreso con observación opcional
- GIVEN existe un producto "Tóner"
- WHEN se crea un ingreso con observación "Compra mensual proveedor X"
- THEN la observación se guarda correctamente

#### Scenario: Ingreso sin producto es rechazado
- WHEN se intenta crear un movimiento sin producto_id
- THEN el schema Pydantic rechaza el request

### R-STK-02: Registrar venta descuenta stock
Las ventas generan movimientos de stock con cantidad negativa.

#### Scenario: Venta genera movimiento de salida
- GIVEN existe un producto "Resma A4" con stockActual=10
- WHEN se registra un movimiento de tipo="venta", cantidad=3
- THEN el movimiento se guarda con cantidad -3
- THEN se puede consultar el historial de movimientos del producto

#### Scenario: Ajuste manual de stock
- GIVEN existe un producto "Resma A4"
- WHEN se crea un movimiento de tipo="ajuste", cantidad=5, observación="Corrección por inventario"
- THEN el movimiento se guarda con tipo="ajuste"

### R-STK-03: Tipo de movimiento restringido por enum
El tipo de movimiento solo puede ser "ingreso", "venta" o "ajuste".

#### Scenario: Tipo válido aceptado
- WHEN se crea un movimiento con tipo="ingreso"
- THEN el movimiento se guarda correctamente

#### Scenario: Tipo inválido rechazado
- WHEN se intenta crear un movimiento con tipo="devolucion"
- THEN la DB rechaza con error de check constraint o enum value inválido
