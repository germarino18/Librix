# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librix**.
> Stack: React + FastAPI + PostgreSQL.
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están completadas).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 foundation-fastapi
  └── C-02 schema-definition
        ├── C-03 product-catalog
        │     ├── C-04 sales-screen
        │     │     └── C-07 cash-register     ← merge point (C-04 + C-06)
        │     │           └── C-08 profit-dashboard
        │     └── C-09 stock-history
        │
        └── C-05 supplies-management
              └── C-06 services-logging
                    └── C-07 cash-register     ← merge point (C-04 + C-06)
```

### Paralelismo por fase

```
GATE 0: ninguna
  → C-01 foundation-fastapi           (solo)

GATE 1: C-01 ✓
  → C-02 schema-definition            (solo)

GATE 2: C-02 ✓                        ← PRIMER FORK
  → C-03 product-catalog             [Agente A]
  → C-05 supplies-management         [Agente B]

GATE 3: C-03 ✓ + C-05 ✓              ← SEGUNDO FORK
  → C-04 sales-screen                [Agente A]
  → C-06 services-logging            [Agente B]
  → C-09 stock-history               [Agente C]

GATE 4: C-04 ✓ + C-06 ✓              ← MERGE
  → C-07 cash-register               [Agente A]

GATE 5: C-07 ✓
  → C-08 profit-dashboard            [Agente C]
```

### Camino crítico (6 changes)

```
C-01 → C-02 → C-03 → C-04 → C-07 → C-08
```

---

## FASE 0 — Fundamentos

### [C-01] `foundation-fastapi`
- **Estado**: `[ ]` pendiente
- **Scope**: Scaffolding completo del proyecto con FastAPI + PostgreSQL
  - **Backend**: FastAPI app con estructura feature-based, SQLAlchemy async, config, database session
  - **Frontend**: React + Vite + shadcn/ui + TanStack Query + React Router v7 (ya existe en src/)
  - **Cliente API**: `src/lib/api.ts` con fetch genérico para FastAPI
  - **Migraciones**: Alembic inicializado con migración base
  - **PostgreSQL**: setup con asyncpg
  - Scripts de desarrollo: backend (uvicorn --reload), frontend (vite dev), BD (local)
  - Integración continua: build y typecheck funcionando
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Stack
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios

### [C-02] `schema-definition`
- **Estado**: `[x]` archivado ✅
- **Scope**: Definición de todas las entidades del sistema en SQLAlchemy + Alembic
  - Modelos SQLAlchemy y schemas Pydantic para las 8 entidades: Categoria, Producto, Venta, DetalleVenta, MovimientoStock, Caja, InsumoServicio, MovimientoInsumo, RegistroServicio
  - Migraciones Alembic con relaciones, índices y constraints
  - Seed data opcional para desarrollo
- **Dependencias**: C-01
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` (todas las entidades)
  - `knowledge-base/05_reglas_de_negocio.md` (RN-01 a RN-10)

---

## FASE 1 — Catálogo de Productos

### [C-03] `product-catalog`
- **Estado**: `[ ]` pendiente
- **Scope**: ABM de categorías y productos + refactor de API calls (de PocketBase → FastAPI)
  - **Refactor frontend**: convertir `src/features/productos/api/` de PocketBase SDK a fetch contra FastAPI
  - **Backend**: router + service + schemas para Categoria y Producto (CRUD, filtros, paginación, baja lógica)
  - Página `/productos` con listado, filtros, ABM y alertas de stock (ya existe en frontend)
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Categoria, §Producto
  - `knowledge-base/06_funcionalidades.md` §Épica 2
  - `knowledge-base/05_reglas_de_negocio.md` §RN-02, RN-03

---

## FASE 2 — Punto de Venta

### [C-04] `sales-screen`
- **Estado**: `[ ]` pendiente
- **Scope**: Pantalla de ventas rápida con carrito, descuento de stock y métodos de pago
  - Ruta `/` (raíz) como pantalla de ventas (layout full-height)
  - Buscador de productos inline, grilla de frecuentes, carrito con edición de cantidad
  - Métodos de pago, botón "Cobrar", descuento de stock automático (RN-01)
  - API endpoints: POST /ventas, GET /ventas/{id}, GET /productos/buscar
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §DetalleVenta, §MovimientoStock
  - `knowledge-base/06_funcionalidades.md` §Épica 1
  - `knowledge-base/07_flujos_principales.md` §Flujo 1
  - `knowledge-base/05_reglas_de_negocio.md` §RN-01, RN-04, RN-05

---

## FASE 3 — Insumos y Servicios Post-Jornada

### [C-05] `supplies-management`
- **Estado**: `[x]` archivado ✅
- **Scope**: ABM de insumos de servicios con registro de ingresos y consumos
  - Página `/insumos`, ABM insumos, registro de ingreso/consumo, alertas de stock bajo
  - API endpoints: CRUD insumos, CRUD movimientos insumo
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §InsumoServicio, §MovimientoInsumo
  - `knowledge-base/06_funcionalidades.md` §Épica 3

### [C-06] `services-logging`
- **Estado**: `[ ]` pendiente
- **Scope**: Registro post-jornada de servicios (fotocopias, plastificados, souvenirs)
  - Página `/servicios`, formularios por tipo, cálculo automático de ganancia (RN-09)
  - API endpoints: CRUD registros servicio
- **Dependencias**: C-05, C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §RegistroServicio
  - `knowledge-base/06_funcionalidades.md` §Épica 4
  - `knowledge-base/07_flujos_principales.md` §Flujo 4
  - `knowledge-base/05_reglas_de_negocio.md` §RN-08, RN-09

---

## FASE 4 — Caja Diaria y Dashboard

### [C-07] `cash-register`
- **Estado**: `[ ]` pendiente
- **Scope**: Apertura y cierre de caja diaria con totales por método de pago
  - Página `/caja`, apertura/cierre, resumen con totales, historial
  - API endpoints: CRUD caja, totales del día
- **Dependencias**: C-04, C-06
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Caja
  - `knowledge-base/06_funcionalidades.md` §Épica 5
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/05_reglas_de_negocio.md` §RN-06, RN-07, RN-10

### [C-08] `profit-dashboard`
- **Estado**: `[ ]` pendiente
- **Scope**: Dashboard con tarjetas de ganancia, filtros temporales, productos más vendidos
  - API endpoints con agregaciones: ganancia por productos, por servicios, top ventas, alertas stock
- **Dependencias**: C-07
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 6
  - `knowledge-base/07_flujos_principales.md` §Flujo 5
  - `knowledge-base/05_reglas_de_negocio.md` §RN-10

---

## FASE 5 — Historial y Complementos

### [C-09] `stock-history`
- **Estado**: `[ ]` pendiente
- **Scope**: Historial de movimientos de stock por producto + estimación de páginas de tóner
  - Modal de historial en productos, filtros por tipo, estimación en insumos
  - API endpoints: GET /movimientos-stock?producto_id=X
- **Dependencias**: C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §MovimientoStock, §InsumoServicio
  - `knowledge-base/06_funcionalidades.md` §F-14, §F-19

---

## Resumen

| Change | Nombre | Dependencias | Governance | Fase |
|--------|--------|-------------|------------|------|
| C-01 | foundation-fastapi | — | BAJO | ✅ Fundamentos |
| C-02 | schema-definition | C-01 | CRITICO | Fundamentos |
| C-03 | product-catalog | C-02 | BAJO | Catálogo |
| C-04 | sales-screen | C-03 | MEDIO | Punto de Venta |
| C-05 | supplies-management | C-02 | BAJO | ✅ Insumos y Servicios |
| C-06 | services-logging | C-05, C-02 | BAJO | Insumos y Servicios |
| C-07 | cash-register | C-04, C-06 | MEDIO | Caja y Dashboard |
| C-08 | profit-dashboard | C-07 | MEDIO | Caja y Dashboard |
| C-09 | stock-history | C-03 | BAJO | Historial |

**Total**: 9 changes · 5 fases · 6 cambios en camino crítico · 3 gates de paralelismo

**Primer change recomendado**: `C-01 foundation-fastapi` — sin dependencias, desbloquea todo.
