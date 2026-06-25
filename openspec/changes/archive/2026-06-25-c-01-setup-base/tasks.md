# Implementation Tasks: Setup Base

**Change ID:** `c-01-setup-base`

---

## 1. Restructurar Frontend → frontend/

- [x] 1.1 Create `frontend/` directory
- [x] 1.2 Move `src/` → `frontend/src/`
- [x] 1.3 Move `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `tsconfig.json`, `index.html`, `components.json` → `frontend/`
- [x] 1.4 Move `.env` (frontend vars) → `frontend/.env`. Create `backend/.env` for DATABASE_URL.
- [x] 1.5 Update `vite.config.ts` path aliases — verificado, correcto desde `frontend/`
- [x] 1.6 Update `tsconfig.json` paths — verificado, correcto desde `frontend/`
- [x] 1.7 Update `index.html` script src — verificado, Vite resuelve desde `frontend/`
- [x] 1.8 Reinstall dependencies: pnpm install — 128 packages, 16s
- [x] 1.9 Verify: pnpm typecheck pasa, pnpm build 236 modules

## 2. Backend: Core Infrastructure

- [x] 2.1 Create `backend/` directory structure with all feature folders, `core/`, `shared/`, `alembic/`, `tests/`
- [x] 2.2 Create `backend/requirements.txt` — FastAPI, asyncpg, alembic, pytest, httpx
- [x] 2.3 Create `backend/app/__init__.py` and `backend/app/main.py` — FastAPI con lifespan, CORS, health, logging middleware
- [x] 2.4 Create `backend/app/core/config.py` — Pydantic Settings con DATABASE_URL, API_HOST, API_PORT, CORS_ORIGINS, APP_NAME, APP_VERSION
- [x] 2.5 Create `backend/app/core/database.py` — async engine, AsyncSession, get_db
- [x] 2.6 Create `backend/app/core/dependencies.py` — re-exporta get_db
- [x] 2.7 Create `backend/app/shared/base.py`, `mixins.py` — DeclarativeBase + TimestampMixin
- [x] 2.8 Create `backend/app/features/` — 7 features × 6 placeholders cada una
- [x] 2.9 Verify: uvicorn corre, `/api/health` → 200 OK, `/docs` muestra Swagger

## 3. Backend: Alembic Setup

- [x] 3.1 Create `backend/alembic.ini` con URL async
- [x] 3.2 Create `backend/alembic/env.py` con `run_async()` para modo async
- [x] 3.3 Create `backend/alembic/script.py.mako` template
- [x] 3.4 Initial migration creada manualmente (sin PostgreSQL no corre autogenerate)
- [x] 3.5 Migration `0001_initial.py` lista para aplicar cuando PostgreSQL esté corriendo

## 4. Frontend: API Client

- [x] 4.1 Create `frontend/src/lib/api.ts` — `get<T>()`, `post<T>()`, `put<T>()`, `delete<T>()`
- [x] 4.2 ApiError class con status, message, detail
- [x] 4.3 Base URL desde VITE_API_URL, default http://localhost:8000/api
- [x] 4.4 Verify: pnpm typecheck y pnpm build OK

## 5. Project Configuration

- [x] 5.1 Create `frontend/.env` con VITE_API_URL
- [x] 5.2 Create `backend/.env` con DATABASE_URL
- [x] 5.3 Update root `.gitignore` con patrones frontend + backend
- [x] 5.4 Create root `package.json` — scripts dev:frontend, dev:backend, dev:all
- [x] 5.5 Full stack verify pendiente (requiere PostgreSQL)

## 6. Smoke Tests

- [x] 6.1 Create `backend/tests/conftest.py` con async fixtures
- [x] 6.2 Create `backend/tests/test_health.py` — test de health endpoint
- [x] 6.3 Verify: pytest pasa, 1 test OK
