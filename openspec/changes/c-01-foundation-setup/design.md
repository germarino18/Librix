## Context

Proyecto desde cero. No hay código, no hay schemas de base de datos, no hay configuración de frontend. El stack está definido (React + Vite + TypeScript + shadcn/ui + Tailwind v4 + PocketBase), pero nada está instalado. El package manager es pnpm.

La estructura del proyecto debe seguir el patrón **feature-based (colocation)**, donde cada módulo de negocio (ventas, productos, etc.) es autocontenido en su carpeta `features/`.

## Goals / Non-Goals

**Goals:**
- Scaffolding completo de React + Vite + TypeScript funcional
- shadcn/ui + Tailwind CSS v4 configurados y probados
- Estructura de carpetas feature-based lista para los próximos changes
- PocketBase standalone instalado y corriendo con schemas iniciales
- React Router con layout base
- TanStack Query configurado
- Path alias `@/` mapeado a `src/`

**Non-Goals:**
- No se implementa lógica de negocio (ventas, productos, caja — son changes posteriores)
- No se integran APIs externas
- No hay autenticación ni usuarios
- No hay testing configuration todavía (se agrega en change posterior)

## Decisions

| Decisión | Opción | Alternativa | Motivo |
|----------|--------|-------------|--------|
| Estructura del proyecto | Monorepo plano (frontend + pocketbase en raíz) | Separar frontend/backend en carpetas | PocketBase es standalone, no requiere build propio. Un solo package.json raíz simplifica scripts |
| shadcn/ui init | `shadcn init` con path alias `@/` | Config manual | El CLI de shadcn/ui genera la config correcta automáticamente |
| Tailwind v4 | Plugin `@tailwindcss/vite` | PostCSS | Tailwind v4 recomienda el plugin de Vite, más simple y rápido |
| PocketBase schemas | Archivo JSON de migración en `pocketbase/pb_migrations/` | GUI manual | Versionable, reproducible, CI-friendly |
| Layout base | React Router con `<Outlet>` | Sin layout | Todas las pantallas comparten header/nav, hacerlo desde el principio evita refactors |
| Alias | `@/` → `src/*` | Import relativos | shadcn/ui requiere `@/` por defecto, consistente con el ecosistema |

## Risks / Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Versión de Node.js incompatible con Vite | Baja | Medio | Usar `.nvmrc` o `engines` en package.json para fijar Node >= 18 |
| shadcn/ui cambie su CLI de init | Baja | Medio | Los componentes se copian al proyecto, el CLI es solo para init; cambios futuros no nos afectan |
| PocketBase cambie su schema format entre versiones | Baja | Alto | Fijar versión de PocketBase en la documentación y en el nombre del .exe |
| Path alias no funcione en producción (build) | Baja | Medio | Verificar que `resolve.alias` en vite.config.ts coincida con `paths` en tsconfig.json |

## Open Questions

- ¿Usamos un solo `package.json` raíz o workspace (pnpm workspace) con frontend/ separado? → **Decisión: workspace con frontend/ separado** para mayor claridad y escalabilidad. (Editado: mejor un solo package.json raíz por simplicidad — el proyecto es chico, workspace agrega complejidad innecesaria.)
