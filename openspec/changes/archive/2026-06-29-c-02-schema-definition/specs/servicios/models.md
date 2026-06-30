# Servicios — Especificación de Modelos

## Requirements

### R-SRV-01: Registro de servicio con tipo enum
Cada servicio registrado tiene un tipo específico: fotocopia, plastificado, souvenir u otro.

#### Scenario: Registrar servicio de fotocopia
- WHEN se crea un RegistroServicio con fecha=hoy, tipo="fotocopia", descripcion="Fotocopias A4 B/N", cantidad=100, ingresoTotal=50.00
- THEN el registro se guarda con costoInsumos=0, ganancia=ingresoTotal - costoInsumos=50.00

#### Scenario: Registrar servicio con costo de insumos
- WHEN se crea un RegistroServicio con tipo="plastificado", cantidad=10, ingresoTotal=30.00, costoInsumos=12.50
- THEN ganancia = 17.50 (30.00 - 12.50)

#### Scenario: Tipo inválido es rechazado
- WHEN se intenta crear un servicio con tipo="escaneo"
- THEN la DB rechaza con error (solo "fotocopia", "plastificado", "souvenir", "otro" son válidos)

### R-SRV-02: Cálculo de ganancia automático
La ganancia se calcula como ingresoTotal - costoInsumos.

#### Scenario: Ganancia calculada al crear
- GIVEN un servicio con ingresoTotal=100.00, costoInsumos=30.00
- WHEN se guarda el registro
- THEN ganancia = 70.00

#### Scenario: Servicio sin costo de insumos
- WHEN se crea un servicio sin especificar costoInsumos
- THEN costoInsumos = 0
- THEN ganancia = ingresoTotal

#### Scenario: Ganancia negativa (servicio a pérdida)
- GIVEN costoInsumos=50.00, ingresoTotal=30.00
- THEN ganancia = -20.00 (es válido, aunque inusual)
