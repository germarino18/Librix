# Librix — Sistema de Gestión para Librería Universitaria

Sistema de punto de venta (POS) + inventario + caja para una librería y papelería universitaria. Corre localmente en la PC del local, accesible desde celulares por WiFi.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Data Fetching | TanStack Query |
| Backend | FastAPI + SQLAlchemy + Alembic |
| Base de datos | PostgreSQL |
| Package Manager | pnpm (frontend) / pip (backend) |

## Requisitos

- **Node.js** >= 18
- **pnpm** (instalar con `npm install -g pnpm`)
- **Python** >= 3.11
- **PostgreSQL** >= 16
- **Windows** (el sistema corre en una PC con Windows)

## Cómo levantar el proyecto

### 1. Base de datos (PostgreSQL)

```bash
# Asegurate de tener PostgreSQL corriendo en localhost:5432
# Crear la base de datos:
createdb librix
```

### 2. Backend (FastAPI)

```bash
# Ir a la carpeta del backend
cd backend

# Crear entorno virtual (solo la primera vez)
python -m venv .venv

# Activar (Windows)
.venv\Scripts\activate

# Instalar dependencias (solo la primera vez)
pip install -r requirements.txt

# Configurar .env (solo la primera vez)
# Editar backend\.env o copiar de .env.example:
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/librix

# Correr migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.
Documentación interactiva en `http://localhost:8000/docs`.
Health check en `http://localhost:8000/api/health`.

### 3. Frontend (React + Vite)

En otra terminal:

```bash
# Ir a la carpeta del frontend
cd frontend

# Instalar dependencias (solo la primera vez)
pnpm install

# Iniciar en modo desarrollo
pnpm dev
```

La app queda disponible en `http://localhost:5173`.

### 4. Atajo: los dos a la vez

Desde la raíz del proyecto:

```bash
# Frontend + backend simultáneamente
pnpm dev:all

# O por separado:
pnpm dev:frontend   # solo frontend
pnpm dev:backend    # solo backend (requiere venv activado)
```

## Variables de entorno

### Frontend (`frontend/.env`)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | URL base de la API |

### Backend (`backend/.env`)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/librix` | Conexión a PostgreSQL |

## Scripts disponibles

### Desde la raíz

| Comando | Descripción |
|---------|-------------|
| `pnpm dev:frontend` | Inicia frontend (Vite) |
| `pnpm dev:backend` | Inicia backend (uvicorn) |
| `pnpm dev:all` | Inicia frontend + backend |
| `pnpm build:frontend` | Build de producción del frontend |
| `pnpm typecheck` | Verifica tipos TypeScript |
| `pnpm install:frontend` | Instala dependencias del frontend |
| `pnpm install:backend` | Instala dependencias del backend (pip) |

### Desde `frontend/`

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo Vite |
| `pnpm build` | Build de producción |
| `pnpm preview` | Previsualiza el build |
| `pnpm typecheck` | Verifica tipos TypeScript |

### Desde `backend/` (con venv activado)

| Comando | Descripción |
|---------|-------------|
| `uvicorn app.main:app --reload` | Servidor de desarrollo |
| `alembic upgrade head` | Aplica migraciones |
| `alembic revision --autogenerate -m "mensaje"` | Crea nueva migración |
| `pytest` | Corre tests |

## Estructura del proyecto

```
librix/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── features/            # Módulos por dominio
│   │   │   ├── ventas/          # Pantalla de ventas
│   │   │   ├── productos/       # ABM de productos
│   │   │   ├── insumos/         # Gestión de insumos
│   │   │   ├── servicios/       # Registro de servicios
│   │   │   ├── caja/            # Apertura/cierre de caja
│   │   │   └── dashboard/       # Dashboard de ganancias
│   │   ├── components/ui/       # Componentes shadcn/ui
│   │   ├── shared/              # Hooks, utils y types globales
│   │   └── lib/                 # Configuración, cliente API
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                     # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + health
│   │   ├── core/                # Config, database, dependencies
│   │   ├── shared/              # Base ORM, mixins
│   │   ├── features/            # Misma estructura feature-based
│   │   │   ├── productos/
│   │   │   ├── ventas/
│   │   │   ├── stock/
│   │   │   ├── insumos/
│   │   │   ├── servicios/
│   │   │   ├── caja/
│   │   │   └── dashboard/
│   ├── alembic/                 # Migraciones
│   ├── tests/                   # Tests
│   ├── requirements.txt
│   └── .env
├── knowledge-base/              # Documentación del negocio
└── openspec/                    # Seguimiento de cambios
```
