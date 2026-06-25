# Productos — Especificación de Modelos

## Requirements

### R-PRO-01: Categoria con nombre único
Cada categoría debe tener un nombre único. No pueden existir dos categorías con el mismo nombre.

#### Scenario: Crear categoría con nombre único
- GIVEN no existe una categoría con nombre "Fotocopia"
- WHEN se crea una categoría con nombre "Fotocopia"
- THEN el sistema guarda la categoría y asigna un UUID

#### Scenario: Nombre duplicado es rechazado
- GIVEN existe una categoría con nombre "Fotocopia"
- WHEN se intenta crear otra categoría con nombre "Fotocopia"
- THEN el sistema rechaza la operación con error de unique constraint

#### Scenario: Categoria sin nombre es rechazada
- GIVEN un request de creación de categoría
- WHEN el campo nombre está vacío o ausente
- THEN el schema Pydantic rechaza el request con error de validación

### R-PRO-02: Producto con categoria opcional
Un producto puede pertenecer a una categoría o no tener categoría asignada.

#### Scenario: Producto con categoria asignada
- GIVEN existe una categoría "Fotocopia"
- WHEN se crea un producto con categoria_id = UUID de "Fotocopia"
- THEN el producto se guarda con la relación a la categoría

#### Scenario: Producto sin categoria
- WHEN se crea un producto sin especificar categoria_id
- THEN el producto se guarda con categoria_id = NULL

#### Scenario: Producto con categoria inexistente
- GIVEN no existe una categoría con UUID "abc-123"
- WHEN se intenta crear un producto con categoria_id = "abc-123"
- THEN el sistema rechaza la operación con error de FK constraint

### R-PRO-03: Baja lógica con activo=false
Los productos no se eliminan físicamente. Se marcan como inactivos.

#### Scenario: Producto creado activo por defecto
- WHEN se crea un nuevo producto
- THEN el campo activo es true

#### Scenario: Desactivar producto
- GIVEN existe un producto activo
- WHEN se actualiza activo a false
- THEN el producto se marca como inactivo sin eliminar registros

#### Scenario: Producto inactivo no aparece en búsquedas de venta
- GIVEN existe un producto con activo=false
- WHEN se consultan productos disponibles para venta
- THEN el producto inactivo no está incluido en los resultados

### R-PRO-04: Stock minimo para alertas
El producto tiene un stock mínimo configurable que permite alertar cuando el stock actual está por debajo.

#### Scenario: Producto con stock minimo por defecto
- WHEN se crea un producto
- THEN stockMinimo es 0

#### Scenario: Configurar stock minimo
- GIVEN existe un producto con stockActual=5
- WHEN se actualiza stockMinimo a 10
- THEN se puede detectar que stockActual (5) < stockMinimo (10) para generar alerta
