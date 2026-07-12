## Context

Librix es un sistema de gestión para librería/copistería. Actualmente la feature `caja/` tiene models.py y schemas.py funcionales (con migración en Alembic), pero repository.py y service.py son placeholders vacíos, el router.py tiene solo el prefijo y un comment placeholder, y el router NO está registrado en main.py. El frontend tiene una CajaPage.tsx placeholder.

Las entidades relacionadas (Venta con MetodoPago/EstadoVenta, RegistroServicio con ganancia) ya existen y funcionan. La ruta `/caja` ya está en App.tsx y Layout.tsx.

## Goals / Non-Goals

**Goals:**
- Implementar el ciclo completo de apertura y cierre de caja diaria
- Calcular automáticamente totales por método de pago desde ventas completadas del día
- Calcular total de servicios desde la ganancia de registros de servicio del día
- Validar que no exista más de una caja abierta por día (RN-06)
- Mostrar historial de cierres anteriores con paginación
- UI responsiva con shadcn/ui que muestre estado actual y permita acciones

**Non-Goals:**
- No se implementa RN-07 (verificar caja abierta antes de registrar ventas) — eso es C-04
- No se modifica el modelo Caja existente (ya tiene todos los campos necesarios)
- No se crean migraciones nuevas (la tabla `cajas` ya existe)
- No se implementa el dashboard de ganancias (C-08)
- No se implementa conciliación ni arqueo de caja

## Decisions

### D1: Totales calculados server-side, no client-side

**Decisión**: El endpoint de cierre (`POST /api/caja/cerrar`) calcula todos los totales automáticamente consultando ventas y servicios del día. El cliente solo envía `observacion`.

**Razón**: Evita inconsistencias si el frontend calcula mal. Centraliza la lógica de negocio en el backend. Reduce tráfico de red (no necesita enviar 4 totales separados).

**Alternativa descartada**: Enviar totales calculados desde el frontend — riesgo de desacuerdo entre cliente y servidor.

### D2: Schema CajaCierre simplificado

**Decisión**: Modificar `CajaCierre` para que solo acepte `observacion`. Los campos `monto_final`, `total_efectivo`, `total_transferencia`, `total_qr`, `total_servicios` se calculan en el service.

**Razón**: Consistente con D1. El schema de entrada del cierre es liviano.

### D3: Repository pattern igual a servicios

**Decisión**: Seguir exactamente el patrón de `servicios/repository.py` — clase con `__init__(session)`, métodos `list_all`, `get_by_id`, `create`, etc.

**Razón**: Consistencia con el código existente. El equipo ya conoce este patrón.

### D4: Paginación cursor-based para historial

**Decisión**: Usar paginación offset/limit simple (no cursor) para el historial de cierres. El endpoint `GET /api/caja/historial` acepta `skip` y `limit` query params.

**Razón**: La tabla de cajas será pequeña (un registro por día). Offset/limit es suficiente y más simple.

### D5: Frontend con TanStack Query + estado local

**Decisión**: Usar `useQuery` para caja actual e historial, `useMutation` para apertura y cierre. Estado local con `useState` para modales.

**Razón**: Consistente con el patrón de servicios y ventas. Ya está establecido en el proyecto.

### D6: La apertura usa POST, no PUT

**Decisión**: `POST /api/caja/abrir` crea un nuevo registro Caja. No se usa PUT porque es una creación, no actualización.

**Razón**: RESTful convention. La apertura crea una entidad nueva.

## Risks / Trade-offs

- **[Race condition en apertura]** → Mitigación: Usar transacción con `SELECT ... FOR UPDATE` o validación con query en el service antes de insertar. Dos requests simultáneos no deberían crear dos cajas abiertas para el mismo día.
- **[Ventas del día fuera de horario]** → Las ventas con `fecha_hora` del día natural se incluyen. Si el operador cierra la caja al día siguiente, las ventas del día anterior ya no se contarán. Esto es aceptable porque el cierre es siempre del día actual.
- **[Servicios sin ganancia]** → Un servicio con `ganancia = 0` aporta 0 al total. Esto es correcto y esperado.
- **[Caja cerrada no editable]** → Una vez cerrada, la caja no se puede reabrir. Esto es intencional por simplicidad del MVP.
