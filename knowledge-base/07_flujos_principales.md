# 07 — Flujos Principales

## Flujo 1: Venta de productos (hora pico)

```
1. Operador abre la app → pantalla de ventas (/)
2. Opción A: Toca un producto frecuente en la grilla
   Opción B: Escribe nombre en buscador → selecciona resultado
3. Producto aparece en el detalle de venta con cantidad = 1
4. (Opcional) Ajusta cantidad con +/- o escribiendo el número
5. Al final: selecciona método de pago (Efectivo / Transferencia / QR MP)
6. Toca "Cobrar"
7. Sistema: guarda Venta + DetalleVenta + descuenta stock (MovimientoStock tipo "venta")
8. Vuelve a pantalla de ventas limpia
```

## Flujo 2: Apertura y cierre de caja

### Apertura (mañana)
```
1. Operador va a Caja (/caja)
2. Toca "Abrir caja"
3. Ingresa monto inicial (ej: plata chica del día anterior)
4. Sistema: crea registro Caja con estado "abierta"
```

### Cierre (post-jornada, después de servicios)
```
1. Operador va a Caja (/caja)
2. Toca "Cerrar caja"
3. Sistema: muestra totales por método de pago + servicios
4. Operador confirma
5. Sistema: cierra la caja, calcula montoFinal
```

## Flujo 3: ABM de producto

```
1. Operador va a Productos (/productos)
2. Ve listado con filtros (categoría, búsqueda)
3. Toca "Nuevo producto"
4. Completa: nombre, categoría, precios, stock inicial, stock mínimo, unidad
5. Guarda → producto activo por defecto
```

## Flujo 4: Registro post-jornada de servicios

```
1. Fin del día, local cerrado
2. Operador va a Servicios (/servicios)
3. Selecciona tipo: Fotocopia / Plastificado / Souvenir / Otro
4. Fotocopia: ingresa cantidad de hojas → sistema calcula ingreso
5. Plastificado: selecciona tipo frecuente + cantidad
6. Souvenir: descripción libre + ingreso total
7. Guarda → sistema calcula ganancia (ingreso - costo insumos)
```

## Flujo 5: Dashboard - ver ganancias

```
1. Operador va a Dashboard (/dashboard)
2. Ve tarjetas: ganancia productos, ganancia servicios, ganancia total
3. Filtra por día / semana / mes
4. Ve tabla de productos más vendidos
5. Ve alertas de stock bajo
```
