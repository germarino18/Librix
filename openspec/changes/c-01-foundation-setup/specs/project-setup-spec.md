## ADDED Requirements

### Requirement: Project scaffolding with Vite + React + TypeScript
The system SHALL use Vite as build tool with React + TypeScript template. The project SHALL use pnpm as package manager. The project SHALL target Windows as primary OS.

#### Scenario: Vite dev server starts successfully
- **WHEN** running `pnpm dev`
- **THEN** Vite dev server starts on `http://localhost:5173`

#### Scenario: TypeScript compilation passes
- **WHEN** running `pnpm typecheck` (or `tsc --noEmit`)
- **THEN** no TypeScript errors are reported

### Requirement: Path alias @/ points to src/
The project SHALL configure `@/` as a path alias for `src/`, configured both in `tsconfig.json` and `vite.config.ts`, so that imports like `import { x } from '@/components/...'` resolve correctly.

#### Scenario: Import resolves via @/ alias
- **WHEN** a file imports from `@/lib/utils` or any path under `src/`
- **THEN** the import resolves correctly both in dev and production build

### Requirement: Feature-based directory structure
The src/ directory SHALL follow the colocation pattern with the following structure:
- `src/features/<nombre>/` for each business domain (ventas, productos, insumos, servicios, caja, dashboard)
- `src/components/ui/` for shadcn/ui components
- `src/shared/` for global hooks, utils, types
- `src/lib/` for configuration (PocketBase client, etc.)

#### Scenario: Directory structure exists
- **WHEN** inspecting the `src/` directory
- **THEN** the feature-based structure is in place with `features/`, `components/ui/`, `shared/`, and `lib/` directories

### Requirement: React Router with layout
The system SHALL use React Router v7+ with a root layout component using `<Outlet />` for rendering child routes. The router SHALL be configured for SPA navigation with future support for lazy-loaded routes.

#### Scenario: Router mounts and renders layout
- **WHEN** the app starts
- **THEN** the root layout renders and the router is active with `BrowserRouter`

### Requirement: TanStack Query configured
The system SHALL have TanStack Query configured with a QueryClientProvider wrapping the app, allowing data fetching, caching, and mutations throughout the application.

#### Scenario: QueryClientProvider wraps the app
- **WHEN** inspecting the React component tree
- **THEN** `QueryClientProvider` is present wrapping the routes

### Requirement: Environment variables
The system SHALL expose the PocketBase URL via `VITE_PB_URL` environment variable, defaulting to `http://localhost:8090`.

#### Scenario: VITE_PB_URL is accessible at runtime
- **WHEN** the app reads `import.meta.env.VITE_PB_URL`
- **THEN** it returns the configured value or the default `http://localhost:8090`
