## Why

Librix necesita registrar los servicios realizados al final de la jornada (fotocopias, plastificados, souvenirs) para calcular la ganancia real del día. Actualmente no hay forma de registrar estos ingresos post-jornada, lo que impide un cierre de caja completo y un dashboard de ganancias preciso.

## What Changes

- **F-21 — Carga de fotocopias**: El operador ingresa cantidad de hojas y el sistema calcula el ingreso automáticamente (precio fijo por hoja)
- **F-22 — Listado de servicios de plastificado frecuentes**: Selector de tipos frecuentes de plastificado con cálculo automático de ingreso
- **F-23 — Registro de souvenirs con descripción libre**: Campo de descripción libre + ingreso total manual
- **F-24 — Cálculo automático de ganancia**: El sistema calcula ganancia = ingresoTotal - costoInsumos (RN-09) al momento de guardar
- **Backend**: Nueva feature `servicios/` con models, schemas, repository, service, router
- **Frontend**: Nueva feature `servicios/` con types, API client, hooks, componentes y página en `/servicios`

## Capabilities

### New Capabilities
- `servicios-crud`: Operaciones CRUD para RegistroServicio — listar con filtros por fecha/tipo, obtener por ID, crear con cálculo de ganancia, eliminar
- `servicios-calculo-ganancia`: Cálculo automático de ganancia en el backend (ingresoTotal - costoInsumos) y preview en el frontend antes de guardar
- `servicios-formulario-dinamico`: Formulario con campos dinámicos según tipo de servicio (fotocopia: cantidad; plastificado: tipo frecuente + cantidad; souvenir: descripción + ingreso; otro: todo manual)

### Modified Capabilities
_No hay capabilities existentes cuyos requirements estén cambiando._

## Impact

- **Backend**: Nueva `backend/app/features/servicios/` — models.py, schemas.py, repository.py, service.py, router.py + montar en main.py bajo `/api/servicios`
- **Frontend**: Nueva `frontend/src/features/servicios/` — types/, api/, hooks/, components/, pages/ + ruta `/servicios` en el router
- **Base de datos**: Tabla RegistroServicio ya existe (creada por migraciones de C-02)
- **Dependencias**: C-02 schema-definition (tabla existe), C-05 supplies-management (insumos disponibles para referencia de patrón), fastapi-backend spec (estructura de features), api-client spec (cliente HTTP)
