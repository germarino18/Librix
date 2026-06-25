# 04 — Modelo de Datos

## Entidades

### Categoria
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| nombre | text | Obligatorio, único |

### Producto
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| nombre | text | Obligatorio |
| precioCompra | number | Precio de costo |
| precioVenta | number | Precio de venta al público |
| stockActual | number | Stock disponible |
| stockMinimo | number | Mínimo antes de alerta |
| unidad | text | Unidad de medida: "unidad", "paquete", etc. |
| activo | bool | Baja lógica (true/false) |
| categoria_id | relation → Categoria | |

### Venta
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| fechaHora | datetime | Auto-set al crear |
| total | number | Suma de subtotales |
| metodoPago | select | "efectivo", "transferencia", "qr_mercadopago" |
| estado | select | "completada", "cancelada" |
| observacion | text | Opcional |

### DetalleVenta
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| venta_id | relation → Venta | |
| producto_id | relation → Producto | |
| cantidad | number | |
| precioUnitario | number | Precio al momento de la venta |
| subtotal | number | cantidad × precioUnitario |

### MovimientoStock
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| producto_id | relation → Producto | |
| tipo | select | "ingreso", "venta", "ajuste" |
| cantidad | number | Positivo para ingreso, negativo para venta |
| fechaHora | datetime | |
| observacion | text | Opcional, útil en ajustes |

### Caja
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| fecha | date | |
| montoInicial | number | |
| montoFinal | number | Calculado al cierre |
| estado | select | "abierta", "cerrada" |
| totalEfectivo | number | Total de ventas en efectivo |
| totalTransferencia | number | Total de ventas por transferencia |
| totalQR | number | Total de ventas por QR |
| totalServicios | number | Ingresos por servicios del día |
| observacion | text | Opcional |

### InsumoServicio
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| nombre | text | Ej: "Resma A4", "Tóner HP 123" |
| stockActual | number | |
| unidad | text | "unidad", "resma", "cartucho" |
| costoUnitario | number | Costo por unidad |
| stockMinimo | number | |
| paginasPorUnidad | number | Solo para tóner (rendimiento estimado) |

### MovimientoInsumo
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| insumoServicio_id | relation → InsumoServicio | |
| tipo | select | "ingreso", "consumo" |
| cantidad | number | |
| fechaHora | datetime | |
| observacion | text | Opcional |

### RegistroServicio
| Campo | Tipo | Notas |
|-------|------|-------|
| id | text (PK) | Auto-generado |
| fecha | date | |
| tipo | select | "fotocopia", "plastificado", "souvenir", "otro" |
| descripcion | text | |
| cantidad | number | |
| ingresoTotal | number | |
| costoInsumos | number | Opcional (0 si no aplica) |
| ganancia | number | ingresoTotal - costoInsumos |

## Relaciones principales

```
Categoria 1──N Producto
Producto  1──N DetalleVenta
Venta     1──N DetalleVenta
Producto  1──N MovimientoStock
InsumoServicio 1──N MovimientoInsumo
```
