# Insumos de Servicio — Especificación de Modelos

## Requirements

### R-INS-01: InsumoServicio con datos básicos
Los insumos de servicio tienen nombre, stock, costo y unidad de medida.

#### Scenario: Crear insumo básico
- WHEN se crea un InsumoServicio con nombre="Resma A4", unidad="resma"
- THEN el insumo se guarda con stockActual=0, costoUnitario=0, stockMinimo=0

#### Scenario: Crear insumo con todos los campos
- WHEN se crea un InsumoServicio con nombre="Tóner HP 123", stockActual=5, costoUnitario=150.00, stockMinimo=2, paginasPorUnidad=3000
- THEN todos los campos se guardan correctamente
- THEN paginasPorUnidad = 3000 (solo para tóner/cartuchos)

#### Scenario: Insumo sin nombre es rechazado
- WHEN se intenta crear un insumo sin nombre
- THEN el schema Pydantic rechaza el request

### R-INS-02: Movimiento de insumo con tipo enum
Los movimientos de insumo tienen tipo "ingreso" o "consumo".

#### Scenario: Registrar ingreso de insumo
- GIVEN existe un insumo "Resma A4" con stockActual=0
- WHEN se crea un MovimientoInsumo con tipo="ingreso", cantidad=5, insumoServicio_id=ID
- THEN el movimiento se guarda con fechaHora automática

#### Scenario: Registrar consumo de insumo
- GIVEN existe un insumo "Resma A4" con stockActual=5
- WHEN se crea un MovimientoInsumo con tipo="consumo", cantidad=1
- THEN el movimiento se guarda con cantidad positiva (el tipo indica dirección)

#### Scenario: Tipo inválido es rechazado
- WHEN se intenta crear un movimiento con tipo="devolucion"
- THEN la DB rechaza con error (solo "ingreso" y "consumo" son válidos)
