# 10 — Preguntas Abiertas

## Alta prioridad

| # | Pregunta | Contexto |
|---|----------|----------|
| P-01 | ¿Hay producto/servicio con precio variable o todos son fijos? | El README dice "precio fijo" para productos, confirmar si hay excepciones |
| P-02 | ¿Las fotocopias tienen un precio por hoja fijo o varía (blanco/negro vs color)? | Afecta el cálculo automático de ingreso |
| P-03 | ¿La caja se abre y cierra todos los días, o hay días sin movimiento? | Para saber si forzar apertura o permitir saltear |

## Media prioridad

| # | Pregunta | Contexto |
|---|----------|----------|
| P-04 | ¿Quieren sonido al cobrar (como un TING al confirmar venta)? | Detalle UX que puede sumar en hora pico |
| P-05 | ¿Necesitan imprimir comprobante/ticket? | Si sí, requiere manejo de impresora térmica o PDF |
| P-06 | El nombre "Librix" es definitivo? | Es el nombre del proyecto, confirmar si es la marca real |

## Resueltas (decisiones tomadas en sesión)

- PocketBase → **standalone** en Windows
- Desktop-first → sí, mobile después
- Mercado Pago → solo selección manual, sin integración
