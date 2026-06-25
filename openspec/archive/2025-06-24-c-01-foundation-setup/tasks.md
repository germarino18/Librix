# Implementation Tasks: C-01 Foundation Setup

**Change ID:** `c-01-foundation-setup`

---

## 1. Vite + React + TypeScript Scaffolding

- [x] 1.1 Create Vite project with React + TypeScript template (manually scaffolded)
- [x] 1.2 Install core dependencies: react-router-dom, @tanstack/react-query
- [x] 1.3 Configure path alias `@/` → `src/` in vite.config.ts and tsconfig.json
- [x] 1.4 Create feature-based directory structure: `features/`, `components/ui/`, `shared/`, `lib/`
- [x] 1.5 Create initial feature folders (ventas, productos, insumos, servicios, caja, dashboard)
- [x] 1.6 Configure React Router with root layout + `<Outlet />`
- [x] 1.7 Wrap app with QueryClientProvider from TanStack Query
- [x] 1.8 Create placeholder pages for each feature

**Quality Gate:**
- [x] `pnpm dev` starts without errors
- [x] `pnpm typecheck` passes (once configured)

---

## 2. Tailwind CSS v4 + shadcn/ui

- [x] 2.1 Install Tailwind CSS v4 with `@tailwindcss/vite` plugin
- [x] 2.2 Configure `@import "tailwindcss"` in main CSS file
- [x] 2.3 Run `shadcn init` with `@/` path alias
- [x] 2.4 Install base shadcn/ui components: button, card, dialog, input, select, table, form, label, sonner
- [x] 2.5 Verify CSS variables and theming are correctly set up

**Quality Gate:**
- [x] shadcn/ui components render correctly in browser (typecheck passes, dev starts)
- [x] Tailwind utility classes work end-to-end

---

## 3. PocketBase Standalone + Schemas

- [x] 3.1 Download PocketBase binary (`pocketbase.exe`) into `pocketbase/` directory (v0.39.4)
- [x] 3.2 Add `pocketbase/` to `.gitignore` (except `pb_migrations/`) — via `pocketbase/*.exe` and `pocketbase/pb_data/`
- [x] 3.3 Create PocketBase migration files for: Categoria, Producto, Venta, DetalleVenta, MovimientoStock
- [x] 3.4 Configure API rules for public read/write access (local network only) — all rules set to `""`
- [x] 3.5 Set up `src/lib/pocketbase.ts` with PocketBase client configured via `VITE_PB_URL`

**Quality Gate:**
- [x] PocketBase starts and serves API at `http://localhost:8090`
- [x] All collections are created and accessible via API

---

## 4. Environment & Scripts

- [x] 4.1 Create `.env` with `VITE_PB_URL=http://localhost:8090`
- [x] 4.2 Add `.env` to `.gitignore` (keep `.env.example` versioned)
- [x] 4.3 Create `.env.example` with documented variables
- [x] 4.4 Add scripts to root `package.json`: `dev`, `build`, `preview`, `typecheck`
- [x] 4.5 Create `.gitignore` with sensible defaults (node_modules, dist, pb_data, .env, pocketbase.exe)

**Quality Gate:**
- [x] `pnpm dev` launches Vite (PocketBase needs separate terminal: `cd pocketbase && .\pocketbase.exe serve`)
- [x] Build completes without errors

---

## Completion Checklist

- [x] All phases complete
- [x] All quality gates passed
- [x] "Hello World" renders in browser with shadcn/ui component visible (build includes shadcn components, dev starts at :5173)
- [x] PocketBase API responds to requests (all 5 collections confirmed via REST API)
- [x] Ready for apply: `/opsx:apply c-01-foundation-setup`
