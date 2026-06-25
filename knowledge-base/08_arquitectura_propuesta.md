# 08 — Arquitectura Propuesta

## Estructura de directorios

```
librix/
├── frontend/                     # React + Vite
│   ├── src/
│   │   ├── components/           # Componentes compartidos (shadcn/ui)
│   │   ├── features/             # Módulos por dominio
│   │   │   ├── productos/        # ABM productos y categorías
│   │   │   ├── ventas/           # Pantalla de ventas
│   │   │   ├── insumos/          # Gestión de insumos
│   │   │   ├── servicios/        # Registro post-jornada
│   │   │   ├── caja/             # Caja diaria
│   │   │   └── dashboard/        # Dashboard de ganancias
│   │   ├── lib/                  # Cliente API, utilidades
│   │   ├── shared/               # Hooks, tipos, utils compartidos
│   │   └── App.tsx
│   ├── index.html
│   └── package.json
│
├── backend/                      # FastAPI + SQLAlchemy
│   ├── alembic/                  # Migraciones de BD
│   │   ├── versions/
│   │   └── env.py
│   ├── app/
│   │   ├── main.py               # FastAPI app, routers, lifespan
│   │   ├── config.py             # Settings (pydantic)
│   │   ├── database.py           # Engine, sesión asíncrona
│   │   ├── features/             # Feature-based architecture
│   │   │   ├── productos/
│   │   │   │   ├── models.py     # SQLAlchemy model
│   │   │   │   ├── schemas.py    # Pydantic schemas
│   │   │   │   ├── router.py     # FastAPI router
│   │   │   │   └── service.py    # Lógica de negocio
│   │   │   ├── ventas/
│   │   │   ├── insumos/
│   │   │   ├── servicios/
│   │   │   ├── caja/
│   │   │   └── dashboard/
│   │   └── shared/               # Base model, utils compartidos
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── .env                      # DATABASE_URL
│
├── docs/
├── knowledge-base/
├── openspec/
├── package.json
└── README.md
```

## Patrones

### Frontend
- **React Router** para navegación SPA
- **shadcn/ui** para componentes (botones, inputs, modales, tablas)
- **Tailwind CSS v4** para estilos utilitarios (configuración vía CSS, sin tailwind.config.js)
- **TanStack Query** para fetching, caché y sincronización con la API
- **React Hook Form + Zod** para formularios y validación
- **Context API** para estado de venta en curso (app chica, no Redux)
- Feature-based colocation: cada feature autocontenida con api/, components/, hooks/, types/

### Backend
- **FastAPI** con routers por feature (misma estructura que el frontend)
- **SQLAlchemy 2.0 asíncrono** con asyncpg para PostgreSQL
- **Alembic** para migraciones de base de datos
- **Pydantic v2** para schemas de request/response
- **Repository pattern** opcional (service layer se encarga de queries)
- Dependencia de base de datos vía FastAPI dependency injection
- Manejo de errores con HTTPException y handlers globales

### API REST
- `GET /api/productos` — listar con filtros y paginación
- `POST /api/productos` — crear
- `PUT /api/productos/{id}` — actualizar
- `DELETE /api/productos/{id}` — baja lógica (activo=false)
- Mismo patrón para todas las entidades

## Seguridad
- Sin autenticación en MVP
- Backend corre solo en red local (localhost), sin exposición a internet
- CORS configurado para origen del frontend

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | URL base de la API |

### Backend (.env)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/librix` | Conexión a PostgreSQL |
| `API_HOST` | `0.0.0.0` | Host del servidor |
| `API_PORT` | `8000` | Puerto del servidor |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Orígenes permitidos |
