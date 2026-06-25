# Librix — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Backend / DB | PocketBase (standalone, SQLite) |
| Package Manager | pnpm |
| Entorno | Windows (PC del local) |
| Estado | Context API (app chica, no Redux) |
| Data fetching | TanStack Query |
| Formularios | React Hook Form + Zod |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito y alcance MVP |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Sin auth, todos con mismo acceso |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Colecciones PocketBase, entidades, relaciones |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-01 a RN-10) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Features por épica |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E (venta, caja, servicios) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Estructura del proyecto, patrones, env vars |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias a resolver ANTES de codear |

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend** | React / Vite / shadcn/ui / Tailwind / TanStack | `react`, `react-colocation`, `shadcn-ui`, `tailwind-css`, `tanstack-query`, `vercel-react-best-practices` |
| **Frontend Forms** | React Hook Form + Zod | `react-hook-form-zod` |
| **Backend** | PocketBase / schemas / API rules | `pocketbase-best-practices` |
| **Orquestación** | OPSX / SDD / fundación | `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-creator`, `jr-orchestrator`, `find-skill`, `skill-registry` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 9 changes en 5 fases.
- **Camino crítico** (6): `C-01 → C-02 → C-03 → C-04 → C-07 → C-08`.
- **Primer change**: `C-01 foundation-setup`.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> No existe `~/.claude/CLAUDE.md` global. Todas las reglas se definen acá.

### Reglas específicas del proyecto (confirmadas con el usuario)

1. **NUNCA usar `any` en TypeScript** → usar tipos específicos o `unknown`.
2. **NUNCA crear `tailwind.config.js`** → Tailwind v4 se configura con `@import "tailwindcss"` + `@theme` en CSS.
3. **NUNCA importar de `shadcn/ui` como paquete** → importar desde `@/components/ui/<componente>`.
4. **NUNCA versionar el `.exe` de PocketBase** → solo se versiona el schema, el binario se descarga.
5. **NUNCA dejar la API de PocketBase expuesta a internet** → reglas públicas solo para red local.
6. **NUNCA comitear sin revisar** → ejecutar `git status` + `git diff` antes de cada commit.

### Estructura de carpetas (feature-based)

Usar **colocation pattern** (feature-based architecture):

```
src/
  features/            # Módulos por dominio (cada uno autocontenido)
    ventas/
      components/      # Componentes de la feature
      hooks/           # Custom hooks de la feature
      api/             # Llamadas a PocketBase
      types/           # Types específicos
      index.ts         # Export público
    productos/
    insumos/
    servicios/
    caja/
    dashboard/
  components/          # Componentes compartidos (shadcn/ui)
    ui/                # Button, Card, Dialog, etc.
  shared/              # Hooks globales, utils, tipos compartidos
    hooks/
    utils/
    types/
  lib/                 # Configuración, cliente API
  App.tsx
  main.tsx
```

Regla de decisión para ubicar código:

| Pregunta | Si sí → | Si no → |
|----------|---------|---------|
| ¿Lo usa un solo componente? | Carpeta del componente | ↓ |
| ¿Lo usa una sola feature? | Carpeta de la feature | ↓ |
| ¿Lo usan múltiples features? | `shared/` | — |

### Commits

- Usar **commits convencionales**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- No incluir co-autoría IA en el mensaje del commit.
- No comitear archivos generados, binarios ni `.env`.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
