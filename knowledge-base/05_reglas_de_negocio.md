# 05 — Reglas de Negocio

Código de reglas: `RN-XX` (Regla de Negocio).

| Código | Regla | Aplica en |
|--------|-------|-----------|
| RN-01 | Al confirmar una venta, el stock de cada producto se descuenta automáticamente | Ventas |
| RN-02 | Si stockActual < stockMinimo, se muestra alerta visual en el listado de productos | Stock |
| RN-03 | Un producto con `activo: false` no aparece en la pantalla de ventas ni en búsquedas | Ventas, Stock |
| RN-04 | No se puede cobrar una venta vacía (sin productos) | Ventas |
| RN-05 | Una venta cancelada no descuenta stock (si ya se descontó, se revierte) | Ventas |
| RN-06 | No puede haber más de una caja abierta por día | Caja |
| RN-07 | La caja del día debe estar abierta para registrar ventas | Caja, Ventas |
| RN-08 | Los servicios se registran post-jornada, no en tiempo real | Servicios |
| RN-09 | El costo de insumos consumidos se descuenta del ingreso del servicio para calcular ganancia | Servicios |
| RN-10 | Una venta con estado "cancelada" no aporta a los totales de caja ni al dashboard | Dashboard |

## Reglas de visualización

- Los productos más vendidos aparecen como accesos directos en la pantalla de ventas
- Los botones de acción principal (Cobrar, Guardar, Confirmar) deben ser grandes y visibles
- Alertas de stock bajo con colores llamativos (ej: rojo/naranja)
