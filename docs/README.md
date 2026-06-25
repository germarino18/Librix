# Librería App — Sistema de Gestión para Librería Universitaria

## Descripción del negocio

Librería y papelería ubicada en una facultad. Vende productos de precio fijo (cuadernos, lapiceras, gomas, resaltadores, etc.) y ofrece servicios de precio variable (fotocopias, impresiones, plastificados, souvenirs). Es atendida por la dueña y sus hijos. No hay sistema de usuarios ni roles — todos operan con el mismo acceso.

El negocio tiene dos momentos muy distintos durante el día:
- **Mañana y siesta:** poco movimiento, se pueden hacer tareas administrativas con calma.
- **A partir de las 19hs:** alto volumen de clientes, el sistema tiene que ser extremadamente rápido y simple de operar.

Actualmente usan Excel solo para precios. El stock se controla mentalmente. El objetivo de esta app es reemplazar ese flujo con algo práctico, centralizado y que les dé visibilidad real de ganancias.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|---|
| Frontend | React + Vite + TypeScript + PWA |
| UI | shadcn/ui + Tailwind CSS v4 |
| Backend | FastAPI + SQLAlchemy + Alembic |
| Base de datos | PostgreSQL |
| Acceso desde celular | PWA — accesible por WiFi de la red local |

El sistema corre en la PC del local. Los celulares se conectan por WiFi local. No depende de internet externo para funcionar.

El frontend React se sirve como SPA standalone (Vite dev server en desarrollo, build estático en producción). La API REST de FastAPI corre en un servidor Uvicorn separado.

---

## Módulos del sistema

### 1. Ventas (pantalla principal)

Pantalla de carga de ventas ultra rápida, diseñada para hora pico.

- Buscador de productos con una palabra
- Grilla de productos frecuentes como accesos directos (sin buscar)
- Un toque para agregar producto a la venta
- Edición rápida de cantidad
- Visualización del total en tiempo real
- Selección de método de pago: **Efectivo / Transferencia / QR Mercado Pago**
- Botón de cobrar grande y visible
- Al confirmar la venta: descuenta stock automáticamente y registra movimiento

Estados de venta: `COMPLETADA`, `CANCELADA`.

### 2. Stock de productos

ABM completo de productos y categorías.

- Listado de productos con filtro por categoría y búsqueda por nombre
- Alta, edición y baja lógica de productos (`activo: true/false`)
- Cada producto tiene: nombre, categoría, precio de compra, precio de venta, stock actual, stock mínimo, unidad de medida
- Alertas visuales cuando el stock actual está por debajo del stock mínimo
- Historial de movimientos por producto

Tipos de movimiento de stock: `INGRESO` (compra de mercadería), `VENTA` (automático al cobrar), `AJUSTE` (corrección manual).

### 3. Insumos de servicios

Gestión separada de los insumos usados para fotocopias e impresiones (no son productos de venta).

- ABM de insumos: resmas de papel, cartuchos de toner, etc.
- Registro de ingresos (cuándo se compró y a qué costo)
- Registro de consumo diario
- Costo acumulado de insumos consumidos
- Estimación de páginas restantes por cartucho de toner (basado en rendimiento configurado)
- Alerta de insumo bajo

### 4. Registro post-jornada de servicios variables

Pantalla de carga rápida al final del día, cuando hay calma. Registra los servicios que no se pueden cargar en tiempo real.

**Fotocopias:**
- Cantidad de hojas copiadas en el día (el sistema calcula el ingreso estimado con precio por hoja configurado)
- Cálculo automático de ganancia: ingreso del día menos costo de insumos consumidos

**Plastificados:**
- Listado de servicios frecuentes guardados (Plastificado A4, Plastificado A3, etc.)
- Cantidad e ingreso por servicio
- Opción de agregar servicio nuevo

**Souvenirs y otros:**
- Descripción libre o selección de tipo frecuente
- Ingreso total del servicio

Todo queda registrado con fecha y disponible para reportes.

### 5. Caja diaria

- Apertura de caja con monto inicial
- Cierre de caja al final del día
- Totales por método de pago (efectivo, transferencia, QR)
- Resumen de ventas del día (productos)
- Resumen de servicios del día (fotocopias, plastificados, souvenirs)
- Historial de cierres por fecha

### 6. Dashboard de ganancias

Vista central de rentabilidad del negocio.

- **Ganancia por productos:** (precioVenta - precioCompra) × cantidad vendida
- **Ganancia por servicios:** ingreso registrado - costo de insumos consumidos
- **Ganancia total:** suma de ambas
- Filtros por día, semana y mes
- Productos más vendidos
- Servicios con mejor margen
- Productos con stock bajo (panel de alertas)

---

## Modelo de datos

```
Categoria
  id, nombre

Producto
  id, nombre, precioCompra, precioVenta,
  stockActual, stockMinimo, unidad,
  activo, categoria_id

Venta
  id, fechaHora, total, metodoPago,
  estado, observacion

DetalleVenta
  id, venta_id, producto_id,
  cantidad, precioUnitario, subtotal

MovimientoStock
  id, producto_id, tipo (INGRESO / VENTA / AJUSTE),
  cantidad, fechaHora, observacion

InsumoServicio
  id, nombre, stockActual, unidad,
  costoUnitario, stockMinimo, paginasPorUnidad (nullable)

MovimientoInsumo
  id, insumoServicio_id, tipo (INGRESO / CONSUMO),
  cantidad, fechaHora, observacion

RegistroServicio
  id, fecha, tipo (FOTOCOPIA / PLASTIFICADO / SOUVENIR / OTRO),
  descripcion, cantidad, ingresoTotal, costoInsumos, ganancia
```

---

## Consideraciones de UX

- La pantalla de ventas es la más importante: tiene que funcionar con una sola mano desde el celular en hora pico.
- Los productos más vendidos deben aparecer primero o como accesos directos sin buscar.
- Todo botón de acción principal (Cobrar, Guardar, Confirmar) debe ser grande y visible.
- El sistema debe verse bien y funcionar correctamente tanto en PC como en celular (responsive).
- Los colores de alerta de stock bajo deben ser inmediatamente visibles en el listado.
- La app debe funcionar aunque la conexión a internet externa falle — depende solo de la red local.

---

## Fases de desarrollo sugeridas

**Fase 1 — MVP core**
Setup del proyecto, ABM de productos y categorías, pantalla de ventas básica con descuento de stock automático.

**Fase 2 — Completar ventas y caja**
Métodos de pago, estados de venta, apertura y cierre de caja diaria, historial.

**Fase 3 — Insumos y servicios**
ABM de insumos, movimientos, registro post-jornada de fotocopias, plastificados y souvenirs.

**Fase 4 — Dashboard y reportes**
Ganancias por producto y servicio, alertas de stock, productos más vendidos, filtros por período.

**Fase 5 — Pulido**
Ajustes según feedback real de uso, optimizaciones de velocidad en pantalla de ventas, accesos directos configurables.
