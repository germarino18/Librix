# Caja — Especificación de Modelos

## Requirements

### R-CAJ-01: Apertura de caja del día
Se abre una caja al inicio del día con un monto inicial en efectivo.

#### Scenario: Abrir caja correctamente
- GIVEN no existe una caja abierta para la fecha de hoy
- WHEN se crea una Caja con fecha=hoy, montoInicial=500.00, estado="abierta"
- THEN la caja se guarda con estado "abierta"
- THEN montoFinal es NULL (aún no se cerró)

#### Scenario: Apertura con monto inicial cero
- WHEN se crea una caja con montoInicial=0
- THEN la caja se crea correctamente (es válido tener fondo cero)

### R-CAJ-02: Una caja abierta por día
No puede haber más de una caja abierta para la misma fecha.

#### Scenario: Segunda apertura del mismo día es rechazada
- GIVEN existe una caja abierta para la fecha 2026-06-25
- WHEN se intenta abrir otra caja para la misma fecha
- THEN el sistema rechaza con error (validación en service layer)

#### Scenario: Cerrar y reabrir en el mismo día
- GIVEN existe una caja para hoy con estado "cerrada"
- WHEN se intenta abrir otra caja para hoy
- THEN se permite (no hay caja abierta activa)

### R-CAJ-03: Cierre con totales
Al cerrar la caja se registran los totales de cada medio de pago y el monto final.

#### Scenario: Cierre de caja completo
- GIVEN existe una caja abierta con montoInicial=500.00
- WHEN se cierra la caja con: montoFinal=850.00, totalEfectivo=200.00, totalTransferencia=100.00, totalQR=50.00, totalServicios=0
- THEN la caja cambia estado a "cerrada"
- THEN montoFinal = 850.00
- THEN totalEfectivo = 200.00

#### Scenario: Cierre sin monto final
- WHEN se intenta cerrar una caja sin especificar montoFinal
- THEN el schema Pydantic rechaza el request (montoFinal es requerido en cierre)
