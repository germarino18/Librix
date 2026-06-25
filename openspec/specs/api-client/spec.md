# api-client

> **Source:** Archived from `c-01-setup-base` (2026-06-25)
> See `openspec/changes/archive/2026-06-25-c-01-setup-base/` for original change context.

## ADDED Requirements

### Requirement: Generic HTTP client

The frontend SHALL have a generic HTTP client in `src/lib/api.ts` that wraps fetch calls.

#### Scenario: GET request
- **GIVEN** `api.get('/productos')` is called
- **WHEN** the request is sent
- **THEN** it SHALL send a GET request to `{VITE_API_URL}/productos` with JSON headers

#### Scenario: POST request with body
- **GIVEN** `api.post('/productos', { nombre: 'Test' })` is called
- **WHEN** the request is sent
- **THEN** it SHALL send a POST request with `Content-Type: application/json` and the serialized body

#### Scenario: PUT request
- **GIVEN** `api.put('/productos/123', { nombre: 'Updated' })` is called
- **WHEN** the request is sent
- **THEN** it SHALL send a PUT request to `{VITE_API_URL}/productos/123` with the JSON body

#### Scenario: DELETE request
- **GIVEN** `api.delete('/productos/123')` is called
- **WHEN** the request is sent
- **THEN** it SHALL send a DELETE request to `{VITE_API_URL}/productos/123`

### Requirement: Typed responses

The API client SHALL support generic type parameters for responses.

#### Scenario: Typed GET response
- **GIVEN** `api.get<Producto>('/productos/123')` is called
- **WHEN** the response arrives
- **THEN** it SHALL return a `Producto` typed object

#### Scenario: Typed list response
- **GIVEN** `api.get<Producto[]>('/productos')` is called
- **WHEN** the response arrives
- **THEN** it SHALL return a `Producto[]` typed array

### Requirement: Error handling

The API client SHALL throw typed errors on non-2xx responses.

#### Scenario: 4xx error throws ApiError
- **GIVEN** the API returns HTTP 404
- **WHEN** the response is received
- **THEN** the client SHALL throw an `ApiError` with `status: 404` and the error detail from the response body

#### Scenario: 5xx error throws ApiError
- **GIVEN** the API returns HTTP 500
- **WHEN** the response is received
- **THEN** the client SHALL throw an `ApiError` with `status: 500` and a descriptive message

### Requirement: Configurable base URL

The API client SHALL use `VITE_API_URL` environment variable for the base URL.

#### Scenario: Default URL
- **GIVEN** `VITE_API_URL` is not set
- **WHEN** the client is created
- **THEN** it SHALL default to `http://localhost:8000/api`

#### Scenario: Custom URL from env
- **GIVEN** `VITE_API_URL` is set to `http://localhost:8000/api`
- **WHEN** a request is made
- **THEN** the request URL SHALL start with `http://localhost:8000/api`
