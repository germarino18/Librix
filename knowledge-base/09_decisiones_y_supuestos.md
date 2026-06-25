# 09 — Decisiones y Supuestos

## Decisiones de diseño

| Decisión | Opción elegida | Alternativa | Motivo |
|----------|---------------|-------------|--------|
| DB + Backend | FastAPI + PostgreSQL | PocketBase, Firebase, Supabase | SQLAlchemy + Alembic, tipado fuerte, escalable, misma feature-structure que el frontend |
| Autenticación | Sin auth | Login con usuarios | Negocio familiar, todos confían, simplifica el MVP |
| Método de pago MP | Registro manual | Integración API | No necesita conectividad externa, simplifica |
| UI Framework | shadcn/ui | MUI, Chakra | Tailwind nativo, componentes accesibles, liviano |
| Estado | Context API | Redux, Zustand | App chica, pocos estados globales |
| Desktop-first | Desktop primero | Mobile-first | README indicó prioridad desktop, mobile después |
| Método pago QR MP | Solo etiqueta manual | Checkbox/toggle | Se marca como dato, no hay integración real |
| Package Manager | pnpm | npm, yarn | Más seguro (node_modules planos), más rápido, ahorra disco con hard links |

## Supuestos inferidos

| # | Supuesto | Riesgo si falla |
|---|----------|-----------------|
| S-01 | La PC del local está encendida en horario comercial | Sin PC no hay sistema |
| S-02 | La red WiFi local es estable | Sin red los celulares no se conectan (futuro mobile) |
| S-03 | Los operadores tienen conocimientos básicos de PC (click, escribir) | Curva de aprendizaje casi nula |
| S-04 | Los precios de venta no cambian intradiario | Si cambian, necesitaría precio histórico |
| S-05 | Los productos más vendidos se repiten frecuentemente | Si no, los accesos directos pierden utilidad |
