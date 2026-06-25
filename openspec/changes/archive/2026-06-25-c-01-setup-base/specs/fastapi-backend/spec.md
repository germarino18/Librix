## ADDED Requirements

### Requirement: Feature-based directory structure

The backend SHALL use feature-based directory structure under `backend/app/features/{feature}/`.

#### Scenario: Feature directory exists
- **GIVEN** the backend project is scaffolded
- **WHEN** listing `backend/app/features/`
- **THEN** it SHALL contain: `productos/`, `ventas/`, `stock/`, `insumos/`, `servicios/`, `caja/`, `dashboard/`

#### Scenario: Feature has standard files
- **GIVEN** a feature directory exists
- **WHEN** listing its contents
- **THEN** it SHALL contain: `models.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`

### Requirement: Config module with Pydantic Settings

The system SHALL have a configuration module using Pydantic Settings v2.

#### Scenario: DATABASE_URL default
- **GIVEN** no environment variable is set
- **WHEN** config is loaded
- **THEN** `DATABASE_URL` SHALL default to `postgresql+asyncpg://postgres:postgres@localhost:5432/librix`

#### Scenario: Environment variable override
- **GIVEN** `DATABASE_URL` environment variable is set
- **WHEN** config is loaded
- **THEN** the value SHALL come from the environment variable

#### Scenario: CORS origins configurable
- **GIVEN** `CORS_ORIGINS` is set to `["http://localhost:5173"]`
- **WHEN** the app starts
- **THEN** CORS middleware SHALL allow requests from that origin

### Requirement: Async database session

The system SHALL use SQLAlchemy 2.0 async with asyncpg for database access.

#### Scenario: Engine creates async session
- **GIVEN** `DATABASE_URL` is valid
- **WHEN** `database.py` is initialized
- **THEN** an async SQLAlchemy engine SHALL be created with asyncpg

#### Scenario: Session dependency works
- **GIVEN** a route uses `Depends(get_db)`
- **WHEN** the route is called
- **THEN** it SHALL receive an async SQLAlchemy `AsyncSession`

#### Scenario: Session is closed after request
- **GIVEN** a request completes
- **WHEN** the response is sent
- **THEN** the database session SHALL be closed

### Requirement: Base model with common columns

The system SHALL have a SQLAlchemy declarative base with common timestamp columns.

#### Scenario: Base model has id and timestamps
- **GIVEN** a model inherits from Base
- **WHEN** inspecting its columns
- **THEN** it SHALL have `id` (UUID, primary key), `created_at` (datetime), `updated_at` (datetime)

### Requirement: FastAPI app with CORS and health endpoint

The FastAPI app SHALL be configured with CORS middleware and a health check endpoint.

#### Scenario: App starts on port 8000
- **GIVEN** the app is started with `uvicorn app.main:app`
- **WHEN** it finishes booting
- **THEN** it SHALL listen on `http://localhost:8000`

#### Scenario: Health endpoint returns OK
- **GIVEN** the app is running
- **WHEN** a GET request is sent to `/api/health`
- **THEN** the response SHALL be `{"status": "ok"}` with HTTP 200

#### Scenario: Swagger docs are available
- **GIVEN** the app is running
- **WHEN** a GET request is sent to `/docs`
- **THEN** the response SHALL be the Swagger UI HTML page

### Requirement: CORS allows frontend origin

The app SHALL allow CORS requests from the frontend development server.

#### Scenario: Frontend origin is allowed
- **GIVEN** the app is running
- **WHEN** a preflight OPTIONS request comes from `http://localhost:5173`
- **THEN** the response SHALL include `Access-Control-Allow-Origin: http://localhost:5173`

### Requirement: Each feature router is mountable

The app SHALL support mounting feature routers under `/api/{feature}`.

#### Scenario: Router mounted at /api/{feature}
- **GIVEN** a feature router exists in `features/productos/router.py`
- **WHEN** it is included in `main.py` with prefix `/api/productos`
- **THEN** its endpoints SHALL be accessible at `/api/productos/...`
