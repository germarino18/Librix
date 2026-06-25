# C-02: Schema Definition — Propuesta

**Estado**: Draft · **Gobernanza**: CRITICAL · **Depende de**: C-01

---

## Problema

Las 6 features del backend (productos, ventas, stock, caja, insumos, servicios) tienen modelos SQLAlchemy vacíos y schemas Pydantic placeholder. No existe una representación real de las entidades del dominio en la capa de datos ni migraciones Alembic funcionales.

## Solución

Implementar la definición completa del esquema de datos: modelos SQLAlchemy 2.0 con tipo `Mapped`/`mapped_column`, relaciones con `relationship()`, enumeraciones nativas de PostgreSQL, y schemas Pydantic v2 para cada entidad. Generar la migración Alembic inicial que crea todas las tablas con constraints, índices y claves foráneas.

## Alcance

### In scope
- Modelos SQLAlchemy para todas las entidades (9 modelos en 6 features)
- Relaciones ORM entre entidades (cascade, lazy loading)
- Tipos Enum nativos de Python + SQLAlchemy Enum (PostgreSQL)
- Schemas Pydantic request/response para CRUD básico
- Migración Alembic con todas las tablas, constraints, índices
- Seed data opcional para desarrollo

### Out of scope
- Lógica de negocio en service layer (descuento de stock, alertas)
- Endpoints/routers FastAPI (serán C-03, C-04, etc.)
- Validaciones de negocio complejas
- Autenticación/autorización
- Dashboard queries

## Impact Analysis

| Área | Impacto |
|------|---------|
| Backend DB | Nueva migración reemplaza `0001_initial` vacía. Todas las tablas creadas desde cero |
| Frontend | Sin impacto directo (solo schemas compartidos si se usan tipos) |
| Tests | Permite escribir tests de integración con base de datos real |
| Dev setup | Requiere PostgreSQL corriendo para `alembic upgrade head` |

## Architecture Considerations

- **UUID v4** como PK strings → portables, no secuenciales, seguros para exposición en URLs
- **Decimal** para montos y stock → precisión exacta, evita errores de redondeo de float
- **Enum nativo PostgreSQL** → integridad a nivel DB, performance
- **TimestampMixin** → consistencia en auditoría (created_at/updated_at)
- **async engine** → alineado con FastAPI asíncrono

## Success Criteria

- [ ] `alembic upgrade head` ejecuta sin errores
- [ ] Las 9 tablas existen en PostgreSQL con columns correctas
- [ ] Las 7 relaciones FK funcionan (insert/select)
- [ ] Los 6 schemas Pydantic validan/deserializan correctamente
- [ ] `uvicorn app.main:app` inicia sin errores de importación
- [ ] `pytest` pasa (tests existentes)

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| DB existente con datos → migración conflictiva | Usar base de datos limpia (MVP) |
| Naming inconsistente entre modelos | Convención definida en design.md |
| Circular imports entre features | Separación clara por feature, FK solo por ID string |
