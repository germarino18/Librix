# db-migrations

> **Source:** Archived from `c-01-setup-base` (2026-06-25)
> See `openspec/changes/archive/2026-06-25-c-01-setup-base/` for original change context.

## ADDED Requirements

### Requirement: Alembic configured for async

Alembic SHALL be configured to work with SQLAlchemy async engine and asyncpg.

#### Scenario: Async env.py works
- **GIVEN** `alembic env.py` is configured
- **WHEN** `alembic upgrade head` is run
- **THEN** it SHALL use `run_async()` for async migrations

#### Scenario: Autogenerate detects models
- **GIVEN** a SQLAlchemy model is defined
- **WHEN** `alembic revision --autogenerate -m "message"` is run
- **THEN** a migration file SHALL be created reflecting the model

### Requirement: Migration lifecycle

The project SHALL support full migration lifecycle (upgrade, downgrade, history).

#### Scenario: Upgrade applies all migrations
- **GIVEN** no migrations have been applied
- **WHEN** `alembic upgrade head` is run
- **THEN** all pending migrations SHALL be applied

#### Scenario: Downgrade rolls back
- **GIVEN** one migration has been applied
- **WHEN** `alembic downgrade -1` is run
- **THEN** the last migration SHALL be reverted

### Requirement: Initial migration

The first migration SHALL create the database foundations.

#### Scenario: alembic_version table exists
- **GIVEN** the first migration is applied
- **WHEN** checking database tables
- **THEN** the `alembic_version` table SHALL exist

### Requirement: PostgreSQL connection

The system SHALL connect to PostgreSQL via asyncpg.

#### Scenario: Connection succeeds
- **GIVEN** PostgreSQL is running on localhost:5432
- **GIVEN** the `librix` database exists
- **WHEN** `database.py` initializes the engine
- **THEN** it SHALL connect successfully

#### Scenario: Connection failure reports clearly
- **GIVEN** PostgreSQL is not running
- **WHEN** the engine tries to connect
- **THEN** it SHALL raise a clear connection error (not a generic exception)
