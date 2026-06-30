"""Productos — API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.productos.schemas import (
    CategoriaCreate,
    CategoriaResponse,
    ProductoCreate,
    ProductoListResponse,
    ProductoResponse,
    ProductoUpdate,
)
from app.features.productos.service import CategoriaService, ProductoService

categoria_router = APIRouter(prefix="/api/categorias", tags=["categorias"])
producto_router = APIRouter(prefix="/api/productos", tags=["productos"])


# ── Categoria endpoints ──


@categoria_router.get("", response_model=list[CategoriaResponse])
async def list_categorias(db: AsyncSession = Depends(get_db)):
    service = CategoriaService(db)
    return await service.list()


@categoria_router.get("/{id}", response_model=CategoriaResponse)
async def get_categoria(id: str, db: AsyncSession = Depends(get_db)):
    service = CategoriaService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return result


@categoria_router.post("", response_model=CategoriaResponse, status_code=201)
async def create_categoria(data: CategoriaCreate, db: AsyncSession = Depends(get_db)):
    service = CategoriaService(db)
    try:
        return await service.create(data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@categoria_router.put("/{id}", response_model=CategoriaResponse)
async def update_categoria(id: str, data: CategoriaCreate, db: AsyncSession = Depends(get_db)):
    service = CategoriaService(db)
    try:
        result = await service.update(id, data.model_dump())
        if not result:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return result
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@categoria_router.delete("/{id}", status_code=204)
async def delete_categoria(id: str, db: AsyncSession = Depends(get_db)):
    service = CategoriaService(db)
    try:
        result = await service.delete(id)
        if not result:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


# ── Producto endpoints ──


@producto_router.get("", response_model=ProductoListResponse)
async def list_productos(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    categoria_id: str | None = Query(None),
    search: str | None = Query(None),
    include_inactivos: bool = Query(False),
    db: AsyncSession = Depends(get_db),
):
    service = ProductoService(db)
    return await service.list(
        page=page,
        per_page=per_page,
        categoria_id=categoria_id,
        search=search,
        include_inactivos=include_inactivos,
    )


@producto_router.get("/{id}", response_model=ProductoResponse)
async def get_producto(id: str, db: AsyncSession = Depends(get_db)):
    service = ProductoService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return result


@producto_router.post("", response_model=ProductoResponse, status_code=201)
async def create_producto(data: ProductoCreate, db: AsyncSession = Depends(get_db)):
    service = ProductoService(db)
    try:
        return await service.create(data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@producto_router.put("/{id}", response_model=ProductoResponse)
async def update_producto(id: str, data: ProductoUpdate, db: AsyncSession = Depends(get_db)):
    service = ProductoService(db)
    try:
        result = await service.update(id, data.model_dump(exclude_none=True))
        if not result:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@producto_router.patch("/{id}/toggle-activo", response_model=ProductoResponse)
async def toggle_activo_producto(id: str, db: AsyncSession = Depends(get_db)):
    service = ProductoService(db)
    result = await service.toggle_activo(id)
    if not result:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return result
