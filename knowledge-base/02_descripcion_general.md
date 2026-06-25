# 02 — Descripción General

## Stack tecnológico

| Capa | Tecnología | Versión / Detalle |
|------|-----------|-------------------|
| Frontend | React + Vite + TypeScript | SPA moderna con routing |
| UI | shadcn/ui + Tailwind CSS v4 | Componentes accesibles, utility-first |
| Backend | FastAPI + SQLAlchemy + Alembic | API REST asíncrona |
| Base de datos | PostgreSQL | Relacional, robusto |
| Package Manager | pnpm (frontend) / pip (backend) | |
| Entorno | Windows | PC del local |

## Arquitectura general

```
┌──────────────────────────────────────┐
│   React SPA (Vite + shadcn)          │  ← Navegador en PC
│   http://localhost:5173 (dev)         │     y celulares por WiFi
└──────────────┬───────────────────────┘
               │ HTTP (REST JSON)
               ▼
┌──────────────────────────────────────┐
│   FastAPI + Uvicorn                  │  ← Backend API
│   http://localhost:8000/api          │
│   ┌──────────────────────────────┐   │
│   │  SQLAlchemy (async)          │   │  ← ORM
│   └──────────┬───────────────────┘   │
│              │                       │
│              ▼                       │
│   ┌──────────────────────────────┐   │
│   │  PostgreSQL                  │   │  ← Base de datos
│   │  localhost:5432/librix       │   │
│   └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

## Integraciones externas

- **Ninguna en el MVP.** Mercado Pago se registra manualmente como método de pago, sin integración API.

## Entorno de desarrollo

- PC Windows
- Node.js + pnpm para el frontend
- Python 3.11+ para el backend
- PostgreSQL local
- Editor: opencode (recomendado)
