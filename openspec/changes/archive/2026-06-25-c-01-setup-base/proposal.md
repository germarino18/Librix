# Proposal: Setup Base — FastAPI + PostgreSQL + estructura feature-based

**Change ID:** `c-01-setup-base`
**Status:** Archived  
**Archived:** 2026-06-25  
**Outcome:** Successfully implemented

---

## Why

El proyecto Librix necesita un backend robusto para su POS/inventario. No hay backend actualmente (se migró de PocketBase). Se necesita establecer la infraestructura base del proyecto con FastAPI + PostgreSQL, estructura feature-based, y el cliente API del frontend antes de poder desarrollar cualquier funcionalidad de negocio.

## What Changes

- **Backend FastAPI**: scaffolding completo con estructura feature-based
- **Core infrastructure**: config, database async, dependencies
- **Alembic**: migraciones configuradas con async SQLAlchemy
- **Cliente API frontend**: `src/lib/api.ts` genérico con fetch + tipos
- **Variables de entorno**: `VITE_API_URL`, `DATABASE_URL`
- **Documentación**: README.md actualizado con instrucciones de setup
- **Archivos eliminados**: lo que quedó del stack anterior (PocketBase, etc.)

## Capabilities

### New Capabilities
- `fastapi-backend`: Backend FastAPI con estructura feature-based, config Pydantic, SQLAlchemy async + asyncpg, inyección de dependencias
- `api-client`: Cliente HTTP genérico para frontend con tipado y manejo de errores
- `db-migrations`: Sistema de migraciones Alembic para PostgreSQL async

### Modified Capabilities
- *(Ninguna — setup inicial, no hay specs previas)*

## Impact

| Componente | Cambio | Detalle |
|------------|--------|---------|
| Backend | 🔴 Creación completa | 0 a 1 — no existía |
| Base de datos | 🟡 PostgreSQL local | Requiere tener PostgreSQL instalado |
| Frontend | 🟡 Nuevo api.ts | Reemplaza pocketbase.ts que fue eliminado |
| Variables de entorno | 🟡 Cambio | VITE_PB_URL → VITE_API_URL |
| Dependencias | 🟢 pip + pnpm | requirements.txt nuevo, pocketbase eliminado del package.json |
