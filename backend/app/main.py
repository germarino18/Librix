"""Librix — FastAPI application."""
import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine
from app.features.insumos.router import router as insumos_router
from app.features.productos.router import categoria_router, producto_router
from app.features.servicios.router import router as servicios_router
from app.features.ventas.router import router as ventas_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    logger.info("Starting Librix API...")
    yield
    logger.info("Shutting down Librix API...")
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log method, path, status code and duration for each request."""
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(
        "%s %s → %s (%.3fs)",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response


app.include_router(insumos_router)
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(servicios_router)
app.include_router(ventas_router)


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "version": settings.APP_VERSION}
