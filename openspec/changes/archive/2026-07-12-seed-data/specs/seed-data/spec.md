## ADDED Requirements

### Requirement: Categorías iniciales predefinidas

El sistema SHALL proveer un seed que inserte las siguientes categorías de productos al ejecutarse:
- Escritura
- Papelería
- Carpetas y Archivos
- Corrección
- Adhesivos
- Varios

#### Scenario: Inserción de categorías

- **WHEN** se ejecuta `python seed.py` desde `backend/`
- **THEN** se crean las 6 categorías en la tabla `categorias`

### Requirement: Productos iniciales realistas

El sistema SHALL proveer un seed que inserte al menos 5 productos por categoría con datos coherentes: nombre, precioCompra, precioVenta (margen 20-40%), stockActual (10-100 según producto), stockMinimo (3-10), unidad correcta, activo=true.

#### Scenario: Inserción de productos por categoría

- **WHEN** se ejecuta `python seed.py`
- **THEN** existen al menos 30 productos distribuidos en las 6 categorías
- **AND** cada producto tiene precioVenta > precioCompra
- **AND** cada producto tiene unidad coherente (unidad, resma, caja, etc.)

#### Scenario: Márgenes de ganancia coherentes

- **WHEN** se ejecuta `python seed.py`
- **THEN** cada producto tiene un margen de ganancia entre 20% y 40%
- **AND** el porcentaje_ganancia se calcula automáticamente según precioCompra/precioVenta

### Requirement: Insumos de servicios iniciales

El sistema SHALL proveer un seed que inserte al menos los siguientes insumos de servicios:
- Resma de papel A4 (500 hojas) con stockActual, stockMinimo, costoUnitario y páginasPorUnidad=500
- Cartucho de tóner negro con stockActual, stockMinimo, costoUnitario
- Cartucho de tóner color con stockActual, stockMinimo, costoUnitario

#### Scenario: Inserción de insumos

- **WHEN** se ejecuta `python seed.py`
- **THEN** se crean 3 insumos de servicio con datos coherentes
- **AND** la resma de papel A4 tiene páginasPorUnidad=500

### Requirement: Idempotencia

El seed SHALL ser idempotente: se puede ejecutar múltiples veces sin duplicar datos.

#### Scenario: Ejecución repetida

- **WHEN** se ejecuta `python seed.py` dos veces consecutivas
- **THEN** la segunda ejecución no arroja errores
- **AND** la cantidad de registros en cada tabla es la misma que tras la primera ejecución

### Requirement: Ejecución simple

El seed SHALL ejecutarse con un solo comando `python seed.py` desde el directorio `backend/`, sin argumentos ni configuraciones adicionales.

#### Scenario: Ejecución desde backend/

- **WHEN** el usuario ejecuta `python seed.py` estando en `backend/`
- **THEN** el script se conecta a la BD usando la misma configuración que la app
- **AND** muestra un mensaje de éxito al finalizar
