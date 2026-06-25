# Design: Setup Base

**Change ID:** `c-01-setup-base`

---

## Context

El proyecto Librix necesita un backend FastAPI + PostgreSQL desde cero. Se reemplazó PocketBase (que tenía conflictos con Vite) por este stack. El frontend React ya existe con estructura feature-based. El backend debe espejar esa misma estructura.

No hay modelos de negocio aún — esta fase es solo el scaffolding: carpetas, dependencias, configuración, base de datos, cliente API del frontend.

## Goals / Non-Goals

**Goals:**
- Backend FastAPI con feature-based architecture
- SQLAlchemy 2.0 async con asyncpg para PostgreSQL
- Alembic configurado para migraciones asíncronas
- Config centralizada con Pydantic Settings
- Inyección de dependencias (get_db, etc.) siguiendo patrón FastAPI
- Cliente HTTP genérico en frontend con tipado y errores
- Tests de humo: health endpoint, conexión a BD

**Non-Goals:**
- Modelos de negocio (C-02 en adelante)
- Lógica de negocio
- Features del frontend (ya existen, solo se mueven a frontend/)
- Tests unitarios de features (se crean en cada fase)
- PWA / service workers
- CI/CD

## Decisions

### 1. SQLAlchemy async con asyncpg

| Opción | Veredicto |
|--------|-----------|
| SQLAlchemy sync + psycopg2 | ❌ Bloquea event loop |
| SQLAlchemy async + asyncpg | ✅ Estándar FastAPI |
| raw SQL con asyncpg | ❌ Sin ORM ni migraciones |

**Decisión:** SQLAlchemy 2.0 async + asyncpg. Permite Alembic, tipado fuerte, y es el estándar de la comunidad FastAPI.

### 2. Repository Pattern obligatorio

```
router.py → service.py → repository.py → SQLAlchemy
```

Las reglas del proyecto son claras: **los services NO hacen consultas a la BD**. Toda consulta va en `repository.py`. El service solo orquesta repositorios y aplica reglas de negocio.

### 3. UUID como PK en vez de autoincrement

| Opción | Veredicto |
|--------|-----------|
| Auto-increment int | ❌ Expone cantidad de registros, conflictos en migraciones |
| UUID (v4) | ✅ Portable, seguro, sin secuencias |

**Decisión:** UUID como PK string en todas las tablas. SQLAlchemy lo genera con `uuid.uuid4()`.

### 4. Timestamps con UTC

`created_at` y `updated_at` se manejan desde SQLAlchemy con `server_default=func.now()` y `onupdate=func.now()`. Se almacenan en UTC. El frontend los muestra en la zona horaria local del navegador.

### 5. Sin autenticación en MVP

El negocio es familiar, todos confían, mismo acceso. CORS restringido a la red local. El backend no se expone a internet.

### 6. Middleware de logging

Se agrega middleware básico que loguea método, ruta, status code y duración de cada request. Útil para debugging en desarrollo.

### 7. Frontend dentro de `frontend/`

Todo el código frontend se mueve a `frontend/` para mantener la raíz del proyecto ordenada. El backend está en `backend/`, el frontend en `frontend/`. Cada uno con su propio `package.json`, `vite.config.ts`, `tsconfig.json` y `.env`. El monorepo se gestiona desde la raíz con scripts que delegan a cada subdirectorio.

## Folder Structure Completa

```
librix/
├── frontend/                       ← React + Vite
│   ├── src/
│   │   ├── features/               ← módulos por dominio
│   │   │   ├── ventas/
│   │   │   ├── productos/
│   │   │   ├── stock/
│   │   │   ├── insumos/
│   │   │   ├── servicios/
│   │   │   ├── caja/
│   │   │   └── dashboard/
│   │   ├── components/ui/          ← shadcn/ui components
│   │   ├── hooks/                  ← hooks compartidos
│   │   ├── lib/                    ← api.ts, utils, cn
│   │   ├── shared/                 ← types, utils globales
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts              ← alias @/ → src/
│   ├── tsconfig.json
│   ├── components.json             ← shadcn/ui config
│   └── .env                        ← VITE_API_URL
│
├── backend/                        ← FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app + lifespan + routers
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py           # Pydantic BaseSettings
│   │   │   ├── database.py         # engine, AsyncSession, get_db
│   │   │   └── dependencies.py     # dependencias compartidas
│   │   ├── shared/
│   │   │   ├── __init__.py
│   │   │   ├── base.py             # SQLAlchemy declarative base
│   │   │   ├── mixins.py           # TimestampMixin, etc.
│   │   │   └── types.py            # tipos compartidos
│   │   └── features/
│   │       ├── __init__.py
│   │       ├── productos/
│   │       │   ├── __init__.py
│   │       │   ├── models.py       # SQLAlchemy model
│   │       │   ├── schemas.py      # Pydantic request/response
│   │       │   ├── repository.py   # DB queries
│   │       │   ├── service.py      # Business logic
│   │       │   └── router.py       # FastAPI endpoints
│   │       ├── ventas/
│   │       ├── stock/
│   │       ├── insumos/
│   │       ├── servicios/
│   │       ├── caja/
│   │       └── dashboard/
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── tests/
│   │   ├── __init__.py
│   │   └── conftest.py
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env                        ← DATABASE_URL
│
├── docs/
│   └── README.md                   ← contexto del negocio
├── knowledge-base/                 ← documentación del dominio
└── openspec/                       ← cambios y especificaciones
```

## Risks / Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| PostgreSQL no instalado en PC del local | Alta | Alto | README con instrucciones de instalación + winget/choco |
| Conflictos de puerto 8000 | Baja | Bajo | Puerto configurable via env var |
| asyncpg no disponible en Windows | Baja | Medio | asyncpg funciona bien en Windows con PostgreSQL |
| Curva de aprendizaje Python | Baja | Bajo | Solo agentes IA tocan el backend, la usuaria ve solo el frontend |
