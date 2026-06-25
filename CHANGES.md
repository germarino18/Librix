# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librix**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 foundation-setup
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

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 foundation-setup              (solo)

GATE 1: C-01 ✓
  → C-02 schema-definition             (solo)

GATE 2: C-02 ✓                         ← PRIMER FORK (2 paralelos)
  → C-03 product-catalog              [Agente A]
  → C-05 supplies-management          [Agente B]

GATE 3: C-03 ✓ + C-05 ✓               ← SEGUNDO FORK (3 paralelos)
  → C-04 sales-screen                 [Agente A]
  → C-06 services-logging             [Agente B]
  → C-09 stock-history                [Agente C]

GATE 4: C-04 ✓ + C-06 ✓               ← MERGE
  → C-07 cash-register                [Agente A — si C-04 ✓ y C-06 ✓]

GATE 5: C-07 ✓
  → C-08 profit-dashboard             [Agente C]
```

### Camino crítico (6 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-07 → C-08
```
ó:
```
C-01 → C-02 → C-05 → C-06 → C-07 → C-08
```

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Domain)        │ Agente B (Operations)     │ Agente C (Analytics)
─────┼──────────────────────────┼───────────────────────────┼────────────────────────────
  1  │ C-01 foundation-setup    │          —                │          —
  2  │ C-02 schema-definition   │          —                │          —
  3  │ C-03 product-catalog     │ C-05 supplies-management  │          —
  4  │ C-04 sales-screen        │ C-06 services-logging     │ C-09 stock-history
  5  │ C-07 cash-register       │          —                │          —
  6  │          —               │          —                │ C-08 profit-dashboard
```

---

## FASE 0 — Fundamentos

> Proyecto vacío → estructura, dependencias, y schema de base de datos. Sin esto no hay nada.

### [C-01] `foundation-setup`
- **Estado**: `[ ]` pendiente
- **Scope**: Scaffolding completo del proyecto + infraestructura base
  - `frontend/`: Vite + React + TypeScript + Tailwind + shadcn/ui (init con botones, inputs, tablas, modales)
  - `pocketbase/`: binario descargado + `pb_data/` en `.gitignore`
  - `openspec/`: inicializado con `openspec init`
  - Variables de entorno: `VITE_PB_URL` con default `http://localhost:8090`
  - `package.json` raíz con scripts dev, build, preview
  - Convención de estructura: `src/components`, `src/pages`, `src/lib`, `src/hooks`, `src/services`
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Stack
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios
  - `knowledge-base/08_arquitectura_propuesta.md` §Variables de entorno

### [C-02] `schema-definition`
- **Estado**: `[ ]` pendiente
- **Scope**: Definición de todas las colecciones de PocketBase con campos, relaciones y reglas de acceso público
  - Colección `Categoria`: id, nombre (único)
  - Colección `Producto`: id, nombre, precioCompra (number), precioVenta (number), stockActual (number), stockMinimo (number), unidad (text), activo (bool), categoria_id (relation → Categoria)
  - Colección `Venta`: id, fechaHora (autoset), total (number), metodoPago (select: efectivo/transferencia/qr_mercadopago), estado (select: completada/cancelada), observacion (text)
  - Colección `DetalleVenta`: id, venta_id (relation → Venta), producto_id (relation → Producto), cantidad (number), precioUnitario (number), subtotal (number)
  - Colección `MovimientoStock`: id, producto_id (relation → Producto), tipo (select: ingreso/venta/ajuste), cantidad (number), fechaHora (autoset), observacion (text)
  - Colección `Caja`: id, fecha (date), montoInicial (number), montoFinal (number), estado (select: abierta/cerrada), totalEfectivo (number), totalTransferencia (number), totalQR (number), totalServicios (number), observacion (text)
  - Colección `InsumoServicio`: id, nombre, stockActual (number), unidad (text), costoUnitario (number), stockMinimo (number), paginasPorUnidad (number, solo tóner)
  - Colección `MovimientoInsumo`: id, insumoServicio_id (relation → InsumoServicio), tipo (select: ingreso/consumo), cantidad (number), fechaHora (autoset), observacion (text)
  - Colección `RegistroServicio`: id, fecha (date), tipo (select: fotocopia/plastificado/souvenir/otro), descripcion (text), cantidad (number), ingresoTotal (number), costoInsumos (number, default 0), ganancia (number)
  - Reglas de seguridad: todas las colecciones en permisos público (sin auth) con full CRUD
- **Dependencias**: C-01
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` (todas las entidades)
  - `knowledge-base/08_arquitectura_propuesta.md` §Conexión con PocketBase
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad

---

## FASE 1 — Catálogo de Productos

### [C-03] `product-catalog`
- **Estado**: `[ ]` pendiente
- **Scope**: ABM de categorías y productos con filtros, búsqueda y alertas de stock
  - Página `/productos` con listado de productos (tabla con paginación)
  - Filtro por categoría (select) + búsqueda por nombre (text input)
  - ABM Categorías: modal/formulario con campo nombre
  - ABM Productos: modal con nombre, categoría (select), precioCompra, precioVenta, stockActual, stockMinimo, unidad, activo (toggle)
  - Baja lógica: toggle activo/inactivo con confirmación
  - Productos inactivos no aparecen en ventas ni búsquedas de ventas (RN-03)
  - Alerta visual de stock bajo: fondo rojo/naranja cuando stockActual < stockMinimo (RN-02)
  - Validaciones: nombre obligatorio, precios > 0, stockActual >= 0
  - Llamadas a PocketBase API via `src/services/products.ts` y `src/services/categories.ts`
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Categoria, §Producto
  - `knowledge-base/06_funcionalidades.md` §Épica 2
  - `knowledge-base/07_flujos_principales.md` §Flujo 3
  - `knowledge-base/05_reglas_de_negocio.md` §RN-02, RN-03

---

## FASE 2 — Punto de Venta

> El corazón del sistema. Una pantalla única, rápida, diseñada para hora pico.

### [C-04] `sales-screen`
- **Estado**: `[ ]` pendiente
- **Scope**: Pantalla de ventas rápida con carrito, descuento de stock y métodos de pago
  - Ruta `/` (raíz) como pantalla de ventas (layout full-height)
  - Buscador de productos por nombre (una palabra, resultados inline mientras escribe)
  - Grilla de productos frecuentes como accesos directos (basada en frecuencia de ventas)
  - Agregar producto al carrito con un toque (desde buscador o grilla)
  - Edición de cantidad: botones +/- y entrada manual
  - Total en tiempo real (suma de subtotales del carrito)
  - Selector de método de pago: Efectivo / Transferencia / QR Mercado Pago (tres botones visuales)
  - Botón "Cobrar" grande y visible (color primario, con icono)
  - Validación: no permitir cobrar carrito vacío (RN-04)
  - Al cobrar: guardar Venta + DetalleVenta + descontar stock (MovimientoStock tipo "venta") (RN-01)
  - Botón "Cancelar venta": limpia el carrito, si ya se descontó stock se revierte (RN-05)
  - Vuelve a pantalla limpia después de cobrar
  - Estado de venta via Context API (carrito, total, método seleccionado)
  - Llamadas a PocketBase API via `src/services/sales.ts`
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §DetalleVenta, §MovimientoStock
  - `knowledge-base/06_funcionalidades.md` §Épica 1
  - `knowledge-base/07_flujos_principales.md` §Flujo 1
  - `knowledge-base/05_reglas_de_negocio.md` §RN-01, RN-04, RN-05

---

## FASE 3 — Insumos y Servicios Post-Jornada

> Gestión de insumos para servicios de librería (fotocopias, impresiones, plastificado) más el registro al final del día.

### [C-05] `supplies-management`
- **Estado**: `[ ]` pendiente
- **Scope**: ABM de insumos de servicios con registro de ingresos y consumos
  - Página `/insumos` con listado de insumos (tabla)
  - ABM Insumos: modal con nombre, unidad, costoUnitario, stockActual, stockMinimo, paginasPorUnidad (solo visible si aplica)
  - Registro de ingreso: modal tipo "ingreso" que incrementa stockActual
  - Registro de consumo diario: modal tipo "consumo" que decrementa stockActual
  - Costo acumulado de insumos consumidos (suma de cantidad × costoUnitario en movimientos tipo "consumo")
  - Alerta visual de insumo bajo: cuando stockActual < stockMinimo
  - Historial de movimientos por insumo (lista de MovimientoInsumo)
  - Llamadas a PocketBase via `src/services/supplies.ts`
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §InsumoServicio, §MovimientoInsumo
  - `knowledge-base/06_funcionalidades.md` §Épica 3

### [C-06] `services-logging`
- **Estado**: `[ ]` pendiente
- **Scope**: Registro post-jornada de servicios con cálculo automático de ganancia
  - Página `/servicios` con formulario según tipo de servicio
  - Selector de tipo: Fotocopia / Plastificado / Souvenir / Otro (cambia campos del formulario)
  - Fotocopia: input cantidad de hojas + precioPorHoja → cálculo automático de ingresoTotal
  - Plastificado: listado de tipos frecuentes predefinidos (select) + cantidad → ingresoTotal auto
  - Souvenir: descripción libre + ingresoTotal manual
  - Cálculo automático de ganancia: ingresoTotal - costoInsumos (RN-09)
  - Campo opcional costoInsumos (selección desde insumos registrados en C-05)
  - Guardar RegistroServicio con fecha, tipo, descripcion, cantidad, ingresoTotal, costoInsumos, ganancia
  - RN-08: Servicios se registran post-jornada, no en tiempo real (no hay integración con ventas)
  - Llamadas a PocketBase via `src/services/services.ts`
- **Dependencias**: C-05 (para referenciar costo de insumos), C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §RegistroServicio
  - `knowledge-base/06_funcionalidades.md` §Épica 4
  - `knowledge-base/07_flujos_principales.md` §Flujo 4
  - `knowledge-base/05_reglas_de_negocio.md` §RN-08, RN-09

---

## FASE 4 — Caja Diaria y Dashboard de Ganancias

> Cierre financiero del día + visibilidad de rentabilidad.

### [C-07] `cash-register`
- **Estado**: `[ ]` pendiente
- **Scope**: Apertura y cierre de caja diaria con totales por método de pago y servicios
  - Página `/caja` con estado actual (abierta/cerrada) y acciones
  - Apertura: formulario con montoInicial → crea Caja con estado "abierta" (RN-06: máximo una abierta por día)
  - Cierre: muestra resumen con totales (totalEfectivo, totalTransferencia, totalQR desde ventas completadas del día, totalServicios desde registros del día)
  - Al cerrar: confirma, calcula montoFinal, cambia estado a "cerrada"
  - Venta con estado "cancelada" no aporta a totales de caja (RN-10)
  - Historial de cierres anteriores por fecha (lista de cajas cerradas)
  - Validaciones: no abrir si ya hay una abierta hoy, no registrar ventas si no hay caja abierta (RN-07 — check simple contra API)
  - Llamadas a PocketBase via `src/services/cash-register.ts`
- **Dependencias**: C-04, C-06
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Caja
  - `knowledge-base/06_funcionalidades.md` §Épica 5
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/05_reglas_de_negocio.md` §RN-06, RN-07, RN-10

### [C-08] `profit-dashboard`
- **Estado**: `[ ]` pendiente
- **Scope**: Dashboard con tarjetas de ganancia y filtros temporales
  - Ruta `/dashboard` con layout de tarjetas (shadcn/ui Card)
  - Tarjeta "Ganancia por productos": Σ((precioVenta - precioCompra) × cantidad) en ventas completadas del período (F-30)
  - Tarjeta "Ganancia por servicios": Σ(ganancia) de RegistroServicio del período (F-31)
  - Tarjeta "Ganancia total": suma de ambas (F-32)
  - Filtros: botones Día / Semana / Mes que recalculan todas las tarjetas (F-33)
  - Tabla "Productos más vendidos": top N por cantidad vendida (F-34)
  - Panel "Alertas de stock bajo": productos con stockActual < stockMinimo (F-36)
  - Servicios con mejor margen: tabla de servicios ordenados por ganancia descendente (F-35, baja prioridad — implementación simple)
  - Ventas canceladas excluidas de todos los cálculos (RN-10)
  - Llamadas a PocketBase via `src/services/dashboard.ts` (agregaciones)
- **Dependencias**: C-07 (caja + ventas + servicios existen)
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 6
  - `knowledge-base/07_flujos_principales.md` §Flujo 5
  - `knowledge-base/05_reglas_de_negocio.md` §RN-10

---

## FASE 5 — Historial y Complementos

> Funcionalidades de media/baja prioridad que completan el sistema.

### [C-09] `stock-history`
- **Estado**: `[ ]` pendiente
- **Scope**: Historial de movimientos de stock por producto + páginas restantes de tóner
  - En página `/productos`: botón "Historial" por producto → modal con lista de MovimientoStock
  - Cada movimiento muestra: fecha, tipo (ingreso/venta/ajuste), cantidad, observación
  - Filtro por tipo de movimiento
  - En `/insumos`: para insumos con `paginasPorUnidad > 0`, mostrar estimación de páginas restantes = stockActual × paginasPorUnidad (F-19)
  - Llamadas a PocketBase via `src/services/stock.ts`
- **Dependencias**: C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §MovimientoStock, §InsumoServicio
  - `knowledge-base/06_funcionalidades.md` §F-14, §F-19

---

## Resumen

| Change | Nombre | Dependencias | Governance | Fase |
|--------|--------|-------------|------------|------|
| C-01 | foundation-setup | — | BAJO | Fundamentos |
| C-02 | schema-definition | C-01 | CRITICO | Fundamentos |
| C-03 | product-catalog | C-02 | BAJO | Catálogo |
| C-04 | sales-screen | C-03 | MEDIO | Punto de Venta |
| C-05 | supplies-management | C-02 | BAJO | Insumos y Servicios |
| C-06 | services-logging | C-05, C-02 | BAJO | Insumos y Servicios |
| C-07 | cash-register | C-04, C-06 | MEDIO | Caja y Dashboard |
| C-08 | profit-dashboard | C-07 | MEDIO | Caja y Dashboard |
| C-09 | stock-history | C-03 | BAJO | Historial |

**Total**: 9 changes · 5 fases · 6 cambios en camino crítico · 3 gates de paralelismo

**Primer change recomendado**: `C-01 foundation-setup` — sin dependencias, desbloquea todo.

Para arrancar: `/opsx:propose C-01-foundation-setup`
