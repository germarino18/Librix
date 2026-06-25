# Implementation Tasks: C-01 Foundation Setup

**Change ID:** `c-01-foundation-setup`

---

## 1. Vite + React + TypeScript Scaffolding

- [ ] 1.1 Create Vite project with React + TypeScript template using `pnpm create vite`
- [ ] 1.2 Install core dependencies: react-router-dom, @tanstack/react-query
- [ ] 1.3 Configure path alias `@/` → `src/` in vite.config.ts and tsconfig.json
- [ ] 1.4 Create feature-based directory structure: `features/`, `components/ui/`, `shared/`, `lib/`
- [ ] 1.5 Create initial feature folders (ventas, productos, insumos, servicios, caja, dashboard)
- [ ] 1.6 Configure React Router with root layout + `<Outlet />`
- [ ] 1.7 Wrap app with QueryClientProvider from TanStack Query
- [ ] 1.8 Create placeholder pages for each feature

**Quality Gate:**
- [ ] `pnpm dev` starts without errors
- [ ] `pnpm typecheck` passes (once configured)

---

## 2. Tailwind CSS v4 + shadcn/ui

- [ ] 2.1 Install Tailwind CSS v4 with `@tailwindcss/vite` plugin
- [ ] 2.2 Configure `@import "tailwindcss"` in main CSS file
- [ ] 2.3 Run `shadcn init` with `@/` path alias
- [ ] 2.4 Install base shadcn/ui components: button, card, dialog, input, select, table, form, label, toast, sonner
- [ ] 2.5 Verify CSS variables and theming are correctly set up

**Quality Gate:**
- [ ] shadcn/ui components render correctly in browser
- [ ] Tailwind utility classes work end-to-end

---

## 3. PocketBase Standalone + Schemas

- [ ] 3.1 Download PocketBase binary (`pocketbase.exe`) into `pocketbase/` directory
- [ ] 3.2 Add `pocketbase/` to `.gitignore` (except `pb_migrations/`)
- [ ] 3.3 Create PocketBase migration files for: Categoria, Producto, Venta, DetalleVenta, MovimientoStock
- [ ] 3.4 Configure API rules for public read/write access (local network only)
- [ ] 3.5 Set up `src/lib/pocketbase.ts` with PocketBase client configured via `VITE_PB_URL`

**Quality Gate:**
- [ ] PocketBase starts and serves API at `http://localhost:8090`
- [ ] All collections are created and accessible via API

---

## 4. Environment & Scripts

- [ ] 4.1 Create `.env` with `VITE_PB_URL=http://localhost:8090`
- [ ] 4.2 Add `.env` to `.gitignore` (keep `.env.example` versioned)
- [ ] 4.3 Create `.env.example` with documented variables
- [ ] 4.4 Add scripts to root `package.json`: `dev`, `build`, `preview`, `typecheck`
- [ ] 4.5 Create `.gitignore` with sensible defaults (node_modules, dist, pb_data, .env, pocketbase.exe)

**Quality Gate:**
- [ ] `pnpm dev` launches both Vite and PocketBase (or at least documents both commands)
- [ ] Build completes without errors

---

## Completion Checklist

- [ ] All phases complete
- [ ] All quality gates passed
- [ ] "Hello World" renders in browser with shadcn/ui component visible
- [ ] PocketBase API responds to requests
- [ ] Ready for apply: `/opsx:apply c-01-foundation-setup`
