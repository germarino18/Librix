## Why

El proyecto Librix necesita un scaffold sólido antes de codear cualquier funcionalidad de negocio. No hay un solo archivo de código todavía, no hay base de datos, no hay frontend montado. Sin esta base, ningún change posterior (productos, ventas, caja) se puede construir. Arrancar con el setup correcto evita tener que rehacer configuraciones y garantiza que todo el equipo (agentes) trabaje contra la misma estructura.

## What Changes

- Creación del proyecto React + Vite + TypeScript con pnpm
- Instalación y configuración de Tailwind CSS v4 + shadcn/ui
- Creación de la estructura de carpetas feature-based (colocation pattern)
- Instalación de shadcn/ui components base (Button, Card, Dialog, Input, Select, Table, Form)
- Configuración de TanStack Query para data fetching
- Configuración de React Router con layout base
- Instalación del binario de PocketBase standalone
- Creación de los schemas iniciales de PocketBase (Categoria, Producto, Venta, DetalleVenta, MovimientoStock)
- Configuración de variables de entorno (`VITE_PB_URL`)
- Scripts de desarrollo en package.json raíz
- Configuración de path aliases (`@/` → `src/`)

## Capabilities

### New Capabilities
- `project-setup`: Scaffolding del proyecto React + Vite + shadcn/ui + Tailwind + pnpm
- `pocketbase-schema`: Schemas iniciales de PocketBase con colecciones y API rules públicas
- `ui-foundation`: Componentes base de shadcn/ui instalados y configurados

### Modified Capabilities
- *(Ninguno — no hay specs existentes todavía)*

## Impact

- **Dependencias nuevas**: react, react-dom, react-router-dom, @tanstack/react-query, tailwindcss v4, shadcn/ui, pocketbase (binario)
- **Archivos creados**: package.json, vite.config.ts, tsconfig.json, index.html, src/ completo con estructura de carpetas, schemas de PocketBase
- **Entorno**: se requiere Node.js + pnpm instalados en la PC Windows
- **No breaking**: proyecto desde cero, no hay código previo que migrar

---

## Archive Information

**Archived:** 2025-06-24 23:28
**Duration:** 1 day (created 2025-06-24)
**Outcome:** Successfully implemented

### Files Modified
- `src/` — Full scaffolding (Vite + React + TS + Tailwind + shadcn/ui)
- `pocketbase/pb_migrations/` — 5 migration files for initial collections
- `package.json` — Scripts, dependencies
- `.env` / `.env.example` — Environment variables
- `.gitignore` — Standard ignores

### Specs Updated (Canonical)
- `openspec/specs/project-setup/spec.md` — Created
- `openspec/specs/pocketbase-schema/spec.md` — Created
- `openspec/specs/ui-foundation/spec.md` — Created
