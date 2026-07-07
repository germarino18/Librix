## ADDED Requirements

### Requirement: Listar categorías

El sistema SHALL listar todas las categorías ordenadas por nombre alfabéticamente.

#### Scenario: Listado exitoso
- **WHEN** se envía GET /api/categorias
- **THEN** se retorna un array de objetos CategoriaResponse con HTTP 200

#### Scenario: Listado sin categorías
- **WHEN** no existen categorías
- **THEN** se retorna un array vacío con HTTP 200

### Requirement: Obtener categoría por ID

El sistema SHALL retornar una categoría por su ID.

#### Scenario: Categoría existe
- **WHEN** se envía GET /api/categorias/{id}
- **THEN** se retorna un objeto CategoriaResponse con HTTP 200

#### Scenario: Categoría no existe
- **WHEN** se envía GET /api/categorias/{id} con ID inexistente
- **THEN** se retorna HTTP 404 con mensaje de error

### Requirement: Crear categoría

El sistema SHALL crear una categoría con nombre único.

#### Scenario: Creación exitosa
- **WHEN** se envía POST /api/categorias con { nombre: "Nueva" }
- **THEN** se retorna un objeto CategoriaResponse con HTTP 201

#### Scenario: Nombre duplicado
- **WHEN** se envía POST /api/categorias con un nombre existente
- **THEN** se retorna HTTP 409 con mensaje de error

#### Scenario: Nombre vacío
- **WHEN** se envía POST /api/categorias con nombre vacío
- **THEN** se retorna HTTP 422 con error de validación

### Requirement: Actualizar categoría

El sistema SHALL actualizar el nombre de una categoría existente.

#### Scenario: Actualización exitosa
- **WHEN** se envía PUT /api/categorias/{id} con { nombre: "Actualizado" }
- **THEN** se retorna un objeto CategoriaResponse actualizado con HTTP 200

#### Scenario: Actualizar a nombre duplicado
- **WHEN** se envía PUT /api/categorias/{id} con un nombre que ya existe
- **THEN** se retorna HTTP 409 con mensaje de error

### Requirement: Eliminar categoría

El sistema SHALL eliminar una categoría solo si no tiene productos asociados.

#### Scenario: Eliminación exitosa
- **WHEN** la categoría no tiene productos asociados
- **WHEN** se envía DELETE /api/categorias/{id}
- **THEN** se retorna HTTP 204 sin contenido

#### Scenario: Categoría con productos asociados
- **WHEN** la categoría tiene al menos un producto asociado
- **WHEN** se envía DELETE /api/categorias/{id}
- **THEN** se retorna HTTP 409 con mensaje "No se puede eliminar la categoría porque tiene productos asociados"
