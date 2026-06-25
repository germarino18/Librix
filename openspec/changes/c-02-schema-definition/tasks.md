# C-02: Schema Definition — Tasks

> **Governance**: CRITICAL — requiere revisión del usuario antes de implementar
> **Estado**: Implementation Complete ✓

---

## Phase 1: Modelos SQLAlchemy

### 1.1 Reemplazar models.py en cada feature

#### Productos (`backend/app/features/productos/models.py`)
- [x] 1.1.1 Implementar `Categoria` model ✓
- [x] 1.1.2 Implementar `Producto` model ✓

#### Ventas (`backend/app/features/ventas/models.py`)
- [x] 1.1.3 Implementar `Venta` model ✓
- [x] 1.1.4 Implementar `DetalleVenta` model ✓

#### Stock (`backend/app/features/stock/models.py`)
- [x] 1.1.5 Implementar `MovimientoStock` model ✓

#### Caja (`backend/app/features/caja/models.py`)
- [x] 1.1.6 Implementar `Caja` model ✓

#### Insumos (`backend/app/features/insumos/models.py`)
- [x] 1.1.7 Implementar `InsumoServicio` model ✓
- [x] 1.1.8 Implementar `MovimientoInsumo` model ✓

#### Servicios (`backend/app/features/servicios/models.py`)
- [x] 1.1.9 Implementar `RegistroServicio` model ✓

### 1.2 Enums compartidos
- [x] 1.2.1 Enums definidos inline en cada models.py (MetodoPago, EstadoVenta, TipoMovimiento, EstadoCaja, TipoMovInsumo, TipoServicio) ✓

### 1.3 Relationships
- [x] 1.3.1 Categoria → productos (back_populates) ✓
- [x] 1.3.2 Producto → categoria (back_populates) ✓
- [x] 1.3.3 Producto → movimientos_stock ✓
- [x] 1.3.4 DetalleVenta → producto ✓
- [x] 1.3.5 Venta → detalles (cascade delete-orphan) ✓
- [x] 1.3.6 InsumoServicio → movimientos (back_populates) ✓

### 1.4 Constraints e índices
- [x] 1.4.1 Unique en Categoria.nombre ✓ (creado en migración)
- [x] 1.4.2 Index en Producto.activo ✓
- [x] 1.4.3 Index en Producto.categoria_id ✓
- [x] 1.4.4 Index en Producto.nombre ✓
- [x] 1.4.5 Index en MovimientoStock.producto_id ✓
- [x] 1.4.6 Index en MovimientoStock.tipo ✓
- [x] 1.4.7 Index en MovimientoInsumo.insumo_id ✓
- [x] 1.4.8 Index en DetalleVenta.venta_id ✓
- [x] 1.4.9 Index en DetalleVenta.producto_id ✓
- [x] 1.4.10 Index en Caja.fecha ✓
- [x] 1.4.11 Index en RegistroServicio.fecha ✓
- [x] 1.4.12 Index en RegistroServicio.tipo ✓

---

## Phase 2: Schemas Pydantic

### 2.1 Categoria schemas (`productos/schemas.py`)
- [x] 2.1.1 `CategoriaCreate` ✓
- [x] 2.1.2 `CategoriaResponse` ✓

### 2.2 Producto schemas (`productos/schemas.py`)
- [x] 2.2.1 `ProductoCreate` ✓
- [x] 2.2.2 `ProductoUpdate` ✓
- [x] 2.2.3 `ProductoResponse` ✓

### 2.3 Venta + DetalleVenta schemas (`ventas/schemas.py`)
- [x] 2.3.1 `DetalleVentaBase` + `DetalleVentaResponse` ✓
- [x] 2.3.2 `VentaCreate` (detalles: list[DetalleVentaBase]) ✓
- [x] 2.3.3 `VentaResponse` (detalles anidados) ✓

### 2.4 MovimientoStock schemas (`stock/schemas.py`)
- [x] 2.4.1 `MovimientoStockCreate` ✓
- [x] 2.4.2 `MovimientoStockResponse` ✓

### 2.5 Caja schemas (`caja/schemas.py`)
- [x] 2.5.1 `CajaCreate` ✓
- [x] 2.5.2 `CajaCierre` ✓
- [x] 2.5.3 `CajaResponse` ✓

### 2.6 InsumoServicio + MovimientoInsumo schemas (`insumos/schemas.py`)
- [x] 2.6.1 `InsumoCreate` + `InsumoUpdate` + `InsumoResponse` ✓
- [x] 2.6.2 `MovimientoInsumoCreate` + `MovimientoInsumoResponse` ✓

### 2.7 RegistroServicio schemas (`servicios/schemas.py`)
- [x] 2.7.1 `RegistroServicioCreate` ✓
- [x] 2.7.2 `RegistroServicioResponse` ✓

---

## Phase 3: Alembic Migration

### 3.1 Nueva migración
- [x] 3.1.1 Migration `0002_create_all_tables.py` creada manualmente ✓
- [x] 3.1.2 SQL generado correctamente (`alembic upgrade head --sql`) ✓
- [x] 3.1.3 6 tipos Enum nativos PostgreSQL ✓
- [x] 3.1.4 9 tablas con FKs, índices y constraints ✓

### 3.2 Aplicar y verificar
- [ ] 3.2.1 ~~`alembic upgrade head`~~ (pendiente de PostgreSQL)
- [ ] 3.2.2 Verificación visual pendiente
- [ ] 3.2.3 Test de inserción pendiente

---

## Phase 4: Seed Data (opcional)

### 4.1 Script de seed
- [ ] 4.1.1 Crear `backend/scripts/seed.py` (pendiente)

---

## Quality Gates

- [x] Q-01: Todos los modelos importan correctamente ✓
- [x] Q-02: Todos los schemas importan correctamente ✓
- [x] Q-03: uvicorn inicia sin errores ✓
- [x] Q-04: `alembic upgrade head --sql` genera SQL válido ✓
- [ ] Q-05: `alembic upgrade head` (requiere PostgreSQL)
- [ ] Q-06: `pytest` pasa

---

## Dependencias entre tasks

```
1.1.1 (Categoria) ──→ 1.1.2 (Producto) ──→ 1.1.5 (MovimientoStock)
                                         ──→ 1.1.3 (Venta) ──→ 1.1.4 (DetalleVenta)
                     
1.1.7 (InsumoServicio) ──→ 1.1.8 (MovimientoInsumo)
1.1.6 (Caja) ── independiente
1.1.9 (RegistroServicio) ── independiente

1.2.1 (Enums) ──→ todos los modelos que usan enums

Phase 2 (schemas) ──→ después de Phase 1
Phase 3 (migration) ──→ después de Phase 1
Phase 4 (seed) ──→ después de Phase 3
```
