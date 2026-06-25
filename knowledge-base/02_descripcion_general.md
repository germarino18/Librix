# 02 — Descripción General

## Stack tecnológico

| Capa | Tecnología | Versión / Detalle |
|------|-----------|-------------------|
| Frontend | React + Vite | SPA moderna con routing |
| UI | shadcn/ui + Tailwind CSS | Componentes accesibles, utility-first |
| Backend / DB | PocketBase standalone | SQLite embebido, API REST auto-generada |
| Package Manager | pnpm | Más rápido, seguro, disco eficiente |
| Entorno | Windows | PC del local |

## Arquitectura general

```
┌──────────────────────────────┐
│   React SPA (Vite + shadcn)  │  ← Navegador en la PC
│   http://localhost:5173       │     (futuro: PWA en celulares)
└──────────┬───────────────────┘
           │ HTTP (fetch)
           ▼
┌──────────────────────────────┐
│   PocketBase (pocketbase.exe) │  ← Corre en la misma PC
│   http://localhost:8090       │
│   ┌────────────────────────┐  │
│   │  SQLite                │  │  ← BD local, sin servidor externo
│   └────────────────────────┘  │
└──────────────────────────────┘
```

## Integraciones externas

- **Ninguna en el MVP.** Mercado Pago se registra manualmente como método de pago, sin integración API.

## Entorno de desarrollo

- PC Windows
- Node.js + pnpm para el frontend
- PocketBase como binario standalone
- Editor: opencode (recomendado)
