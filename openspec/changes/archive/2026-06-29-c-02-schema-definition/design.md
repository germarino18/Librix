# C-02: Schema Definition — Design Document

---

## Decisiones Técnicas

### D-01: UUID v4 como PK de todas las entidades

**Decisión**: Usar `str` con UUID4 generado desde Python (`uuid.uuid4().hex`) como PK.

**Alternativas consideradas**:
| Opción | Pros | Contras |
|--------|------|---------|
| `Int` autoincrement | Simple, performance, legible | Secuencial, expone cantidad de registros, problema en migraciones/distribución |
| `UUID` nativo PostgreSQL (pg typed) | Performance óptima, sin conversión | Dependencia de tipo nativo, menos portable |
| `UUID` como string (elegido) | Portable entre DBs, fácil debug, compatible con APIs REST | 36 chars vs 4 del int |

**Conclusión**: UUID string porque el proyecto usa UUIDs en URLs REST, y la portabilidad entre entornos de desarrollo/testing es prioridad. La pérdida de performance es despreciable para el volumen de datos esperado.

### D-02: Decimal para campos monetarios y de stock

**Decisión**: `sqlalchemy.Numeric(12, 2)` para todos los campos de dinero, `Numeric(10, 2)` para stock/cantidad.

**Alternativas**:
| Opción | Problema |
|--------|----------|
| `Float` | Errores de redondeo en sumas de dinero (0.1 + 0.2 ≠ 0.3) |
| `Integer` (centavos) | Correcto pero requiere conversión manual constante |
| `Numeric`/`Decimal` (elegido) | Precisión exacta, SQLAlchemy lo mapea a `Decimal` de Python |

### D-03: Enum types via Python enum + SQLAlchemy Enum (nativo PostgreSQL)

**Decisión**: Definir clases `enum.Enum` en Python y usar `sa.Enum(tipo_enum, create_constraint=True)` en las columnas. Se crean como tipos nativos de PostgreSQL (`CREATE TYPE`).

**Enums definidos**:
| Enum | Valores | Usado en |
|------|---------|----------|
| `MetodoPago` | efectivo, transferencia, qr_mercadopago | Venta.metodoPago |
| `EstadoVenta` | completada, cancelada | Venta.estado |
| `TipoMovimientoStock` | ingreso, venta, ajuste | MovimientoStock.tipo |
| `EstadoCaja` | abierta, cerrada | Caja.estado |
| `TipoMovimientoInsumo` | ingreso, consumo | MovimientoInsumo.tipo |
| `TipoServicio` | fotocopia, plastificado, souvenir, otro | RegistroServicio.tipo |

### D-04: TimestampMixin para todas las entidades

**Decisión**: Heredar de `TimestampMixin` (ya implementado en `shared/mixins.py`) en todos los modelos. Esto agrega `created_at` y `updated_at` con `server_default=func.now()` y `onupdate=func.now()`.

### D-05: Categoria delete → RESTRICT (no cascade)

**Decisión**: `ForeignKey("categorias.id", ondelete="RESTRICT")`. No se puede eliminar una categoría si tiene productos asociados.

**Alternativas**:
| Opción | Problema |
|--------|----------|
| `CASCADE` | Eliminar categoría borraría productos → pérdida de datos |
| `SET NULL` | Productos huérfanos sin categoría |
| `RESTRICT` (elegido) | Fuerza al usuario a reasignar productos primero |

### D-06: Venta cancelada → UPDATE estado, no DELETE

**Decisión**: Las ventas canceladas permanecen en la DB con `estado="cancelada"`. No se eliminan registros. Esto aplica también a `DetalleVenta` asociados.

### D-07: stockActual calculado en service layer, no DB

**Decisión**: `Producto.stockActual` se actualiza mediante queries en el service layer (contar movimientos de stock). No se usan triggers de base de datos. Esto permite auditoría y control transaccional desde la aplicación.

### D-08: Caja única por día — control en service layer

**Decisión**: No se usa índice único parcial en DB. El service layer (`caja/service.py`) verifica antes de crear una apertura que no exista ya una caja abierta para la fecha actual. Si existe, rechaza la operación con un error.

**Razón**: Suficiente para el volumen del proyecto. Un índice único parcial en DB sería redundante y más complejo de mantener.

### D-09: Signo de MovimientoStock — control en service layer

**Decisión**: No se usan CHECK constraints en DB. El service layer (`stock/service.py`) asigna el signo según el tipo: `ingreso` → cantidad positiva, `venta`/`ajuste` → cantidad negativa. La DB almacena el valor tal cual lo recibe.

**Razón**: Mantiene la DB simple. La validación de negocio pertenece al service layer.

---

## ERD (Diagrama Entidad-Relación textual)

```
┌──────────────┐       ┌──────────────────┐
│   Categoria   │       │    Producto      │
│──────────────│       │──────────────────│
│ id (PK)      │──1:N──│ id (PK)          │
│ nombre (UQ)  │       │ nombre           │
│ created_at    │       │ precio_compra    │
│ updated_at    │       │ precio_venta     │
└──────────────┘       │ stock_actual     │
                       │ stock_minimo     │
                       │ unidad           │
                       │ activo           │
                       │ categoria_id (FK)│──N:1──┐
                       │ created_at       │       │
                       │ updated_at       │       │
                       └──────────────────┘       │
                               │ 1:N              │
                               ▼                  │
                       ┌──────────────────┐       │
                       │ MovimientoStock  │       │
                       │──────────────────│       │
                       │ id (PK)          │       │
                       │ producto_id (FK) │──N:1──┘
                       │ tipo (enum)      │
                       │ cantidad         │
                       │ fecha_hora       │
                       │ observacion      │
                       │ created_at       │
                       └──────────────────┘

┌──────────────┐       ┌──────────────────┐
│    Venta      │       │  DetalleVenta    │
│──────────────│       │──────────────────│
│ id (PK)      │──1:N──│ id (PK)          │
│ fecha_hora   │       │ venta_id (FK)    │──N:1──┐
│ total        │       │ producto_id (FK) │──N:1──┤
│ metodo_pago  │       │ cantidad         │       │
│ estado       │       │ precio_unitario  │       │
│ observacion  │       │ subtotal         │       │
│ created_at   │       │ created_at       │       │
│ updated_at   │       └──────────────────┘       │
└──────────────┘                                   │
                                                   │
┌──────────────┐                                   │
│     Caja      │                                  │
│──────────────│                                  │
│ id (PK)      │
│ fecha (UQ)   │
│ monto_inicial│
│ monto_final  │
│ estado       │
│ tot_efectivo │
│ tot_transf   │
│ tot_qr       │
│ tot_servicios│
│ observacion  │
│ created_at   │
│ updated_at   │
└──────────────┘

┌───────────────────┐       ┌───────────────────┐
│  InsumoServicio    │       │ MovimientoInsumo  │
│───────────────────│       │───────────────────│
│ id (PK)           │──1:N──│ id (PK)           │
│ nombre            │       │ insumo_id (FK)    │
│ stock_actual      │       │ tipo (enum)       │
│ unidad            │       │ cantidad          │
│ costo_unitario    │       │ fecha_hora        │
│ stock_minimo      │       │ observacion       │
│ paginas_por_ud    │       │ created_at        │
│ created_at        │       └───────────────────┘
│ updated_at        │
└───────────────────┘

┌───────────────────┐
│ RegistroServicio   │
│───────────────────│
│ id (PK)           │
│ fecha             │
│ tipo (enum)       │
│ descripcion       │
│ cantidad          │
│ ingreso_total     │
│ costo_insumos     │
│ ganancia          │
│ created_at        │
│ updated_at        │
└───────────────────┘
```

## Folder Structure (modelos por feature)

```
backend/app/features/
├── productos/
│   ├── models.py      ← Categoria, Producto
│   └── schemas.py     ← CategoriaCreate/Response, ProductoCreate/Response
├── ventas/
│   ├── models.py      ← Venta, DetalleVenta
│   └── schemas.py     ← VentaCreate/Response, DetalleVentaSchema
├── stock/
│   ├── models.py      ← MovimientoStock
│   └── schemas.py     ← MovimientoStockCreate/Response
├── caja/
│   ├── models.py      ← Caja
│   └── schemas.py     ← CajaCreate/Response, CajaCierre
├── insumos/
│   ├── models.py      ← InsumoServicio, MovimientoInsumo
│   └── schemas.py     ← InsumoCreate/Response, MovimientoInsumoCreate/Response
├── servicios/
│   ├── models.py      ← RegistroServicio
│   └── schemas.py     ← RegistroServicioCreate/Response
└── dashboard/
    ├── models.py      ← (sin modelos propios)
    └── schemas.py     ← (sin cambios)
```

## Riesgos y Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|:-----------:|:-------:|------------|
| Migración conflictiva con DB existente | Baja | Alto | Usar `alembic stamp head` si hay datos |
| Naming inconsistente (snake_case vs camelCase) | Media | Bajo | Convención estricta: snake_case en DB, camelCase en Pydantic |
| Circular imports entre modelos | Baja | Alto | Solo referencias FK por string ID, no importar modelos cruzados |
| Decimal precision loss en cálculos | Baja | Medio | Usar `Numeric(12, 2)` consistente en todos los campos monetarios |
| Enum values cambian en el futuro | Media | Medio | Usar `create_type=False` o migraciones Alembic para alterar enums |
