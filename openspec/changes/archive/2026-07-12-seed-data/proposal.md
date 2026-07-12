## Why

Actualmente la base de datos no tiene datos de prueba, lo que dificulta el desarrollo y las pruebas. Se necesita un conjunto de datos iniciales realistas de una librería universitaria para poder visualizar el funcionamiento del sistema sin tener que cargar datos manualmente cada vez que se resetea la BD.

## What Changes

- Script Python `backend/seeds/seed.py` que inserta datos iniciales:
  - **Categorías** de productos típicas de una librería/papelería universitaria
  - **Productos** con datos realistas (5+ por categoría, con precios, stock y márgenes coherentes)
  - **Insumos de servicios** (resma de papel A4, cartuchos de tóner)
- El script utiliza SQLAlchemy async directamente, coherente con los modelos existentes del proyecto
- Es idempotente: limpia tablas antes de insertar para poder ejecutarse múltiples veces sin duplicados
- No afecta código de producción ni endpoints existentes

## Capabilities

### New Capabilities
- `seed-data`: Script de seed que pobla la base de datos con datos iniciales realistas para desarrollo y pruebas

### Modified Capabilities

<!-- Sin cambios en specs existentes -->

## Impact

- Nuevo archivo: `backend/seeds/seed.py`
- No afecta código de producción, rutas, ni modelos existentes
- No requiere nuevas dependencias
