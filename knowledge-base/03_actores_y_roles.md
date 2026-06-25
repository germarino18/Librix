# 03 — Actores y Roles

## Actores del sistema

| Actor | Descripción | Cantidad estimada |
|-------|-------------|-------------------|
| Operador | Dueña o hijos que operan el sistema diariamente | 3-4 personas |

## Modelo de permisos

**No hay sistema de usuarios ni roles.** Todos los operadores tienen el mismo acceso completo al sistema. Esto es intencional por la naturaleza del negocio familiar.

## Autenticación

El MVP no requiere inicio de sesión. La app arranca directamente en la pantalla principal (Ventas). En el futuro podría agregarse un PIN simple si es necesario.

## Rutas / pantallas (acceso público)

Todas las pantallas son accesibles sin autenticación:

| Pantalla | Ruta | Visible desde |
|----------|------|---------------|
| Ventas | `/` | PC (desktop) |
| Productos | `/productos` | PC |
| Insumos | `/insumos` | PC |
| Servicios | `/servicios` | PC |
| Caja | `/caja` | PC |
| Dashboard | `/dashboard` | PC |
