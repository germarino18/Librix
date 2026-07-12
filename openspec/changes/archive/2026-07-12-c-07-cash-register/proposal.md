## Why

El sistema no tiene forma de gestionar el ciclo de vida de la caja diaria. Los operadores no pueden registrar la apertura con un monto inicial, ni cerrar la caja al final de la jornada con los totales desglosados por método de pago. Sin esto, no hay forma de conciliar el dinero físico con las ventas y servicios registrados, lo cual es esencial para la operación diaria de la librería/copistería.

## What Changes

- **Backend**: Implementar repository, service y router completos para la feature caja (actualmente placeholders). Registrar el router en `main.py`. Los endpoints calculan automáticamente totales desde ventas completadas y servicios del día.
- **Frontend**: Reemplazar la página placeholder de `/caja` con una interfaz completa que muestre el estado actual de la caja (abierta/cerrada), permita apertura y cierre, y muestre el historial de cierres.
- **Schemas**: Actualizar `CajaCierre` para que solo reciba `observacion` (los totales se calculan server-side). Agregar schema de respuesta paginada para historial.
- **API**: 5 endpoints nuevos bajo `/api/caja/`.

## Capabilities

### New Capabilities

- `cash-register`: Apertura y cierre de caja diaria con cálculo automático de totales por método de pago, validación de una sola caja abierta por día, y historial de cierres.

### Modified Capabilities

_(ninguna — los specs existentes de `fastapi-backend` y `api-client` no cambian a nivel de requerimiento)_

## Impact

- **Backend**: `backend/app/features/caja/` — repository.py, service.py, router.py, schemas.py. `backend/app/main.py` — registrar router de caja.
- **Frontend**: `frontend/src/features/caja/` — CajaPage.tsx, components/, hooks/, api/, types/.
- **Dependencias**: Requiere ventas (C-04) y servicios (C-06) funcionando para que los totales se calculen correctamente.
- **API**: 5 endpoints nuevos, sin cambios a endpoints existentes.
