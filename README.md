# Librix — Sistema de Gestión para Librería Universitaria

Sistema de punto de venta (POS) + inventario + caja para una librería y papelería universitaria. Corre localmente en la PC del local, accesible desde celulares por WiFi.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Data Fetching | TanStack Query |
| Backend / DB | PocketBase standalone (SQLite) |
| Package Manager | pnpm |

## Requisitos

- **Node.js** >= 18
- **pnpm** (instalar con `npm install -g pnpm`)
- **Windows** (el sistema corre en una PC con Windows)

## Cómo levantar el proyecto

### 1. Backend (PocketBase)

```bash
# Ir a la carpeta de PocketBase
cd pocketbase

# Ejecutar el servidor
.\pocketbase.exe serve
```

La API queda disponible en `http://localhost:8090`.
El Admin UI (para ver/editar datos) en `http://localhost:8090/_/`.

> No necesitás crear ninguna cuenta — PocketBase corre 100% local.

### 2. Frontend (React + Vite)

En otra terminal:

```bash
# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev
```

La app queda disponible en `http://localhost:5173`.

### 3. Build para producción

```bash
pnpm build
```

El build se genera en `dist/`. Podés servirlo con cualquier servidor estático.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo Vite |
| `pnpm build` | Build de producción |
| `pnpm preview` | Previsualiza el build |
| `pnpm typecheck` | Verifica tipos TypeScript |

## Estructura del proyecto

```
librix/
├── src/
│   ├── features/          # Módulos por dominio
│   │   ├── ventas/        # Pantalla de ventas
│   │   ├── productos/     # ABM de productos
│   │   ├── insumos/       # Gestión de insumos
│   │   ├── servicios/     # Registro de servicios
│   │   ├── caja/          # Apertura/cierre de caja
│   │   └── dashboard/     # Dashboard de ganancias
│   ├── components/ui/     # Componentes shadcn/ui
│   ├── shared/            # Hooks, utils y types globales
│   ├── lib/               # Configuración (PocketBase, etc.)
│   ├── App.tsx            # Routes + Layout
│   └── main.tsx           # Entry point
├── pocketbase/            # Backend standalone
│   ├── pocketbase.exe     # (no se versiona)
│   └── pb_migrations/     # Migraciones versionadas
├── knowledge-base/        # Documentación del negocio
└── openspec/              # Seguimiento de cambios
```

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_PB_URL` | `http://localhost:8090` | URL de PocketBase |

Ver `.env.example` para más detalles.
