# 08 — Arquitectura Propuesta

## Estructura de directorios

```
librix/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes compartidos (shadcn/ui)
│   │   ├── pages/             # Páginas (Ventas, Productos, etc.)
│   │   ├── lib/               # Utilidades, configuración
│   │   ├── hooks/             # Custom hooks (usePocketBase, etc.)
│   │   ├── services/          # Llamadas a la API de PocketBase
│   │   └── App.tsx
│   ├── index.html
│   └── package.json
├── pocketbase/                 # Binario y config de PocketBase
│   ├── pocketbase.exe          # (no se versiona, se descarga)
│   └── pb_data/                # Datos de PocketBase (no versionar)
├── docs/                       # Documentación fuente
├── knowledge-base/             # KB generada
├── openspec/                   # OpenSpec (cambios, specs)
├── package.json                # Scripts del proyecto raíz
└── README.md
```

## Patrones

### Frontend
- **React Router** para navegación SPA
- **shadcn/ui** para componentes (botones, inputs, modales, tablas)
- **Tailwind CSS** para estilos utilitarios
- **Context API** o estado simple para la venta en curso (no Redux ni Zustand — es una app chica)
- **Fetch directo** a PocketBase API (no se necesita SDK pesado)

### Conexión con PocketBase
- URL base configurable por variable de entorno (`VITE_PB_URL`)
- En desarrollo: `http://localhost:8090`
- En la PC del local: `http://localhost:8090` (frontend sirve por Vite o build estático)

### Seguridad
- Sin autenticación en MVP
- PocketBase corre en modo público (solo red local, sin exposición a internet)
- Las reglas de seguridad de PocketBase se configuran para permitir lectura/escritura sin auth

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_PB_URL` | `http://localhost:8090` | URL de PocketBase |
