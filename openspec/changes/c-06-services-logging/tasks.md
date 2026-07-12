## 1. Backend — RegistroServicio Model y Schemas

- [ ] 1.1 Crear `backend/app/features/servicios/models.py` con el modelo SQLAlchemy RegistroServicio (id UUID, fecha date, tipo enum, descripcion str, cantidad int, ingresoTotal Decimal, costoInsumos Decimal default 0, ganancia Decimal)
- [ ] 1.2 Crear `backend/app/features/servicios/schemas.py` con Pydantic schemas: RegistroServicioCreate (sin ganancia, el backend la calcula), RegistroServicioResponse (con ganancia calculada), RegistroServicioFiltros (fecha?, tipo?)

## 2. Backend — Repository y Service

- [ ] 2.1 Crear `backend/app/features/servicios/repository.py` con métodos async: list_all (con filtros opcionales por fecha/tipo), get_by_id, create, delete
- [ ] 2.2 Crear `backend/app/features/servicios/service.py` con lógica de negocio: calcular_ganancia (ingresoTotal - costoInsumos), calcular_ingreso_fotocopia (cantidad × precioPorHoja), crear_servicio (calcula ganancia antes de persistir)

## 3. Backend — Router y Montaje

- [ ] 3.1 Crear `backend/app/features/servicios/router.py` con endpoints: GET `/api/servicios` (filtros query params), GET `/api/servicios/{id}`, POST `/api/servicios` (calcular ganancia), DELETE `/api/servicios/{id}`
- [ ] 3.2 Montar router en `backend/app/main.py` bajo prefijo `/api/servicios`

## 4. Frontend — Types y API Client

- [ ] 4.1 Crear `frontend/src/features/servicios/types/servicio.ts` con interfaces TypeScript: TipoServicio (enum), RegistroServicio, RegistroServicioCreate, FiltrosServicio
- [ ] 4.2 Crear `frontend/src/features/servicios/api/servicios.ts` con funciones API: getAll (con filtros), getById, create, delete usando el cliente API compartido

## 5. Frontend — TanStack Query Hooks

- [ ] 5.1 Crear `frontend/src/features/servicios/hooks/useServicios.ts` con useQuery para listar (con filtros) y useMutation para crear/eliminar
- [ ] 5.2 Crear `frontend/src/features/servicios/hooks/useCalculoServicio.ts` hook personalizado para calcular ingreso y ganancia en tiempo real según tipo y campos

## 6. Frontend — Componentes

- [ ] 6.1 Crear `frontend/src/features/servicios/components/ServiciosTable.tsx` con tabla de servicios del día, totales calculados y filtro por tipo
- [ ] 6.2 Crear `frontend/src/features/servicios/components/ServicioForm.tsx` con formulario dinámico: selector de tipo, campos según tipo (fotocopia: cantidad; plastificado: tipo frecuente + cantidad; souvenir: descripción + ingreso; otro: todo), preview de ganancia
- [ ] 6.3 Crear `frontend/src/features/servicios/components/DeleteServicioDialog.tsx` con diálogo de confirmación para eliminar

## 7. Frontend — Página y Routing

- [ ] 7.1 Crear `frontend/src/features/servicios/pages/ServiciosPage.tsx` componiendo tabla + formulario
- [ ] 7.2 Agregar ruta `/servicios` en el router del frontend (App.tsx o config de rutas)
- [ ] 7.3 Agregar enlace "Servicios" en la navegación principal (sidebar o navbar)
