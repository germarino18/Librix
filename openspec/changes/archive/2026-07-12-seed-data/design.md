## Context

La base de datos de desarrollo no tiene datos iniciales. Cada vez que se resetea la BD (común durante desarrollo) hay que cargar categorías, productos e insumos a mano. Se necesita un script Python autocontenido que poble la base con datos realistas de una librería universitaria.

Los modelos SQLAlchemy ya están definidos (Categoria, Producto, InsumoServicio) y el sistema usa SQLAlchemy async + asyncpg.

## Goals / Non-Goals

**Goals:**
- Script Python que inserte datos iniciales realistas en las tablas: categorías, productos, insumos de servicios
- Que use SQLAlchemy async con los modelos existentes del proyecto
- Idempotente: que limpie datos antes de insertar (se puede correr N veces)
- Que se ejecute con un solo comando: `python seed.py` desde `backend/`

**Non-Goals:**
- No insertar ventas, movimientos de caja, ni datos transaccionales
- No modificar modelos, rutas, ni código de producción
- No agregar dependencias nuevas
- No ser parte del startup automático de la app

## Decisions

| Decisión | Opción elegida | Alternativas | Motivo |
|----------|---------------|--------------|--------|
| Conexión a BD | SQLAlchemy async con `async_session_factory` del proyecto | Conexión sync separada | Reutiliza la misma config y engine del proyecto; evita config duplicada |
| Engine compartido | Crear engine propio con la misma DATABASE_URL | Importar engine de `app.core.database` | No iniciar toda la app FastAPI solo para el seed; evita efectos secundarios del lifespan |
| Limpieza de datos | DELETE FROM en orden inverso de dependencias | TRUNCATE + CASCADE | Más control sobre orden; evita problemas con FKs |
| Capa de inserción | SQLAlchemy ORM directo con `async with session.begin()` | SQL raw, bulk_insert_mappings | Usar los modelos ya definidos; más legible y mantenible |

## Risks / Trade-offs

- [Riesgo] Que la DATABASE_URL del seed quede hardcodeada → Usar la misma lógica de `Settings` del proyecto (lee de `.env` o default)
- [Riesgo] Que los IDs hardcodeados colisionen con datos existentes → El seed limpia las tablas primero
- [Trade-off] Usar el engine directo en vez de importarlo significa que si la config de BD cambia, hay que actualizar ambos lados → mitigado porque ambos usan `Settings`
