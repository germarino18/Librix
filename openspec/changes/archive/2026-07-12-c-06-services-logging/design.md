## Context

Librix tiene la tabla `RegistroServicio` creada por las migraciones de C-02, pero sin código que la gestione. El backend usa FastAPI + SQLAlchemy async con estructura feature-based en `backend/app/features/`. El frontend usa React + Vite + TypeScript con shadcn/ui y estructura feature-based en `frontend/src/features/`.

Los servicios se registran post-jornada (RN-08), no en tiempo real. La ganancia se calcula como `ingresoTotal - costoInsumos` (RN-09).

## Goals / Non-Goals

**Goals:**
- CRUD completo para RegistroServicio (listar con filtros, obtener por ID, crear, eliminar)
- Cálculo automático de ganancia en el backend (ingresoTotal - costoInsumos)
- Formulario dinámico en el frontend: campos varían según tipo de servicio (fotocopia, plastificado, souvenir, otro)
- Cálculo de ingreso automático para fotocopias (cantidad × precio por hoja)
- Listado de servicios del día con totales
- UI en español

**Non-Goals:**
- F-18 (acumulación de costo de insumos por servicio) — se asume costoInsumos ingresado manualmente por el operador
- F-19 (estimación de páginas restantes por cartucho) — diferido
- Integración con módulo de caja (F-28) — diferido a C-07
- Actualización de servicios (PUT) — solo crear y eliminar por ahora

## Decisions

1. **Cálculo de ganancia en backend (no frontend)**: El endpoint POST calcula `ganancia = ingresoTotal - costoInsumos` antes de persistir. El frontend muestra una preview en tiempo real pero el backend es la fuente de verdad. Alternativa considerada: calcular solo en frontend — rechazada por riesgo de inconsistencias.

2. **costoInsumos como campo manual**: Por ahora el operador ingresa el costo de insumos manualmente (o deja 0). No se descuenta automáticamente del stock de insumos (F-18 está diferido). Esto simplifica el MVP y evita dependencia circular con C-05.

3. **Fotocopia: precio por hoja hardcodeado en backend**: El precio unitario por hoja de fotocopia se define como constante en el backend (ej: $50/hoja). El frontend lo consume para calcular el ingreso en tiempo real. Alternativa: configurable desde UI — rechazada para MVP por complejidad innecesaria.

4. **Plastificado: tipos frecuentes hardcodeados**: Los tipos frecuentes de plastificado (A4, A5, 10×15, etc.) con sus precios se definen como constantes en el backend. El frontend los muestra como selector. Alternativa: ABM de tipos frecuentes — rechazada por ser over-engineering para MVP.

5. **Hard delete para servicios**: Dado que es un sistema pequeño, se permite eliminar registros de servicio. No se necesita soft-delete.

6. **Sin paginación**: Se esperan pocos servicios por día (< 100). El listado retorna todos los registros filtrados sin paginación.

7. **Fecha como date, no datetime**: El campo `fecha` es tipo `date` (no datetime), ya que el servicio se registra por día completo post-jornada.

## Risks / Trade-offs

- [Hard delete] Servicios eliminados no se pueden recuperar. Mitigación: confirmación antes de eliminar, acceptable para MVP.
- [Precio hardcodeado] Si el precio por hoja cambia, hay que modificar código. Mitigación: aceptable para MVP; se puede hacer configurable después.
- [costoInsumos manual] Riesgo de que el operador olvide descontar insumos. Mitigación: el campo es opcional y default 0; se puede mejorar con F-18 después.
